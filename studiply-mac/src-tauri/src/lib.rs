use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager, Runtime, Emitter,
};
use std::sync::Mutex;
use std::process::Command;
use std::fs;
use std::io::{Read, Write};
use serde::{Deserialize, Serialize};

// Marker for our hosts entries
const HOSTS_MARKER_START: &str = "# STUDIPLY FOCUS MODE START";
const HOSTS_MARKER_END: &str = "# STUDIPLY FOCUS MODE END";

// Common distracting websites to block
const DISTRACTING_SITES: &[&str] = &[
    // Social Media
    "facebook.com", "www.facebook.com", "m.facebook.com",
    "instagram.com", "www.instagram.com",
    "twitter.com", "www.twitter.com", "x.com", "www.x.com",
    "tiktok.com", "www.tiktok.com",
    "snapchat.com", "www.snapchat.com",
    "linkedin.com", "www.linkedin.com",
    "pinterest.com", "www.pinterest.com",
    "reddit.com", "www.reddit.com", "old.reddit.com",
    "tumblr.com", "www.tumblr.com",
    "discord.com", "www.discord.com", "discordapp.com",
    "whatsapp.com", "www.whatsapp.com", "web.whatsapp.com",
    "telegram.org", "www.telegram.org", "web.telegram.org",
    "wechat.com", "www.wechat.com", "wx.qq.com",
    "weibo.com", "www.weibo.com",
    
    // Video & Entertainment
    "youtube.com", "www.youtube.com", "m.youtube.com", "youtu.be",
    "netflix.com", "www.netflix.com",
    "twitch.tv", "www.twitch.tv",
    "vimeo.com", "www.vimeo.com",
    "dailymotion.com", "www.dailymotion.com",
    "hulu.com", "www.hulu.com",
    "disneyplus.com", "www.disneyplus.com",
    "primevideo.com", "www.primevideo.com",
    "bilibili.com", "www.bilibili.com",
    "iqiyi.com", "www.iqiyi.com",
    "youku.com", "www.youku.com",
    
    // Gaming
    "steampowered.com", "www.steampowered.com", "store.steampowered.com",
    "epicgames.com", "www.epicgames.com",
    "roblox.com", "www.roblox.com",
    "minecraft.net", "www.minecraft.net",
    "leagueoflegends.com", "www.leagueoflegends.com",
    "blizzard.com", "www.blizzard.com",
    "ea.com", "www.ea.com",
    "ubisoft.com", "www.ubisoft.com",
    
    // News & Media (optional distractions)
    "news.ycombinator.com",
    "buzzfeed.com", "www.buzzfeed.com",
    "9gag.com", "www.9gag.com",
    "imgur.com", "www.imgur.com",
    
    // Shopping
    "amazon.com", "www.amazon.com",
    "ebay.com", "www.ebay.com",
    "aliexpress.com", "www.aliexpress.com",
    "taobao.com", "www.taobao.com",
    "jd.com", "www.jd.com",
    
    // Other
    "spotify.com", "www.spotify.com", "open.spotify.com",
];

// Focus session state
#[derive(Default, Serialize, Deserialize, Clone)]
pub struct FocusState {
    pub is_active: bool,
    pub duration_minutes: u32,
    pub remaining_seconds: u32,
    pub session_type: String,
    pub websites_blocked: bool,
}

// App info
#[derive(Serialize, Deserialize, Clone)]
pub struct AppInfo {
    pub name: String,
    pub path: String,
}

// Global state
pub struct AppState {
    pub focus: Mutex<FocusState>,
    pub allowed_apps: Mutex<Vec<String>>,
    pub allowed_websites: Mutex<Vec<String>>,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            focus: Mutex::new(FocusState::default()),
            allowed_apps: Mutex::new(vec![
                "Finder".to_string(),
                "Studiply".to_string(),
                "System Preferences".to_string(),
                "System Settings".to_string(),
                "Terminal".to_string(),
            ]),
            allowed_websites: Mutex::new(vec![
                "studiply.it".to_string(),
                "localhost".to_string(),
            ]),
        }
    }
}

// Block websites by modifying /etc/hosts
fn block_websites(allowed_sites: &[String]) -> Result<(), String> {
    let hosts_path = "/etc/hosts";
    
    // Read current hosts file
    let mut hosts_content = String::new();
    if let Ok(mut file) = fs::File::open(hosts_path) {
        file.read_to_string(&mut hosts_content).map_err(|e| e.to_string())?;
    }
    
    // Remove any existing Studiply entries
    let cleaned_content = remove_studiply_entries(&hosts_content);
    
    // Build block list (everything except allowed sites)
    let mut block_entries = String::new();
    block_entries.push_str(&format!("\n{}\n", HOSTS_MARKER_START));
    
    for site in DISTRACTING_SITES {
        // Check if site is in allowed list
        let is_allowed = allowed_sites.iter().any(|allowed| {
            site.contains(allowed) || allowed.contains(*site)
        });
        
        if !is_allowed {
            block_entries.push_str(&format!("127.0.0.1 {}\n", site));
        }
    }
    
    block_entries.push_str(&format!("{}\n", HOSTS_MARKER_END));
    
    // Combine and write
    let new_content = format!("{}{}", cleaned_content.trim_end(), block_entries);
    
    // Use osascript to write with admin privileges
    let script = format!(
        r#"do shell script "echo '{}' | sudo tee {}" with administrator privileges"#,
        new_content.replace("'", "'\\''").replace("\n", "\\n"),
        hosts_path
    );
    
    let output = Command::new("osascript")
        .arg("-e")
        .arg(&script)
        .output()
        .map_err(|e| e.to_string())?;
    
    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }
    
    // Flush DNS cache
    let _ = Command::new("dscacheutil")
        .arg("-flushcache")
        .output();
    
    let _ = Command::new("sudo")
        .args(["killall", "-HUP", "mDNSResponder"])
        .output();
    
    Ok(())
}

// Unblock websites by removing entries from /etc/hosts
fn unblock_websites() -> Result<(), String> {
    let hosts_path = "/etc/hosts";
    
    // Read current hosts file
    let mut hosts_content = String::new();
    if let Ok(mut file) = fs::File::open(hosts_path) {
        file.read_to_string(&mut hosts_content).map_err(|e| e.to_string())?;
    }
    
    // Remove Studiply entries
    let cleaned_content = remove_studiply_entries(&hosts_content);
    
    // Write back using osascript with admin privileges
    let script = format!(
        r#"do shell script "echo '{}' | sudo tee {}" with administrator privileges"#,
        cleaned_content.replace("'", "'\\''").replace("\n", "\\n"),
        hosts_path
    );
    
    let output = Command::new("osascript")
        .arg("-e")
        .arg(&script)
        .output()
        .map_err(|e| e.to_string())?;
    
    if !output.status.success() {
        return Err(String::from_utf8_lossy(&output.stderr).to_string());
    }
    
    // Flush DNS cache
    let _ = Command::new("dscacheutil")
        .arg("-flushcache")
        .output();
    
    Ok(())
}

fn remove_studiply_entries(content: &str) -> String {
    let mut result = String::new();
    let mut in_studiply_block = false;
    
    for line in content.lines() {
        if line.contains(HOSTS_MARKER_START) {
            in_studiply_block = true;
            continue;
        }
        if line.contains(HOSTS_MARKER_END) {
            in_studiply_block = false;
            continue;
        }
        if !in_studiply_block {
            result.push_str(line);
            result.push('\n');
        }
    }
    
    result
}

// Commands

#[tauri::command]
fn get_focus_state(state: tauri::State<AppState>) -> FocusState {
    state.focus.lock().unwrap().clone()
}

#[tauri::command]
fn start_focus_session(
    state: tauri::State<AppState>,
    duration_minutes: u32,
    session_type: String,
    should_block_websites: bool,
) -> Result<FocusState, String> {
    let allowed_websites = state.allowed_websites.lock().unwrap().clone();
    
    // Block websites if requested
    if should_block_websites {
        block_websites(&allowed_websites)?;
    }
    
    let mut focus = state.focus.lock().unwrap();
    focus.is_active = true;
    focus.duration_minutes = duration_minutes;
    focus.remaining_seconds = duration_minutes * 60;
    focus.session_type = session_type;
    focus.websites_blocked = should_block_websites;
    
    Ok(focus.clone())
}

#[tauri::command]
fn stop_focus_session(state: tauri::State<AppState>) -> Result<FocusState, String> {
    let mut focus = state.focus.lock().unwrap();
    
    // Unblock websites if they were blocked
    if focus.websites_blocked {
        unblock_websites()?;
    }
    
    focus.is_active = false;
    focus.remaining_seconds = 0;
    focus.websites_blocked = false;
    
    Ok(focus.clone())
}

#[tauri::command]
fn tick_focus_timer(state: tauri::State<AppState>) -> Result<FocusState, String> {
    let mut focus = state.focus.lock().unwrap();
    if focus.is_active && focus.remaining_seconds > 0 {
        focus.remaining_seconds -= 1;
        if focus.remaining_seconds == 0 {
            // Session ended, unblock websites
            if focus.websites_blocked {
                drop(focus); // Release lock before calling unblock
                unblock_websites()?;
                let mut focus = state.focus.lock().unwrap();
                focus.is_active = false;
                focus.websites_blocked = false;
                return Ok(focus.clone());
            }
            focus.is_active = false;
        }
    }
    Ok(focus.clone())
}

#[tauri::command]
fn get_installed_apps() -> Vec<AppInfo> {
    let mut apps = Vec::new();
    let applications_path = "/Applications";
    
    if let Ok(entries) = fs::read_dir(applications_path) {
        for entry in entries.flatten() {
            let path = entry.path();
            if path.extension().map_or(false, |ext| ext == "app") {
                if let Some(name) = path.file_stem() {
                    apps.push(AppInfo {
                        name: name.to_string_lossy().to_string(),
                        path: path.to_string_lossy().to_string(),
                    });
                }
            }
        }
    }
    
    // Also check user Applications
    if let Ok(home) = std::env::var("HOME") {
        let user_apps_path = format!("{}/Applications", home);
        if let Ok(entries) = fs::read_dir(&user_apps_path) {
            for entry in entries.flatten() {
                let path = entry.path();
                if path.extension().map_or(false, |ext| ext == "app") {
                    if let Some(name) = path.file_stem() {
                        apps.push(AppInfo {
                            name: name.to_string_lossy().to_string(),
                            path: path.to_string_lossy().to_string(),
                        });
                    }
                }
            }
        }
    }
    
    apps.sort_by(|a, b| a.name.to_lowercase().cmp(&b.name.to_lowercase()));
    apps
}

#[tauri::command]
fn get_allowed_apps(state: tauri::State<AppState>) -> Vec<String> {
    state.allowed_apps.lock().unwrap().clone()
}

#[tauri::command]
fn set_allowed_apps(state: tauri::State<AppState>, apps: Vec<String>) -> Vec<String> {
    let mut allowed = state.allowed_apps.lock().unwrap();
    *allowed = apps;
    if !allowed.contains(&"Finder".to_string()) {
        allowed.push("Finder".to_string());
    }
    if !allowed.contains(&"Studiply".to_string()) {
        allowed.push("Studiply".to_string());
    }
    allowed.clone()
}

#[tauri::command]
fn get_allowed_websites(state: tauri::State<AppState>) -> Vec<String> {
    state.allowed_websites.lock().unwrap().clone()
}

#[tauri::command]
fn set_allowed_websites(state: tauri::State<AppState>, websites: Vec<String>) -> Vec<String> {
    let mut allowed = state.allowed_websites.lock().unwrap();
    *allowed = websites;
    if !allowed.contains(&"studiply.it".to_string()) {
        allowed.push("studiply.it".to_string());
    }
    allowed.clone()
}

#[tauri::command]
fn get_blocked_sites_list() -> Vec<String> {
    DISTRACTING_SITES.iter().map(|s| s.to_string()).collect()
}

#[tauri::command]
fn check_app_allowed(state: tauri::State<AppState>) -> Option<String> {
    let focus = state.focus.lock().unwrap();
    
    if !focus.is_active {
        return None;
    }
    
    let allowed_apps = state.allowed_apps.lock().unwrap();
    
    let output = Command::new("osascript")
        .arg("-e")
        .arg(r#"tell application "System Events" to get name of first process whose frontmost is true"#)
        .output();
    
    if let Ok(output) = output {
        let frontmost = String::from_utf8_lossy(&output.stdout).trim().to_string();
        
        let is_allowed = allowed_apps.iter().any(|app| {
            frontmost.to_lowercase().contains(&app.to_lowercase()) ||
            app.to_lowercase().contains(&frontmost.to_lowercase())
        });
        
        if !is_allowed && !frontmost.is_empty() {
            return Some(frontmost);
        }
    }
    
    None
}

#[tauri::command]
fn show_overlay(app: tauri::AppHandle) {
    if let Some(overlay) = app.get_webview_window("overlay") {
        let _ = overlay.show();
        let _ = overlay.set_focus();
    } else {
        let _overlay = tauri::WebviewWindowBuilder::new(
            &app,
            "overlay",
            tauri::WebviewUrl::App("/overlay.html".into())
        )
        .title("Stay Focused")
        .fullscreen(true)
        .always_on_top(true)
        .decorations(false)
        .resizable(false)
        .skip_taskbar(true)
        .build();
    }
}

#[tauri::command]
fn hide_overlay(app: tauri::AppHandle) {
    if let Some(overlay) = app.get_webview_window("overlay") {
        let _ = overlay.hide();
    }
}

#[tauri::command]
fn show_window(app: tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.show();
        let _ = window.set_focus();
    }
}

#[tauri::command]
fn hide_window(app: tauri::AppHandle) {
    if let Some(window) = app.get_webview_window("main") {
        let _ = window.hide();
    }
}

#[tauri::command]
fn open_url(url: String) -> Result<(), String> {
    Command::new("open")
        .arg(&url)
        .spawn()
        .map_err(|e| e.to_string())?;
    Ok(())
}

fn create_tray<R: Runtime>(app: &tauri::AppHandle<R>) -> tauri::Result<()> {
    let quit_i = MenuItem::with_id(app, "quit", "Quit Studiply", true, None::<&str>)?;
    let show_i = MenuItem::with_id(app, "show", "Show Window", true, None::<&str>)?;
    
    let menu = Menu::with_items(app, &[&show_i, &quit_i])?;

    let _ = TrayIconBuilder::with_id("main")
        .icon(app.default_window_icon().unwrap().clone())
        .menu(&menu)
        .show_menu_on_left_click(false)
        .on_menu_event(|app, event| match event.id.as_ref() {
            "quit" => {
                // Unblock websites before quitting
                let _ = unblock_websites();
                app.exit(0);
            }
            "show" => {
                if let Some(window) = app.get_webview_window("main") {
                    let _ = window.show();
                    let _ = window.set_focus();
                }
            }
            _ => {}
        })
        .on_tray_icon_event(|tray, event| {
            if let TrayIconEvent::Click {
                button: MouseButton::Left,
                button_state: MouseButtonState::Up,
                ..
            } = event
            {
                let app = tray.app_handle();
                if let Some(window) = app.get_webview_window("main") {
                    if window.is_visible().unwrap_or(false) {
                        let _ = window.hide();
                    } else {
                        let _ = window.show();
                        let _ = window.set_focus();
                    }
                }
            }
        })
        .build(app)?;

    Ok(())
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_opener::init())
        .plugin(tauri_plugin_notification::init())
        .plugin(tauri_plugin_deep_link::init())
        .manage(AppState::default())
        .setup(|app| {
            create_tray(&app.handle())?;
            
            // Deep links are handled by the plugin automatically
            // The frontend listens for the deep-link event
            
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_focus_state,
            start_focus_session,
            stop_focus_session,
            tick_focus_timer,
            get_installed_apps,
            get_allowed_apps,
            set_allowed_apps,
            get_allowed_websites,
            set_allowed_websites,
            get_blocked_sites_list,
            check_app_allowed,
            show_overlay,
            hide_overlay,
            show_window,
            hide_window,
            open_url
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

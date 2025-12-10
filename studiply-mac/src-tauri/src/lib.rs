use tauri::{
    menu::{Menu, MenuItem},
    tray::{MouseButton, MouseButtonState, TrayIconBuilder, TrayIconEvent},
    Manager, Runtime,
};
use std::sync::Mutex;
use serde::{Deserialize, Serialize};

// Focus session state
#[derive(Default, Serialize, Deserialize, Clone)]
pub struct FocusState {
    pub is_active: bool,
    pub duration_minutes: u32,
    pub remaining_seconds: u32,
    pub session_type: String,
}

// Global state
pub struct AppState {
    pub focus: Mutex<FocusState>,
}

impl Default for AppState {
    fn default() -> Self {
        Self {
            focus: Mutex::new(FocusState::default()),
        }
    }
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
) -> FocusState {
    let mut focus = state.focus.lock().unwrap();
    focus.is_active = true;
    focus.duration_minutes = duration_minutes;
    focus.remaining_seconds = duration_minutes * 60;
    focus.session_type = session_type;
    focus.clone()
}

#[tauri::command]
fn stop_focus_session(state: tauri::State<AppState>) -> FocusState {
    let mut focus = state.focus.lock().unwrap();
    focus.is_active = false;
    focus.remaining_seconds = 0;
    focus.clone()
}

#[tauri::command]
fn tick_focus_timer(state: tauri::State<AppState>) -> FocusState {
    let mut focus = state.focus.lock().unwrap();
    if focus.is_active && focus.remaining_seconds > 0 {
        focus.remaining_seconds -= 1;
        if focus.remaining_seconds == 0 {
            focus.is_active = false;
        }
    }
    focus.clone()
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
        .manage(AppState::default())
        .setup(|app| {
            create_tray(&app.handle())?;
            Ok(())
        })
        .invoke_handler(tauri::generate_handler![
            get_focus_state,
            start_focus_session,
            stop_focus_session,
            tick_focus_timer,
            show_window,
            hide_window
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}

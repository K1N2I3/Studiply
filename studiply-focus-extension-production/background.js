// Studiply Focus Mode Extension - Background Script
// Production version for Chrome Web Store

console.log('🚀 Studiply Focus Mode extension loaded');

let focusModeActive = false;
let blockedSites = [];
let sessionData = null;

// Default blocked sites
const DEFAULT_BLOCKED_SITES = [
  'facebook.com',
  'instagram.com',
  'twitter.com',
  'x.com',
  'tiktok.com',
  'youtube.com',
  'reddit.com',
  'snapchat.com',
  'discord.com',
  'netflix.com'
];

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('📨 Background received message:', request);
  
  switch (request.action) {
    case 'startFocus':
      handleStartFocus(request.data);
      sendResponse({ success: true });
      break;
      
    case 'stopFocus':
      handleStopFocus();
      sendResponse({ success: true });
      break;
      
    case 'getStatus':
      sendResponse({ 
        active: focusModeActive, 
        blockedSites: blockedSites,
        sessionData: sessionData 
      });
      break;
      
    case 'updateBlockedSites':
      updateBlockedSites(request.sites);
      sendResponse({ success: true });
      break;
      
    default:
      sendResponse({ success: false, error: 'Unknown action' });
  }
  
  return true; // Keep message channel open
});

async function handleStartFocus(data) {
  console.log('🎯 Starting focus mode with data:', data);
  
  focusModeActive = true;
  blockedSites = data.blockedSites || DEFAULT_BLOCKED_SITES;
  sessionData = {
    sessionType: data.sessionType || 'pomodoro',
    duration: data.duration || 25,
    startTime: data.startTime || new Date().toISOString()
  };
  
  // Save to storage
  await chrome.storage.local.set({
    focusModeActive: focusModeActive,
    blockedSites: blockedSites,
    sessionData: sessionData
  });
  
  // Update blocking rules
  await updateBlockingRules();
  
  console.log('✅ Focus mode started successfully');
}

async function handleStopFocus() {
  console.log('�� Stopping focus mode');
  
  focusModeActive = false;
  blockedSites = [];
  sessionData = null;
  
  // Clear storage
  await chrome.storage.local.clear();
  
  // Clear blocking rules
  await clearBlockingRules();
  
  console.log('✅ Focus mode stopped successfully');
}

async function updateBlockedSites(sites) {
  blockedSites = sites || DEFAULT_BLOCKED_SITES;
  
  if (focusModeActive) {
    await updateBlockingRules();
  }
  
  // Save to storage
  await chrome.storage.local.set({ blockedSites: blockedSites });
}

async function updateBlockingRules() {
  if (!chrome.declarativeNetRequest) {
    console.error('❌ declarativeNetRequest API not available');
    return;
  }
  
  try {
    // Clear existing rules
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: Array.from({length: 100}, (_, i) => i + 1)
    });
    
    // Create new blocking rules
    const rules = blockedSites.flatMap((site, index) => [
      // Block exact domain
      {
        id: index * 4 + 1,
        priority: 1,
        action: { type: 'redirect', redirect: { extensionPath: '/blocked.html' } },
        condition: { urlFilter: `*://${site}`, resourceTypes: ['main_frame'] }
      },
      // Block with www
      {
        id: index * 4 + 2,
        priority: 1,
        action: { type: 'redirect', redirect: { extensionPath: '/blocked.html' } },
        condition: { urlFilter: `*://www.${site}`, resourceTypes: ['main_frame'] }
      },
      // Block with any subdomain
      {
        id: index * 4 + 3,
        priority: 1,
        action: { type: 'redirect', redirect: { extensionPath: '/blocked.html' } },
        condition: { urlFilter: `*://*.${site}`, resourceTypes: ['main_frame'] }
      },
      // Block with https and http
      {
        id: index * 4 + 4,
        priority: 1,
        action: { type: 'redirect', redirect: { extensionPath: '/blocked.html' } },
        condition: { urlFilter: `*://${site}/*`, resourceTypes: ['main_frame'] }
      }
    ]);
    
    // Add new rules
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rules
    });
    
    console.log(`✅ Added ${rules.length} blocking rules for ${blockedSites.length} sites`);
  } catch (error) {
    console.error('❌ Error updating blocking rules:', error);
  }
}

async function clearBlockingRules() {
  if (!chrome.declarativeNetRequest) {
    console.error('❌ declarativeNetRequest API not available');
    return;
  }
  
  try {
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: Array.from({length: 100}, (_, i) => i + 1)
    });
    console.log('✅ Cleared all blocking rules');
  } catch (error) {
    console.error('❌ Error clearing blocking rules:', error);
  }
}

// Extension installation/startup
chrome.runtime.onInstalled.addListener(async () => {
  console.log('🎉 Studiply Focus Mode extension installed');
  
  // Initialize default state
  focusModeActive = false;
  blockedSites = DEFAULT_BLOCKED_SITES;
  sessionData = null;
  
  // Save default settings
  await chrome.storage.local.set({
    focusModeActive: false,
    blockedSites: DEFAULT_BLOCKED_SITES,
    sessionData: null
  });
});

// Load saved state on startup
chrome.runtime.onStartup.addListener(async () => {
  console.log('🔄 Extension startup - loading saved state');
  
  try {
    const result = await chrome.storage.local.get([
      'focusModeActive',
      'blockedSites',
      'sessionData'
    ]);
    
    focusModeActive = result.focusModeActive || false;
    blockedSites = result.blockedSites || DEFAULT_BLOCKED_SITES;
    sessionData = result.sessionData || null;
    
    console.log('�� Loaded state:', { focusModeActive, blockedSites: blockedSites.length, sessionData });
  } catch (error) {
    console.error('❌ Error loading saved state:', error);
  }
});

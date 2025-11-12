// Background script for Studiply Focus Mode Extension

let focusModeActive = false;
let blockedSites = [];
let currentSessionData = null;
let blockedSitesCount = 0;

// Listen for messages from content script or popup
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  console.log('Background received message:', request);
  
  switch (request.action) {
    case 'startFocus':
      startFocusMode(request.data);
      sendResponse({ success: true });
      break;
      
    case 'stopFocus':
      stopFocusMode();
      sendResponse({ success: true });
      break;
      
    case 'getStatus':
      sendResponse({ 
        active: focusModeActive, 
        blockedSites: blockedSites,
        sessionData: currentSessionData ? {
          ...currentSessionData,
          blockedSitesCount: blockedSitesCount
        } : null
      });
      break;
      
    case 'updateBlockedSites':
      blockedSites = request.sites || [];
      sendResponse({ success: true });
      break;
      
    case 'incrementBlockedCount':
      blockedSitesCount++;
      sendResponse({ success: true, count: blockedSitesCount });
      break;
  }
});

// Start focus mode
async function startFocusMode(data) {
  console.log('Starting focus mode with data:', data);
  
  focusModeActive = true;
  currentSessionData = data;
  blockedSitesCount = 0; // Reset counter for new session
  
  // Check if "Block All Websites" is enabled
  if (data.blockedSites && data.blockedSites.includes('*')) {
    blockedSites = ['*']; // Special flag for blocking all websites
    console.log('🌐 Block All Websites mode enabled');
  } else {
    blockedSites = data.blockedSites || [
      'facebook.com',
      'instagram.com',
      'twitter.com',
      'x.com',
      'tiktok.com',
      'youtube.com',
      'reddit.com',
      'snapchat.com'
    ];
  }
  
  // Close existing tabs with blocked sites
  await closeBlockedTabs();
  
  // Create blocking rules
  await createBlockingRules();
  
  // Save to storage
  await chrome.storage.local.set({
    focusModeActive: true,
    blockedSites: blockedSites,
    sessionData: currentSessionData,
    startTime: Date.now()
  });
  
  console.log('Focus mode started successfully');
}

// Close existing tabs with blocked sites
async function closeBlockedTabs() {
  try {
    console.log('🔍 Checking for existing blocked tabs...');
    
    // Get all tabs
    const tabs = await chrome.tabs.query({});
    console.log(`Found ${tabs.length} tabs to check`);
    
    const tabsToClose = [];
    
    // Check each tab
    for (const tab of tabs) {
      if (tab.url && tab.id) {
        let isBlocked = false;
        
        // If "Block All Websites" is enabled
        if (blockedSites.includes('*')) {
          try {
            const url = new URL(tab.url);
            console.log('🔍 Block All Websites - Checking URL:', tab.url);
            console.log('🔍 Hostname:', url.hostname);
            
            // Allow only Studiply domains and Chrome extension pages
            const allowedDomains = [
              'studiply.it',
              'www.studiply.it',
              'studiply.vercel.app',
              'localhost',
              '127.0.0.1',
              'chrome-extension:',
              'chrome:',
              'moz-extension:',
              'edge:',
              'about:'
            ];
            
            console.log('🔍 Allowed domains:', allowedDomains);
            
            // Check if the URL is from an allowed domain
            const isAllowed = allowedDomains.some(domain => {
              if (domain.includes('://')) {
                // Protocol-based check
                const matches = tab.url.startsWith(domain);
                console.log(`🔍 Protocol check ${domain}:`, matches);
                return matches;
              } else {
                // Domain-based check
                const matches = url.hostname === domain || url.hostname.endsWith(`.${domain}`);
                console.log(`🔍 Domain check ${domain}:`, matches, `(hostname: ${url.hostname})`);
                return matches;
              }
            });
            
            console.log('🔍 Is allowed:', isAllowed);
            isBlocked = !isAllowed;
            console.log('🔍 Is blocked:', isBlocked);
          } catch (e) {
            // If URL parsing fails, block everything except allowed protocols
            const allowedProtocols = ['chrome-extension:', 'chrome:', 'moz-extension:', 'edge:', 'about:'];
            isBlocked = !allowedProtocols.some(protocol => tab.url.startsWith(protocol));
          }
        } else {
          // Normal blocking logic for specific sites
          isBlocked = blockedSites.some(site => {
            try {
              const url = new URL(tab.url);
              return url.hostname.includes(site) || url.hostname.includes(`www.${site}`);
            } catch (e) {
              // If URL parsing fails, check if the URL string contains the site
              return tab.url.includes(site);
            }
          });
        }
        
        if (isBlocked) {
          tabsToClose.push(tab.id);
          console.log(`🚫 Found blocked tab: ${tab.url} (ID: ${tab.id})`);
        }
      }
    }
    
    // Close blocked tabs
    if (tabsToClose.length > 0) {
      console.log(`🗑️ Closing ${tabsToClose.length} blocked tabs`);
      await chrome.tabs.remove(tabsToClose);
      
      // Show notification
      chrome.notifications.create({
        type: 'basic',
        iconUrl: 'icons/icon48.png',
        title: 'Studiply Focus Mode',
        message: `Closed ${tabsToClose.length} blocked tab(s) to help you stay focused!`
      });
    } else {
      console.log('✅ No blocked tabs found');
    }
    
  } catch (error) {
    console.error('❌ Error closing blocked tabs:', error);
  }
}

// Stop focus mode
async function stopFocusMode() {
  console.log('Stopping focus mode');
  
  focusModeActive = false;
  currentSessionData = null;
  
  // Remove all blocking rules
  await removeBlockingRules();
  
  // Clear storage
  await chrome.storage.local.clear();
  
  console.log('Focus mode stopped successfully');
}

// Create blocking rules using declarativeNetRequest
async function createBlockingRules() {
  try {
    console.log('🔧 Creating blocking rules for sites:', blockedSites);
    
    // Check if declarativeNetRequest permission is available
    if (!chrome.declarativeNetRequest) {
      console.error('❌ declarativeNetRequest API not available');
      return;
    }
    
    console.log('✅ declarativeNetRequest API is available');
    
    // First, remove any existing rules
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40] // Remove rules 1-40
    });
    console.log('🗑️ Removed existing rules');
    
    let rules = [];
    
    // If "Block All Websites" is enabled
    if (blockedSites.includes('*')) {
      console.log('🌐 Creating "Block All Websites" rules');
      
      // Create a comprehensive list of domains to block
      const blockedDomains = [
        // Social Media
        'facebook.com', 'twitter.com', 'instagram.com', 'tiktok.com', 
        'youtube.com', 'reddit.com', 'discord.com', 'snapchat.com',
        'pinterest.com', 'linkedin.com', 'whatsapp.com', 'telegram.org',
        'twitch.tv', 'vimeo.com', 'dailymotion.com',
        
        // Entertainment
        'netflix.com', 'spotify.com', 'amazon.com', 'hulu.com',
        'disney.com', 'hbo.com', 'paramount.com', 'peacock.com',
        
        // Shopping
        'ebay.com', 'aliexpress.com', 'wish.com', 'etsy.com',
        'walmart.com', 'target.com', 'bestbuy.com', 'costco.com',
        
        // Search Engines & News
        'google.com', 'bing.com', 'yahoo.com', 'duckduckgo.com',
        'cnn.com', 'bbc.com', 'nytimes.com', 'wsj.com',
        'bloomberg.com', 'forbes.com', 'techcrunch.com', 'mashable.com',
        'engadget.com', 'theverge.com', 'arstechnica.com', 'wired.com',
        'gizmodo.com', 'reuters.com', 'ap.org', 'npr.org',
        
        // Tech & Development
        'github.com', 'stackoverflow.com', 'wikipedia.org',
        'medium.com', 'dev.to', 'hashnode.com', 'freecodecamp.org',
        
        // Gaming
        'steam.com', 'epicgames.com', 'xbox.com', 'playstation.com',
        'nintendo.com', 'roblox.com', 'minecraft.net',
        
        // Other Popular Sites
        'imdb.com', 'rottentomatoes.com', 'metacritic.com',
        'weather.com', 'accuweather.com', 'weather.gov',
        'craigslist.org', 'indeed.com', 'monster.com', 'ziprecruiter.com'
      ];
      
      // Create blocking rules for each domain and its variations
      rules = [];
      let ruleId = 1;
      
      blockedDomains.forEach(domain => {
        // Block main domain
        rules.push({
          id: ruleId++,
          priority: 1,
          action: {
            type: 'redirect',
            redirect: {
              extensionPath: '/blocked.html'
            }
          },
          condition: {
            urlFilter: `*://${domain}/*`,
            resourceTypes: ['main_frame']
          }
        });
        
        // Block www subdomain
        rules.push({
          id: ruleId++,
          priority: 1,
          action: {
            type: 'redirect',
            redirect: {
              extensionPath: '/blocked.html'
            }
          },
          condition: {
            urlFilter: `*://www.${domain}/*`,
            resourceTypes: ['main_frame']
          }
        });
        
        // Block all subdomains
        rules.push({
          id: ruleId++,
          priority: 1,
          action: {
            type: 'redirect',
            redirect: {
              extensionPath: '/blocked.html'
            }
          },
          condition: {
            urlFilter: `*://*.${domain}/*`,
            resourceTypes: ['main_frame']
          }
        });
      });
      
      // Add a catch-all rule to block everything else, but exclude Studiply domains
      rules.push({
        id: 1000,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            extensionPath: '/blocked.html'
          }
        },
        condition: {
          urlFilter: '*://*/*',
          resourceTypes: ['main_frame'],
          excludedRequestDomains: [
            'studiply.it',
            'www.studiply.it',
            'studiply.vercel.app',
            'localhost',
            '127.0.0.1'
          ]
        }
      });
    } else {
      // Create new blocking rules with more comprehensive patterns
      rules = blockedSites.flatMap((site, index) => [
      // Block exact domain
      {
        id: index * 4 + 1,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            extensionPath: '/blocked.html'
          }
        },
        condition: {
          urlFilter: `*://${site}`,
          resourceTypes: ['main_frame']
        }
      },
      // Block with www
      {
        id: index * 4 + 2,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            extensionPath: '/blocked.html'
          }
        },
        condition: {
          urlFilter: `*://www.${site}`,
          resourceTypes: ['main_frame']
        }
      },
      // Block with any subdomain
      {
        id: index * 4 + 3,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            extensionPath: '/blocked.html'
          }
        },
        condition: {
          urlFilter: `*://*.${site}`,
          resourceTypes: ['main_frame']
        }
      },
      // Block with https and http
      {
        id: index * 4 + 4,
        priority: 1,
        action: {
          type: 'redirect',
          redirect: {
            extensionPath: '/blocked.html'
          }
        },
        condition: {
          urlFilter: `*://${site}/*`,
          resourceTypes: ['main_frame']
        }
      }
    ]);
    }
    
    console.log('📋 Rules to create:', rules);
    
    // Add the rules
    await chrome.declarativeNetRequest.updateDynamicRules({
      addRules: rules
    });
    
    console.log(`✅ Created ${rules.length} blocking rules successfully`);
    
    // Verify rules were created
    const existingRules = await chrome.declarativeNetRequest.getDynamicRules();
    console.log('🔍 Current dynamic rules:', existingRules);
    
  } catch (error) {
    console.error('❌ Error creating blocking rules:', error);
  }
}

// Remove all blocking rules
async function removeBlockingRules() {
  try {
    console.log('🗑️ Removing all blocking rules...');
    
    // Remove all possible rule IDs (1-1000 to cover all potential rules)
    const ruleIdsToRemove = Array.from({length: 1000}, (_, i) => i + 1);
    
    await chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: ruleIdsToRemove
    });
    
    console.log('✅ Removed all blocking rules (IDs 1-1000)');
  } catch (error) {
    console.error('❌ Error removing blocking rules:', error);
  }
}

// Check if extension is installed and ready
chrome.runtime.onInstalled.addListener(() => {
  console.log('Studiply Focus Mode extension installed');
});

// Listen for tab updates to show notifications
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (focusModeActive && changeInfo.status === 'complete' && tab.url) {
    // Check if the tab is trying to access a blocked site
    const isBlocked = blockedSites.some(site => tab.url.includes(site));
    if (isBlocked) {
      // Show notification
      chrome.notifications.create({
        type: 'basic',
        title: 'Studiply Focus Mode',
        message: 'This site is blocked during your focus session!'
      });
    }
  }
});

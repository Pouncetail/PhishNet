async function checkURLWithVirusTotal( url, tabId )
{
  const apiKey = 'cb633e8b8542e6a282da05f524154636d309f4c2cea85dfc201971ea73e52f4f';

  if ( !url || !url.startsWith( "http" ) || url.startsWith('chrome://') || url.startsWith( 'chrome-extension://' ) ) {
    console.log( "Skipping non-http URL:", url );
    return false;
  }

  try {
    const base64url = btoa( url ).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

    const options = {
      method: 'GET',
      headers: {
        accept: 'application/json',
        'x-apikey': apiKey
      }
    };

    console.log( "Checking URL with VirusTotal:", url );
    const res = await fetch( 'https://www.virustotal.com/api/v3/urls/' + base64url, options );
    
    if ( !res.ok ) {
      console.error( `VirusTotal API error: ${res.status}` );
      return false;
    }
    
    const data = await res.json();
    console.log( "VirusTotal response:", data );

    if ( !data?.data?.attributes ) {
      console.error( "Error: VirusTotal response is missing necessary attributes." );
      return false;
    }

    const stats = data.data.attributes.last_analysis_stats;
    const isMalicious = stats.malicious > 0;

    if ( !isMalicious ) {
      console.log( "URL appears safe." );
      return false;
    }

    console.log( "URL flagged as malicious!" );
    
    const analysisResults = data.data.attributes.last_analysis_results;
    const flaggedVendors = [];

    for ( const [vendor, result] of Object.entries( analysisResults ) ) {

      if ( ['malicious', 'suspicious'].includes( result.category ) ) {

        flaggedVendors.push({
          vendor: result.engine_name || vendor,
          reason: result.result || result.category
        });

      }

    }

    let reasonText = '';
    if ( flaggedVendors.length > 0 ) {
      reasonText = `Flagged by ${flaggedVendors.length} vendors:\n` + flaggedVendors.map( v => `• ${v.vendor}: ${v.reason}` ).join( '\n' );
    }
    else {
      reasonText = "Flagged as malicious, but no specific vendor details available.";
    }
    
    const geminiSummary = await generateGeminiSummary( reasonText, url );
    console.log( "Gemini summary:", geminiSummary );
    
    chrome.storage.local.set({
      blockedUrl: url,
      vtReason: reasonText,
      geminiSummary: geminiSummary
    }, () => {

      if ( chrome.runtime.lastError ) {
        console.error( "Error storing data:", chrome.runtime.lastError );
      }
      else {
        console.log( "Data saved to chrome.storage.local" );
        
        chrome.tabs.update(tabId, {
          url: chrome.runtime.getURL( "blocked.html" )
        });
      }

    });
    
    return true;
  }
  catch ( err ) {
    console.error( "Error in VirusTotal check:", err );
    
    return false;
  }

}

async function generateGeminiSummary( reasonText, url )
{
  const geminiKey = 'AIzaSyB9i2xChCkg-RGxwb4JmdBosY6F01gcZFA';

  const prompt = `A user visited the website ${url}. The following security vendors flagged it:\n${reasonText}\n\nGive a 2-3 sentence summary of what this site might be trying to do and why it was flagged as malicious.`;

  try {
    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${geminiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: prompt }]
        }]
      })
    });

    if ( !res.ok ) {
      console.error( `Gemini API error: ${res.status}` );
      return "Could not generate summary due to an API error.";
    }

    const result = await res.json();
    console.log( "Gemini API response:", result );
    
    const summary = result?.candidates?.[0]?.content?.parts?.[0]?.text;
    
    if ( !summary ) {
      console.error( "No summary text found in Gemini response" );
      return "Unable to generate a summary.";
    }
    
    return summary;
  }
  catch ( err ) {
    console.error( "Error generating Gemini summary:", err );
    
    return "Could not generate summary due to an error.";
  }

}const rmmLinks = [

  "action1.com",

  "aeroadmin.com",

  "wangwang.taobao.com",

  "alpemix.com",

  "ammyy.com",

  "anydesk.com",

  "anyplace-control.com",

  "atera.com",

  "aweray.com",

  "aweray.net",

  "auvik.com",

  "barracudamsp.com",

  "basecamp.com",

  "beamyourscreen.com",

  "beanywhere.en.uptodown.com/windows",

  "beyondtrust.com/brand/bomgar",

  "datto.com/au/products/rmm/",

  "remotedesktop.google.com",

  "cloudflare.com/products/tunnel/",

  "control.connectwise.com",

  "one.comodo.com",

  "crossloop.en.softonic.com",

  "crosstecsoftware.com/remotecontrol",

  "resources.doradosoftware.com/cruz-rmm",

  "dameware.com",

  "datto.com",

  "deskday.ai",

  "devolutions.net/remote-desktop-manager/",

  "learn.microsoft.com/en-us/azure/developer/dev-tunnels/overview",

  "domotz.com",

  "dwservice.net",

  "ehorus.com",

  "electric.ai",

  "emcosoftware.com",

  "encapto.com",

  "ericom.com",

  "eset.com/me/business/remote-management/remote-administrator/",

  "ezhelp.co.kr",

  "fastviewer.com",

  "fixme.it",

  "fleetdeck.io",

  "fortra.com",

  "gatherplace.com",

  "getscreen.me",

  "goto.com",

  "gotohttp.com",

  "get.gotomypc.com",

  "goverlan.com",

  "guacamole.apache.org",

  "helpbeam.software.informer.com",

  "01com.com/imintouch-remote-pc-desktop",

  "instanthousecall.com",

  "intelliadmin.com/remote-control",

  "iperiusremote.com",

  "islonline.com",

  "jumpdesktop.com",

  "repairtechsolutions.com/kabuto/",

  "kaseya.com",

  "kickidler.com",

  "connectwise.com",

  "ivanti.com",

  "everywhere.laplink.com",

  "wen.laplink.com/product/laplink-gold",

  "level.io",

  "litemanager.com",

  "logmein.com/central",

  "logmeinrescue.com",

  "manageengine.com/remote-monitoring-management/",

  "meshcentral.com",

  "mikogo.com",

  "mionet.com",

  "mremoteng.org",

  "msp360.com",

  "myivo-server.software.informer.com",

  "naverisk.com",

  "n-able.com",

  "imperosoftware.com/impero-connect/",

  "netsupportmanager.com",

  "netreo.com",

  "neturo.com",

  "download.cnet.com/Net-Viewer/3000-2370_4-10034828.html",

  "ngrok.com",

  "ninjaone.com",

  "nomachine.com",

  "qq-messenger.en.softonic.com",

  "www.quest.com/kace/",

  "https://remoteassistance.support.services.microsoft.com",

  "radmin.com",

  "systemmanager.ru/dntu.en/rdp_view.htm",

  "remobo.en.softonic.com",

  "donkz.nl",

  "remote.it",

  "rmansys.ru",

  "remotecall.com",

  "remotepass.com",

  "remotepc.com",

  "content.rview.com",

  "ivanti.com/",

  "royalapps.com",

  "rport.io",

  "rudesktop.ru",

  "runsmart.io",

  "rustdesk.com",

  "https://thedfirreport.com/2023/09/25/from-screenconnect-to-hive-ransomware-in-61-hours/",

  "seetrol.co.kr",

  "senso.cloud",

  "skyfex.com",

  "showmypc.com",

  "simple-help.com",

  "site24x7.com/msp",

  "community.sophos.com/on-premise-endpoint/f/sophos-endpoint-software/5725/sophos-remote-management-system",

  "splashtop.com",

  "spyanywhere.com",

  "supremocontrol.com",

  "syncromsp.com",

  "tailscale.com",

  "docs.tacticalrmm.com",

  "tanium.com/products/tanium-deploy",

  "teamviewer.com",

  "tele-desk.com",

  "todesktop.com",

  "acceo.com/turbomeeting/",

  "ultraviewer.net",

  "realvnc.com/en/connect/download/vnc",

  "weezo.en.softonic.com",

  "xeox.com",

  "zabbix.com",

  "zerotier.com",

  "zoho.com/assist/"

];

function getDomain(url) {

  try {

    return new URL(url).hostname;

  } catch (e) {

    return '';

  }

}
let extensionEnabled = true;


// // 1. Check initial state of the toggle on startup

chrome.storage.sync.get("extensionEnabled", (data) => {
  extensionEnabled = data.extensionEnabled ?? true; // default to true if undefined

  
});

// 2. Listen for changes to the toggle
chrome.storage.onChanged.addListener((changes, area) => {
  if (area === "sync" && changes.extensionEnabled) {
    extensionEnabled = changes.extensionEnabled.newValue;

    console.log(`Extension is now ${extensionEnabled ? "enabled" : "disabled"}`);
  }
});


chrome.tabs.onUpdated.addListener( (tabId, changeInfo, tab ) => {

  if (!extensionEnabled) return;


  if ( changeInfo.status === "loading" && tab.url ) {

    chrome.storage.sync.get(["urlList"], function(result) {
      const storedUrls = result.urlList || []; // Fallback to empty array if undefined
      const currentUrl = tab.url;

      console.log(storedUrls)
      const match = storedUrls.find(storedUrl => currentUrl.includes(storedUrl));
    
      if (match) {
        console.log("Matched with:", match);
      } else if (rmmLinks.some(link => currentUrl.includes(link))) {

        const domain = getDomain(currentUrl);

      

        chrome.storage.local.get(['bypassDomains'], function (data) {

          const bypassList = data.bypassDomains || [];

      

          if (!bypassList.includes(domain)) {

            console.log("Intercepting domain:", domain);

            chrome.storage.local.set({

              url: currentUrl,

              domain: domain

            });

      

            chrome.tabs.update(tabId, {

              url: chrome.runtime.getURL("intercept.html")

            });

          } else {

            console.log("Bypassing previously approved domain:", domain);

          }

        }); 
      }else {
        console.log( `Tab ${tabId} loading: ${tab.url}` );
        checkURLWithVirusTotal( tab.url, tabId ).catch(err => {
        console.error( "Error in URL check:", err );
        });
      }
    });
    
  }

});




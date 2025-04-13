function loadBlockData()
{
    console.log( "Loading block data from storage..." );

    chrome.storage.local.get( ['blockedUrl', 'vtReason', 'geminiSummary'], function ( result ) {
        console.log( "Data retrieved from storage:", result );

        document.getElementById( 'loading' ).style.display = 'none';
        document.getElementById( 'content' ).style.display = 'flex';

        document.getElementById( 'blocked-url' ).textContent = result.blockedUrl || 'Unknown URL';
        document.getElementById( 'vt-reason' ).textContent = result.vtReason || 'No detailed reason available.';
        document.getElementById( 'gemini-summary' ).textContent = result.geminiSummary || 'No summary available.';
    });

}

document.addEventListener( 'DOMContentLoaded', loadBlockData );
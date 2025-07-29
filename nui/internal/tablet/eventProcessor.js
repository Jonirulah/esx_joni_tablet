// This function will print all available and loaded apps in the tablet.
function appList() {
    const apps = document.getElementsByClassName('applet');
    for (let app of apps) {
        console.debug("[INFO] Registered App", app.id);
    };
};

// This function will forward messages to other iframes or chosen iframe.
const messageQueue = {};

function forwardMessage(iframeId, data) {
    const iframe = document.getElementById(iframeId);
    if (iframe) {
        iframe.contentWindow.postMessage({ data: data }, '*');
        console.debug("[Tablet Event Processor] INFO: Posted to", iframeId)
    } else {
        console.debug("[Tablet Event Processor] INFO:", iframeId, "is not open, sending to queue!")
        if (!messageQueue[iframeId]) { messageQueue[iframeId] = [] };
        messageQueue[iframeId].push(data);
    };
};

function processQueuedMessages() {
    for (const iframeId in messageQueue) {
        const iframe = document.getElementById(iframeId);
        if (iframe && messageQueue[iframeId].length > 0) {
            while (messageQueue[iframeId].length > 0) {
                const data = messageQueue[iframeId].shift();
                iframe.contentWindow.postMessage({ data: data }, '*');
            };
        };
    };
};

// Listener for FiveM events to forward them later on.
window.addEventListener('message', async({ data }) => {
    // Message for Event Processor
    if (!data.app) {
        console.debug("[Tablet Event Processor] ERROR: Received a message but parameter app is missing!", appList());
        return
    } else if (data.app == 'internal') {
        //console.debug("[Tablet Event Processor] INFO: Received Internal Event | Data:", JSON.stringify(data))
        forwardInternal(data);
        return
    } else if (data.app == 'internal-registerApp') {
        app.registerApp(data);
    } else if (data.app == 'internal-unregisterApp') {
        app.unregisterApp(data);
    } else {
        console.debug("[Tablet Event Processor] INFO: Forwarded External Event to iframe-" + data.app, data)
        forwardMessage('iframe-' + data.app, data.data);
    };
});

// This is temporal
window.addEventListener('keydown', async({ key }) => {
    let which = key.toLowerCase();
    if (which == 'escape') {
        window.isFocused = false;
        app.post('close')
        return await forwardInternal(data = { 'action': 'close' });
    } else if (which == 'f6') {
        window.isFocused = true;
        return await forwardInternal(data = { 'action': 'open' });
    }
});

function getCurrentApp() {
    return window.currentApp;
};
window.getCurrentApp = getCurrentApp;
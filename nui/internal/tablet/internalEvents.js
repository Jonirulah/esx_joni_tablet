gTime = '';
calendarEvent = {};

console.debug = function() { return false; };

// Event forwarding
function forwardInternal(data) {
    // Clock Update
    if (data.clock) {
        updateClock(data.clock);
    } else if (data.notification) {
        data = data.notification;
        console.debug("[NOTIFICATION] Received notification from external", data);
        triggerNotification({ title: data.title, icon: data.icon, text: data.text, timer: data.timer, position: data.position, textColor: data.textColor });
    }
    // Play sound
    else if (data.sound) {
        console.debug("[SOUND] Playing sound from external", data);
        playSound(data.sound, data.force);
    }
    // Update Weather
    else if (data.currWeather) {
        console.debug("[WEATHER] Received data from external", data);
        updateWeather(data);
    } else if (data.clockEventName) {
        updateClockEvent(data);
    } else if (data.openApp) {
        document.getElementById('app').style.display = 'flex';
        app.switchPage(data.openApp);
    }
    // Tablet Actions | Open & Close Events
    else {
        switch (data.action) {
            case 'open':
                document.getElementById('app').style.display = 'flex';
                window.isFocused = true;
                break;
            case 'close':
                document.getElementById('app').style.display = 'none';
                window.isFocused = false;
                break;
        };
    };
};

// Send callback to LUA indicating that DOM has been loaded, so 
addEventListener("DOMContentLoaded", async() => {
    await fetch(`https://${GetParentResourceName()}/tabletLoaded`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
});

// Send callback to LUA indicating that tablet has been opened
async function onTabletOpen() {
    await fetch(`https://${GetParentResourceName()}/tabletOpen`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
    });
};

async function OnFirstAppOpen(appName, resourceName) {
    setTimeout(async() => {
        if (resourceName) {
            try {
                await fetch(`https://${resourceName}/onFirstAppOpen`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ 'appOpened': appName })
                });
            } catch {
                console.warn("Tablet tried to fetch onFirstAppOpen callback on your App but it didn't exist! [This is not an issue]", appName)
            };
        };
    }, 35);
};

async function onAppOpen(appName, isAppExternal, resourceName) {
    if (resourceName) {
        iframeElement = document.getElementById('iframe-' + appName)
        innerDoc = iframeElement.contentDocument || iframeElement.contentWindow.document;
        rootElement = innerDoc.getElementsByTagName("html")[0];
        rootElement.style.display = 'block';
        try {
            await fetch(`https://${resourceName}/onAppOpen`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 'appOpened': appName })
            });
        } catch {
            console.warn("Tablet tried to fetch onAppOpen callback on your App but it didn't exist! [This is not an issue]", appName)
        };
    };
};

// Internal Events/function to execute when DOM has been loaded
addEventListener("DOMContentLoaded", async() => {
    loadUserSettings();
    // $("#tablet-container").resizable();
});

// Clock update hour
function updateClock(time) {
    gTime = time;
    clock = document.getElementById('ingameTimer');
    clock.innerHTML = time;
};

// Update Event
function updateClockEvent(data) {
    document.getElementById('clockEventName').innerHTML = `${data.clockEventName}`;
    document.getElementById('clockEventDescription').innerHTML = `${data.clockEventDescription}`;
};

// Update weather
function updateWeather(data) {
    window.weatherData = data;
    const idsToCheck = ["minTemp", "maxTemp", "nextWeather", "currWeather", "currWeatherImg"];
    idsToCheck.forEach(id => {
        if (data[id] && id != 'currWeatherImg') {
            document.getElementById(id).innerHTML = data[id];
        } else if (data[id] && id == 'currWeatherImg') {
            // Weather is sunny, we check the hour to display the sun or the moon.
            if (data[id] == 'clear') {
                if (gTime) {
                    gTime = gTime.split(":");
                    let hour = gTime[0];
                    if (hour >= 6 && hour <= 19) {
                        data[id] = 'sunny';
                    } else if (hour >= 20 || hour <= 5) {
                        data[id] = 'moon';
                    }
                } else {
                    document.getElementById(id).src = 'img/weather/sunny.svg';
                    return;
                }
            };
            document.getElementById(id).src = `img/weather/${data[id]}.svg`;
        };
    });
};

// Load User Settings and apply the corresponding changes.
function loadUserSettings() {
    let userSettings = {};
    userSettings.wallpaperUrl = localStorage.getItem('wallpaper');
    userSettings.soundEnabled = localStorage.getItem('soundEnabled');
    // Background Loader
    if (userSettings.wallpaperUrl) {
        console.debug('[SETTINGS] User has custom wallpaper');
        console.debug("[SETTINGS] WallpaperUrl Storage", userSettings.wallpaperUrl);
        document.getElementById('main').style.backgroundImage = `url(${userSettings.wallpaperUrl})`;
    } else {
        console.debug('[SETTINGS] User has not custom wallpaper');
    };

    // Sound setting
    if (userSettings.soundEnabled && userSettings.soundEnabled == true) {
        userSettings.soundEnabled = true;
        console.debug('[SETTINGS] User has sounds enabled');
    } else if (userSettings.soundEnabled && userSettings.soundEnabled == false) {
        userSettings.soundEnabled = false;
        console.debug('[SETTINGS] User has sounds disabled');
    } else {
        userSettings.soundEnabled = false;
        console.debug('[SETTINGS] User has sounds disabled');
    };
};


window.gTime = gTime;
window.isFocused = false;
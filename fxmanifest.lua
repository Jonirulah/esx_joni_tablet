fx_version 'cerulean'
game 'gta5'

author 'Jonirulah'
version '1.0.0'
description 'Joni Tablet'

ui_page 'nui/internal/index.html'

client_scripts {

    'config.lua',
    'client/main.lua',
    'client/main_editable.lua',
    'client/internal.lua',
    'client/apps/**/**',
    -- Everything below is user made
}

files {
    'nui/internal/index.html',
    'nui/internal/tablet/vueApp.js',
    'nui/internal/tablet/eventProcessor.js',
    'nui/internal/tablet/internalEvents.js',
    'nui/internal/tablet/notificationHandler.js',
    'nui/internal/tablet/soundPlayer.js',
    'nui/internal/style.css',
    'nui/internal/img/**',
    'nui/internal/libs/**',
    'nui/internal/sound/**',
    'nui/apps/**'
    -- Everything below is user made
}

server_scripts {
    'server/server.lua',
    -- Everything below is user made.
}

exports {
    -- Internal exports
    'isTabletOpen',
    'hasTablet',
    'playSound',
    'registerApp',
    'unregisterApp',
    'toggleTablet',
    'sendEvent',
    'sendNotification',
    'sendCalendarEvent',
    'sendWeather',
    'openApp',
    'openTablet',
    'updateApps'
    -- Everything below is user made
}

server_exports { 
    'registerAppData'
    -- Everything below is user made
}
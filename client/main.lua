open = false
object = nil
anim = Config.AnimDict
prop = Config.Prop
bone = Config.Bone
AppData = {}

-- Utils
function LoadDict(dict)
    RequestAnimDict(dict)
    while not HasAnimDictLoaded(dict) do
        Wait(100)
    end
end

function LoadProp(model)
    RequestModel(model)
    while not HasModelLoaded(model) do
        Wait(100)
    end
end

-- Play sound, enforcing bypasses tablet configuration.
-- name:string (name of the file)
-- force:boolean (if sound should be played no matter user setting (true or false))
function playSound(name, force)
    SendNUIMessage({ app = "internal", sound = name, force = false })
end

function sendWeather(minTemp, maxTemp, currWeather, currWeatherImg, nextWeather)
    SendNUIMessage({ app = 'internal', minTemp = minTemp, maxTemp = maxTemp, currWeather = currWeather, currWeatherImg = currWeatherImg, nextWeather = nextWeather })
end

function sendCalendarEvent(eventName, eventDescription) 
    SendNUIMessage({ app = 'internal', clockEventName = eventName, clockEventDescription = eventDescription })
end

function sendNotification(title, text, timer, icon, position, textColor)
    SendNUIMessage({ app = 'internal', notification={title = title, icon = icon, text = text, timer = timer, position = position, textColor = textColor }})
end
 
function sendEvent(appId, data)
    SendNUIMessage({ app = appId, data = data})
end

RegisterNetEvent('joni_tablet:client:receiveAppData', function(appDataRecv, force)
    AppData = appDataRecv
    if (force) then
        checkForItems()
    end
    for k,v in pairs(AppData) do
        if (v.default == true) then
            registerApp(k)
        end
    end
end)

RegisterNetEvent('joni_tablet:client:unregisterApp', function(appId)
    unregisterApp(appId)
end)

-- If somehow you restarted the script wait for server-response!
Citizen.CreateThread(function()
    Wait(1000)
    TriggerServerEvent('joni_tablet:server:requestAppData')
end)

function registerApp(appId)
    if type(appId) == 'string' then
        for k,v in pairs(AppData) do
            if k == appId then
                appId = v
                print("sending message to register app", appId)
                SendNUIMessage({ app = 'internal-registerApp', data = appId})
                break
            end
        end
    end
end

function unregisterApp(appId)
    if type(appId) == 'string' then
        SendNUIMessage({ app = 'internal-unregisterApp', unregisterApp = appId })
    end
end

function openApp(appName)
    toggleTablet(true)
    SendNUIMessage({app='internal', openApp=appName})
end

-- Close 
RegisterNUICallback('close', function(data, cb)
    toggleTablet(false)
    cb('ok')
end)

exports("sendNotification", sendNotification)
exports("playSound", playSound)
exports("sendCalendarEvent", sendCalendarEvent)
exports("sendWeather", sendWeather)
exports("sendEvent", sendEvent)
exports("registerApp", registerApp)
exports("openApp", openApp)
exports("unregisterApp", unregisterApp)
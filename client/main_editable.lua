-- This is the part that is supposed to be open source
hastablet = false

-- In case you restart the script
Citizen.CreateThread(function()
    Wait(2000)
    checkForTablet()
    checkForItems()
end)


-- Let the user decide if he wants to keep command
RegisterCommand(Config.Command, function()
    if hasTablet() then
        toggleTablet(true)
    end
end, false)

-- Let the user decide if he wants keybind
if Config.Keybind then
    RegisterKeyMapping(Config.Command, Config.CommandDescription, 'KEYBOARD', Config.OpenKey)
end

---------------------
---   Functions   ---
---------------------

-- User has tablet, required true to allow for open.
function hasTablet(state)
    if (state) then
        hastablet = state
        return hastablet
    end
    return hastablet
end

-- Open the tablet
function openTablet()
    local ped = PlayerPedId()
    if hasTablet() then
        open = true
        LoadDict(anim)
        if not object then
            LoadProp(prop)
            local coords = GetEntityCoords(ped)
            local hand = GetPedBoneIndex(ped, bone)
            object = CreateObject(GetHashKey(prop), coords, 1, 1, 1)
            AttachEntityToEntity(object, ped, hand, 0.0, 0.0, 0.03, 0.0, 0.0, 0.0, 1, 1, 0, 1, 0, 1)
        end

        if not IsEntityPlayingAnim(ped, anim, 'base', 3) then
            TaskPlayAnim(ped, anim, 'base', 8.0, 1.0, -1, 49, 1.0, 0, 0, 0)
        end
        CreateThread(SpawnTabletThreads)
        SetNuiFocus(true, true)
        SendNUIMessage({app = 'internal', action = 'open'})
    end
end

-- Toggle tablet & animation
function toggleTablet(state)
    local ped = PlayerPedId()
    if hasTablet() then
        open = state
        if state then
            LoadDict(anim)
            if not object then
                LoadProp(prop)
                local coords = GetEntityCoords(ped)
                local hand = GetPedBoneIndex(ped, bone)
                object = CreateObject(GetHashKey(prop), coords, 1, 1, 1)
                AttachEntityToEntity(object, ped, hand, 0.0, 0.0, 0.03, 0.0, 0.0, 0.0, 1, 1, 0, 1, 0, 1)
            end

            if not IsEntityPlayingAnim(ped, anim, 'base', 3) then
                TaskPlayAnim(ped, anim, 'base', 8.0, 1.0, -1, 49, 1.0, 0, 0, 0)
            end
            CreateThread(SpawnTabletThreads)
            SetNuiFocus(state, state)
            SendNUIMessage({app = 'internal', action = 'open'})
        else
            DeleteEntity(object)
            DetachEntity(object, 1, 1)
            ClearPedTasks(ped)
            SetNuiFocus(state, state)
            SendNUIMessage({app = 'internal', action = 'close'})
            CreateThread(KillTabletThreads)
        end
    end
end

-- Is user using tablet
function isTabletOpen()
    return open

end

function checkForTablet()
    local count = exports.ox_inventory:Search('count', Config.TabletItem)
    if count > 0 then
        exports['joni_tablet']:hasTablet(true)
    end
end

-- Using ox_inventory at the moment
function checkForItems()
    local registeredApps = {}
    local items = exports.ox_inventory:Search('slots', Config.AppItem)
    -- Check for items and register apps
    for item in pairs(items) do
        if AppData[items[item].metadata.app] then
            if not registeredApps[items[item].metadata.app] then
                registeredApps[items[item].metadata.app] = items[item]
                exports['joni_tablet']:registerApp(items[item].metadata.app)
            end
        end
    end
    -- unregister any non-register app
    for k,v in pairs(AppData) do
        if (not v.default == true) then
            if not registeredApps[k] then
                exports['joni_tablet']:unregisterApp(k)
            end
        end
    end
end

function updateApps()
    Citizen.CreateThread(function()
        checkForItems()
    end)
end

-------------------
---    Events   ---
-------------------

-- Event for server-side (if needed)
RegisterNetEvent('joni_tablet:client:open', function()
    toggleTablet(true)
end)


-- Framework specific search inventory to register App that depends on item!
-- (actual ox_inventory and ESX)
-- Check in Inventory for app_slot item
if Config.Framework == 'esx' then
    RegisterNetEvent('esx:playerLoaded', function()
        checkForItems()
    end)
elseif Config.Framework == 'qbcore' then
    RegisterNetEvent('QBCore:Client:OnPlayerLoaded', function()
        checkForItems()
    end)
elseif Config.Framework == 'custom' then
    RegisterNetEvent('osx:playerLoaded', function()
        checkForItems()
        checkForTablet()
    end)
end

-------------------
---  Callbacks  ---
-------------------

-- DOM/NUI has been created & loaded, messages to be sent before user opens tablet.
RegisterNUICallback('tabletLoaded', function(data, cb)
    -- print("Tablet has loaded!")
    -- sendCalendarEvent('Vanilla Unicorn', 'Noche de fiesta a partir de las 20:00')
    -- TriggerServerEvent('oa_weather:server:requestWeatherData')
    cb(1)
end)

-- Tablet is being opened, anything that we should update OnTabletOpen?
RegisterNUICallback('tabletOpen', function(data, cb)
end)

exports("toggleTablet", toggleTablet)
exports("openTablet", openTablet)
exports("isTabletOpen", isTabletOpen)
exports('hasTablet', hasTablet)

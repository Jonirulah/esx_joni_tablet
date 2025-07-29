AppData = {}

function registerAppData(data)
    if not AppData[data.id] then
        AppData[data.id] = data
    end
    TriggerClientEvent('joni_tablet:client:receiveAppData', -1, AppData, true)
end
exports('registerAppData', registerAppData)

AddEventHandler('onResourceStart', function()
    TriggerClientEvent('joni_tablet:client:receiveAppData', -1, AppData, true)
end)

AddEventHandler('onResourceStop', function(resName)
    if AppData[resName] then
        TriggerClientEvent('joni_tablet:client:unregisterApp', -1, resName)
    end
end)

RegisterNetEvent('joni_tablet:server:requestAppData', function()
    local playerId = source
    TriggerClientEvent('joni_tablet:client:receiveAppData', playerId, AppData)
end)


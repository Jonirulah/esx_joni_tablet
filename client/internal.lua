-- Smart Tablet Threads
alive = false

-- Clock thread spawns with tablet open, closes on exit detection
local function ClockThread()
    while alive do
        local hour = GetClockHours()
        local min = GetClockMinutes()
        if min <= 9 then min = "0" .. min end
        clockFormatted = hour .. ":" .. min
        SendNUIMessage({app = 'internal', clock = clockFormatted})
        Wait(500)
    end
end

-- Called when the tablet has been opened
function SpawnTabletThreads()
    alive = true
    ClockThread()
end

-- Killing threads when closing
function KillTabletThreads()
    alive = false
end

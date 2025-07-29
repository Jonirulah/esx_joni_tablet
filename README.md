Creación de APPS

Los elementos que se gestionan fuera de la APP (Menús de la tablet, eventos internos están en internalEvents)
Es decir todo lo que tenga que ver con menús externos/reloj y comportamiento de la pantalla principal está en internalEvents.js

Podéis ver el example en nui/apps para tener una idea básica.

1. Crear la APP en nui/appDefinitions.json siguiendo la estructura.
2. La base de nuestra APP será el HTML (id) que indiquemos en el appDefinitions.json ejemplo (id: camareros, html: camareros.html)
   Deben seguir la estructura de las demás aplicaciones en el nui/apps/appContent/id de la App/ficheros (cada app tiene su hoja de estilos y javascript independiente que debeis crear)

App.json
  // {
    // "id": "info", -- App ID
    // "name": "Information", -- App Name
    // "icon": "img/appIcon/infoPage.svg", -- App Icon
    // "description": "Your description for Information app", -- App unused description
    // "jobRequirement": "" -- Job required to show, "" for no requirement
    // "gradeRequirement": "" -- Minimum grade required to show, "" for all grades
  // },


LIBRERIAS JS

El SweetAlert está cargado desde la internalApp, podéis usarlo en cualquier app sin la necesidad de volver a importar las librerías.
Podéis usar las notificaciones desde cualquier aplicación o desde el export en lua llamando al framework de notificaciones 
Todos los argumentos son opcionales en la función de abajo, así que no es obligatorio introducirlos todos, llamarlos usando JSON


Funciones públicas NUI
window.parent.triggerNotification(title='Default title', text='Missing text', icon='success', timer=1500, position='top', textColor='#545454') Ya emite un sonido por defecto, no es necesario llamar al playSound.
window.parent.playSound('sound') -> Sonido tiene que estar en nui/internal/sound
window.parent.gTime -> gameTime (16:42h)
window.parent.getCurrentApp() -> (returns the id of the current app active)

EXPORTS
CLIENT-SIDE-EXPORTS:
function playSound(name, force)
function sendWeather(minTemp, maxTemp, currWeather, currWeatherImg, nextWeather)
function sendCalendarEvent(eventName, eventDescription) 
function sendNotification(title, text, timer, icon, position, textColor)
function isTabletOpen()

exports("isTabletOpen", isTabletOpen) // No requiere argumentos (devuelve true, false)
exports("hasTablet", hasTablet) // No requiere argumentos (devuelve true, false)
exports("playSound", playSound) // Requiere el nombre del archivo sin extensión y true o false para forzar el sonido aunque esté deshabilitado por el usuario
exports("sendCalendarEvent", sendCalendarEvent) // Actualiza evento de eventos (eventName, eventDescription)
exports("sendEvent", sendEvent) // appId, data (json)

EVENTOS SERVER
'oa-tablet:client:open' -> Abre la tablet de un usuario (por el momento no tiene ningún sentido)
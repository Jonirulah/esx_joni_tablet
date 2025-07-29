window.addEventListener('message', async ({ data }) => {
    console.debug('[TABLET Info App Received message]', data);
});

addEventListener("DOMContentLoaded", async () => {
    let soundState = localStorage.getItem('soundEnabled');
    if (soundState == true) {
        text = 'Deshabilitar ';
    } else {
        text = 'Habilitar';
    };
    document.getElementById('sound-btn').innerHTML = `<span> ${text} sonido</span>`;
});

$(function(){
    $('#window').draggable({ scroll: false });
    setTimeout(() => {
        $('#window').css('visibility', 'visible');
        $('.loading-text').text("Carga completada");
        setTimeout(() => {
            $('.loading-text-div').css('visibility', 'hidden');
        }, 600);
    }, 2000);
});

async function changeBackground() {
    Swal.fire({
        title: "Introduce la URL del fondo de pantalla",
        input: "text",
        inputAttributes: { autocapitalize: "off" },
        showCancelButton: true,
        confirmButtonText: "Confirmar",
        showLoaderOnConfirm: true,
        preConfirm: async (url) => {
            if (url && (url.startsWith('http://') || url.startsWith('https://'))) {
                try {
                    const response = await fetch(url);
                    if (!response.ok) { throw new Error('Network response was not ok') };
                    const blob = await response.blob();
                    const reader = new FileReader();
                    return new Promise((resolve, reject) => {
                        reader.onloadend = () => resolve(reader.result);
                        reader.onerror = reject;
                        reader.readAsDataURL(blob);
                    });
                } catch (error) {
                    Swal.showValidationMessage(`Error obteniendo datos de imagen: ${error.message}`);
                }
            } else {
                Swal.showValidationMessage('Por favor introduce una URL válida que empiece con http o https');
            }
        },
        allowOutsideClick: () => !Swal.isLoading()
    }).then((result) => {
        if (result.isConfirmed) {
            const base64Image = result.value;
            localStorage.setItem('wallpaper', base64Image);
            window.parent.triggerNotification({title: 'Cambio del fondo de pantalla', text: 'Has cambiado el fondo de pantalla de la tablet.', timer: 1500});
        }
    })
}

async function changeSoundPref() {
    let soundState = localStorage.getItem('soundEnabled');
    if (soundState != "undefined") {
        if (soundState == 'true') {
            localStorage.setItem('soundEnabled', false);
            document.getElementById('sound-btn').innerHTML = '<span>Habilitar sonido</span>';
            window.parent.triggerNotification({title: 'Sonido deshabilitado', text: 'Has deshabilitado el sonido de la tablet', timer: 1500});
        } else {
            localStorage.setItem('soundEnabled', true);
            document.getElementById('sound-btn').innerHTML = '<span>Deshabilitar sonido</span>';
            window.parent.triggerNotification({title: 'Sonido habilitado', text: 'Has habilitado el sonido de la tablet', timer: 1500});
        }
    } else {
        localStorage.setItem('soundEnabled', false);
    }
}
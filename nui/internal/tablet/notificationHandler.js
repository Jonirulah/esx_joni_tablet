// Default Toast
ToastFocus = Swal.mixin({
    toast: true,
    target: '.tablet-container',
    color: '#fff',
    icon: 'success',
    background: '#222',
    showConfirmButton: false,
    timer: '1500',
    timerProgressBar: true,
});

ToastNotFocus = Swal.mixin({
    toast: true,
    color: '#fff',
    icon: 'success',
    background: '#222',
    showConfirmButton: false,
    timer: '1500',
    timerProgressBar: true,
});


function triggerNotification({ title = 'Default title', text = '', icon = 'success', timer = 1500, position = 'top', textColor = '#fff', sound = 'notification' }) {
    if (window.isFocused) {
        ToastFocus.fire({
            icon: icon,
            title: title,
            text: text,
            timer: timer,
            position: position,
            color: textColor,
        });
        playSound(sound);
    } else {
        ToastNotFocus.fire({
            icon: icon,
            title: title,
            text: text,
            timer: timer,
            position: 'bottom-right',
            color: textColor,
            customClass: 'outside-alert'
        });
    };
};

window.triggerNotification = triggerNotification;
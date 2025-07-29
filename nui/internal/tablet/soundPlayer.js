
function playSound(name, force) {
    if (force) {
        var audio = new Audio(`sound/${name}.ogg`);
        audio.play();      
    }
    else {
        let soundState = localStorage.getItem('soundEnabled')
        if (soundState == 'true') {
            var audio = new Audio(`sound/${name}.ogg`);
            audio.volume = 0.5;
            audio.play();
        }
    };
};

window.playSound = playSound;

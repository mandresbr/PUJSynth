//Crea el context de web audio y el gain
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
var gainNode = audioCtx.createGain();
var oscillators = [];
//Asigna un valor al gainNode (volumen)
gainNode.gain.value = 0.3;


var keyOctave;
var mediaScreen = window.matchMedia("(min-width: 600px)");
if (mediaScreen.matches) {
    keyOctave = 2;
} else {
    keyOctave = 1;
};


//Variables para el tipo de Oscilador
var oscType1 = document.getElementById("oscillator1Type").value;
var oscType2 = document.getElementById("oscillator2Type").value;

function selectOsc1(osc1) {
    oscType1 = osc1;
};

function selectOsc2(osc2) {
    oscType2 = osc2;
};

//Inicializa el Nexus UI
nx.onload = function () {

    //Asigna valores a los dials
    dial1.min = -20;
    dial1.max = 20;
    dial1.responsivity = 0.025;

    dial2.min = -20;
    dial2.max = 20;
    dial2.responsivity = 0.025;

    //Especifica los colores del nexus ui
    nx.colorize("accent", "#347");
    nx.colorize("border", "#333");
    nx.colorize("fill", "#fff");

    //Configurando el teclado del nexus
    keyboard1.octaves = keyOctave;
    keyboard1.init();

    keyboard1.on('*', function (data) {

        if (data.on > 0) {
            /*Cuando las teclas del piano se presionan, se crean dos osciladores 
            que producen los sonidos de acuerdo a las especificaciones y la frecuencia*/
            var oscillator1 = audioCtx.createOscillator();
            oscillator1.type = oscType1;
            oscillator1.frequency.value = nx.mtof(data.note); // Valor en hertz
            oscillator1.detune.value = dial1.val.value;

            var oscillator2 = audioCtx.createOscillator();
            oscillator2.type = oscType2;
            oscillator2.frequency.value = nx.mtof(data.note); // Valor en hertz
            oscillator2.detune.value = dial2.val.value;

            //Conecta los osciladores y el gainNode
            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillators[nx.mtof(data.note)] = [oscillator1, oscillator2];

            //Inicia los osciladores
            oscillator1.start(audioCtx.currentTime);
            oscillator2.start(audioCtx.currentTime);
        } else {
            //Para los osciladores
            oscillators[nx.mtof(data.note)].forEach(function (oscillator) {
                oscillator.stop(audioCtx.currentTime);
            });
        }
    });
}
//Start context for Webaudio and create gain
var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
var gainNode = audioCtx.createGain();
var oscillators = [];
//set value for gainNode which is like a volume level
gainNode.gain.value = 0.3;

/*Makes the keyboard octave responsive. On desktop, where the screen is larger, 
it shows 2 octaves and on a smartphone , where the screen is smaller, it shows 1 octave*/
var keyOctave;
var mediaScreen = window.matchMedia("(min-width: 600px)");
if (mediaScreen.matches) {
    keyOctave = 2;
} else {
    keyOctave = 1;
};

//Variables for Oscillator types
var oscType1 = document.getElementById("oscillator1Type").value;
var oscType2 = document.getElementById("oscillator2Type").value;

//Functions for selectors for changing Oscillator types. 
function selectOsc1(osc1) {
    oscType1 = osc1;
};

function selectOsc2(osc2) {
    oscType2 = osc2;
};

//Start Nexus UI
nx.onload = function () {

    //Setting up specifications the first dial 
    dial1.min = -20;
    dial1.max = 20;
    dial1.responsivity = 0.025;

    //Setting up specifications the second dial 
    dial2.min = -20;
    dial2.max = 20;
    dial2.responsivity = 0.025;

    //Specifying the colors which will be used for Nexus UI
    nx.colorize("accent", "#347");
    nx.colorize("border", "#333");
    nx.colorize("fill", "#fff");

    //Setting up the Nexus UI keyboard
    keyboard1.octaves = keyOctave;
    keyboard1.init();
    //This is where you tell what will happen when you press the buttons on Nexus UI Keyboard
    keyboard1.on('*', function (data) {

        if (data.on > 0) {
            /*When the keyboard buttons are pushed it will create two oscillators 
            which produces sounds according to specifications and frequency*/
            var oscillator1 = audioCtx.createOscillator();
            oscillator1.type = oscType1;
            oscillator1.frequency.value = nx.mtof(data.note); // value in hertz
            oscillator1.detune.value = dial1.val.value;

            var oscillator2 = audioCtx.createOscillator();
            oscillator2.type = oscType2;
            oscillator2.frequency.value = nx.mtof(data.note); // value in hertz
            oscillator2.detune.value = dial2.val.value;

            //Connect oscillators and gainNode
            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);
            gainNode.connect(audioCtx.destination);

            oscillators[nx.mtof(data.note)] = [oscillator1, oscillator2];

            oscillator1.start(audioCtx.currentTime);
            oscillator2.start(audioCtx.currentTime);
        } else {
            //This is where it tells the synth to stop making sound
            oscillators[nx.mtof(data.note)].forEach(function (oscillator) {
                oscillator.stop(audioCtx.currentTime);
            });
        }
    });
}
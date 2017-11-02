//Author: Adib Ali


// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
} else {
    alert('The File APIs are not fully supported in this browser.');
}

var output;
var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var convolver = audioCtx.createConvolver();
var audioPreset = document.getElementById('audioPreset');
var irPresetList = document.getElementById('irPresetList');
var inputSound = document.getElementById('inputSound');
var ownAudioFileURL;
var inputAudioPresetURL;
var ownIRFileURL;
var irPresetURL;
var presetAudioBuffer;
var ownIRFileBuffer;

function onAudioSelect(evt) {
    var selectedPreset = audioPreset.value;

    switch (selectedPreset) {
        case 'theForce':
            inputAudioPresetURL = 'music/force.mp3';
            break;
        case 'chime':
            inputAudioPresetURL = 'music/chime.mp3';
            break;
        default:
            alert('preset selected');
    }

    inputSound.src = inputAudioPresetURL;
    outputSound.src = inputAudioPresetURL;
    document.getElementById('audioPresetRadio').checked = true;
}

function onAudioPresetClick(){
    inputSound.src = inputAudioPresetURL;
}

function onOwnAudioClick(){
    inputSound.src = ownAudioFileURL;
}

function handleFileSelect(evt) {
    var files = evt.target.files; // FileList object

    ownAudioFileURL = URL.createObjectURL(this.files[0]);
    inputSound.src = ownAudioFileURL;

    outputSound.src = ownAudioFileURL;
    document.getElementById('ownAudioFile').checked = true;

}


function loadIRPreset(audioURL) {
    document.getElementById('impulseResponse').src = audioURL;
    var ajaxRequest = new XMLHttpRequest();

    ajaxRequest.open('GET', audioURL, true);
    ajaxRequest.responseType = 'arraybuffer';

    ajaxRequest.onload = function (e) {
        var audioData = ajaxRequest.response;
        audioCtx.decodeAudioData(audioData, function (buffer) {
            presetAudioBuffer = buffer;
            convolver.buffer = presetAudioBuffer;
        }, function (e) { "Error with decoding audio data" + e.err });
    }
    ajaxRequest.send();
}


function onIrPresetSelect(evt) {
    var selectedPreset = irPresetList.value;
    switch (selectedPreset) {
        case 'carpark':
        irPresetURL = 'music/carpark_balloon_ir_stereo_24bit_44100.wav';
            break;
        case 'slinky':
        irPresetURL = 'music/slinky_ir.wav';
            break;
        case 'centre_stalls':
        irPresetURL = 'music/ir_centre_stalls.wav';
            break;
        case 'aula_carolina':
        irPresetURL = 'music/aula_carolina.wav';
            break;
        case 'corridor':
        irPresetURL = 'music/corridor.wav';
            break;
        case 'meeting_room':
        irPresetURL = 'music/meeting_room.wav';
            break;
        case 'office':
        irPresetURL = 'music/office.wav';
            break;
        case 'stairway':
        irPresetURL = 'music/stairway.wav';
            break;
        default:
            alert('preset not selected');
    }
    loadIRPreset(irPresetURL);
    document.getElementById('irPresetRadio').checked = true;
}

function handleImResFileSelect(evt) {

    var impulseResponseSound = document.getElementById('impulseResponse');
    ownIRFileURL = URL.createObjectURL(this.files[0]);
    impulseResponseSound.src = ownIRFileURL;
    var files = evt.target.files;

    var fileReader = new FileReader;
    fileReader.readAsArrayBuffer(this.files[0]);
    fileReader.onload = function () {
        var arrayBuffer = this.result;
        audioCtx.decodeAudioData(arrayBuffer, function (buffer) {
            ownIRFileBuffer = buffer;
            convolver.buffer = ownIRFileBuffer;
        });
    }
    
    document.getElementById('ownIrFile').checked = true;
}

function onIRPresetClick(){
    loadIRPreset(irPresetURL);
    convolver.buffer = presetAudioBuffer;
}

function onOwnIRClick()
{
    loadIRPreset(ownIRFileURL);
    convolver.buffer = ownIRFileBuffer;
}

function playOutput(evt) {
    output.connect(convolver);
    convolver.connect(audioCtx.destination);
}

//Event listeners 
document.getElementById('files').addEventListener('change', handleFileSelect, false);
document.getElementById('iFiles').addEventListener('change', handleImResFileSelect, false);
document.getElementById('outputSound').addEventListener('play', playOutput, false);
irPresetList.addEventListener('change', onIrPresetSelect, false);
audioPreset.addEventListener('change', onAudioSelect, false);
//radio buttons
document.getElementById('audioPresetRadio').addEventListener('click', onAudioPresetClick, false);
document.getElementById('ownAudioFile').addEventListener('click', onOwnAudioClick, false);
document.getElementById('irPresetRadio').addEventListener('click', onIRPresetClick, false);
document.getElementById('ownIrFile').addEventListener('click', onOwnIRClick, false);

var outputSound = document.getElementById('outputSound');
output = audioCtx.createMediaElementSource(outputSound);

//Author: Adib Ali


// Check for the various File API support.
if (window.File && window.FileReader && window.FileList && window.Blob) {
    // Great success! All the File APIs are supported.
} else {
    alert('The File APIs are not fully supported in this browser.');
}


var audioCtx = new (window.AudioContext || window.webkitAudioContext)();
var convolver = audioCtx.createConvolver();
var offlineCtx;
var offlineConvolver;
var convolverBuffer;
var offlineContextSource;
var inputAudioBuffer;

var audioPreset = document.getElementById('audioPreset');
var irPresetList = document.getElementById('irPresetList');
var inputSound = document.getElementById('inputSound');

var fileArrayBufferDecoded;
var IRFileArrayBufferDecoded;
var ownAudioFileURL;
var inputAudioPresetURL;
var ownIRFileURL;
var irPresetURL;
var presetAudioBuffer;
var buffer = presetAudioBuffer;
var ownIRFileBuffer;
var outputBlobURL;
var blob;
var worker;
var files;


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

    //Sets the player's src to control playback
    inputSound.src = inputAudioPresetURL;
    // outputSound.src = inputAudioPresetURL;

    //Check radio button
    document.getElementById('audioPresetRadio').checked = true;

    var ajaxRequest = new XMLHttpRequest();

    ajaxRequest.open('GET', inputAudioPresetURL, true);
    ajaxRequest.responseType = 'arraybuffer';

    ajaxRequest.onload = function (e) {
        var audioData = ajaxRequest.response;
        audioCtx.decodeAudioData(audioData, setInputBuffer, function (e) { "Error with decoding audio data" + e.err });
    }
    ajaxRequest.send();
}

function onAudioPresetClick() {

}

function onOwnAudioClick() {
    setInputBuffer(fileArrayBufferDecoded);
    inputSound.src = ownAudioFileURL;
}

function handleAudioFileSelect(evt) {
    var files = evt.target.files; // FileList object

    //Set src for the player
    ownAudioFileURL = URL.createObjectURL(this.files[0]);
    inputSound.src = ownAudioFileURL;

    var fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.files[0]);
    fileReader.onload = function () {
        var fileArrayBuffer = this.result;
        audioCtx.decodeAudioData(fileArrayBuffer, function (buffer) {
            fileArrayBufferDecoded = buffer;
            setInputBuffer(buffer);
        });
    }
    // outputSound.src = ownAudioFileURL;
    document.getElementById('ownAudioFile').checked = true;
}

setInputBuffer = function (buffer) {

    inputAudioBuffer = audioCtx.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        inputAudioBuffer.copyToChannel(buffer.getChannelData(channel), channel);
    }

}

setConvolverBuffer = function (buffer) {

    convolverBuffer = audioCtx.createBuffer(buffer.numberOfChannels, buffer.length, buffer.sampleRate);
    for (let channel = 0; channel < buffer.numberOfChannels; channel++) {
        convolverBuffer.copyToChannel(buffer.getChannelData(channel), channel);
    }
}

function loadIRPreset(audioURL) {
    document.getElementById('impulseResponse').src = audioURL;
    var ajaxRequest = new XMLHttpRequest();

    ajaxRequest.open('GET', audioURL, true);
    ajaxRequest.responseType = 'arraybuffer';

    ajaxRequest.onload = function (e) {
        var audioData = ajaxRequest.response;
        audioCtx.decodeAudioData(audioData, setConvolverBuffer, function (e) { "Error with decoding audio data" + e.err });
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

function handleIRFileSelect(evt) {

    var impulseResponseSound = document.getElementById('impulseResponse');
    ownIRFileURL = URL.createObjectURL(this.files[0]);
    impulseResponseSound.src = ownIRFileURL;
    var files = evt.target.files;

    var fileReader = new FileReader();
    fileReader.readAsArrayBuffer(this.files[0]);
    fileReader.onload = function () {
        var IRFileArrayBuffer = this.result;
        audioCtx.decodeAudioData(IRFileArrayBuffer, function (buffer) {
            IRFileArrayBufferDecoded = buffer;
            setConvolverBuffer(buffer);
        });
    }


    document.getElementById('ownIrFile').checked = true;
}

function onIRPresetClick() {
    loadIRPreset(irPresetURL);
    convolverBuffer = presetAudioBuffer;
}

function onOwnIRClick() {
    loadIRPreset(ownIRFileURL);
    convolverBuffer = ownIRFileBuffer;
}

function convolve() {

    offlineCtx = new OfflineAudioContext(2, 48000 * 45, 48000);
    offlineContextSource = offlineCtx.createBufferSource();
    offlineContextSource.buffer = inputAudioBuffer;

    offlineConvolver = offlineCtx.createConvolver();
    offlineConvolver.buffer = convolverBuffer;

    offlineContextSource.connect(offlineConvolver);
    offlineConvolver.connect(offlineCtx.destination);
    offlineContextSource.start();

    offlineCtx.startRendering().then(function (renderedBuffer) {
        console.log("rendering complete");

        // start a new worker 
        worker = new Worker('js/libs/recorderWorker.js');

        // initialize the new worker
        worker.postMessage({
            command: 'init',
            config: { sampleRate: offlineCtx.sampleRate }
        });

        // callback for `exportWAV`
        worker.onmessage = function (e) {
            blob = e.data;
            outputBlobURL = URL.createObjectURL(blob);
            outputSound.src = outputBlobURL;
        };

        var shortBuffer = trimBuffer(renderedBuffer);

        // send the channel data from our buffer to the worker
        worker.postMessage({
            command: 'record',
            buffer: [
                shortBuffer.getChannelData(0),
                shortBuffer.getChannelData(1)
            ]
        });

        // ask the worker for a WAV
        worker.postMessage({
            command: 'exportWAV',
            type: 'audio/wav'
        });
    });
}

//Removes trailing zeroes in audio buffer because buffer is fixed size and convolution result is shorter
function trimBuffer(audioBuffer) {
    channel0Data = audioBuffer.getChannelData(0);
    channel1Data = audioBuffer.getChannelData(1);
    let frameNumber = audioBuffer.length;
    while (channel0Data[frameNumber - 1] == 0) {
        frameNumber--;
    }
    channel0Data = channel0Data.slice(0, frameNumber);
    channel1Data = channel1Data.slice(0, frameNumber);
    var newBuffer = audioCtx.createBuffer(2, frameNumber, 48000);
    newBuffer.copyToChannel(channel0Data, 0);
    newBuffer.copyToChannel(channel1Data, 1);

    return newBuffer;
}

function downloadFile() {


    var filename = "output.wav";
    var element = document.createElement('a');

    element.setAttribute('href', outputBlobURL);
    element.setAttribute('download', filename);

    element.style.display = 'none';
    document.body.appendChild(element);

    element.click();

    document.body.removeChild(element);

}

//Event listeners 
document.getElementById('files').addEventListener('change', handleAudioFileSelect, false);
document.getElementById('iFiles').addEventListener('change', handleIRFileSelect, false);
irPresetList.addEventListener('change', onIrPresetSelect, false);
audioPreset.addEventListener('change', onAudioSelect, false);
//radio buttons
document.getElementById('audioPresetRadio').addEventListener('click', onAudioSelect, false);
document.getElementById('ownAudioFile').addEventListener('click', onOwnAudioClick, false);
document.getElementById('irPresetRadio').addEventListener('click', onIRPresetClick, false);
document.getElementById('ownIrFile').addEventListener('click', onOwnIRClick, false);
document.getElementById('downloadButton').addEventListener("click", downloadFile, false);

var outputSound = document.getElementById('outputSound');
var output = audioCtx.createMediaElementSource(outputSound);

document.getElementById('convolve').addEventListener('click', convolve, false);

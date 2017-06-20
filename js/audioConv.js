//Author: Adib Ali

function audioConv(){
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
    var irPreset = document.getElementById('irPreset');

    function handleFileSelect(evt) {
        var files = evt.target.files; // FileList object

        // // files is a FileList of File objects. List some properties.
        // var output = [];
        // for (var i = 0, f; f = files[i]; i++) {
        //   output.push('<li><strong>', escape(f.name), '</strong> (', f.type || 'n/a', ') - ',
        //   f.size, ' bytes, last modified: ',
        //   f.lastModifiedDate ? f.lastModifiedDate.toLocaleDateString() : 'n/a',
        //   '</li>');
        //
        // }
        // document.getElementById('list').innerHTML = '<ul>' + output.join('') + '</ul>';


        var inputSound = document.getElementById('inputSound');
        inputSound.src = URL.createObjectURL(this.files[0]);

        outputSound.src = inputSound.src;
    }

    function handleImResFileSelect(evt){

        var impulseResponseSound = document.getElementById('impulseResponse');
        impulseResponseSound.src = URL.createObjectURL(this.files[0]);
        var files = evt.target.files;

        var fileReader = new FileReader;
        fileReader.readAsArrayBuffer(this.files[0]);
        fileReader.onload = function(){
            var arrayBuffer = this.result;
            audioCtx.decodeAudioData(arrayBuffer, function(buffer) {
                convolver.buffer = buffer;
            });
        }
    }

    function loadAudioPreset(audioURL){
        var audioBuffer;
        var ajaxRequest = new XMLHttpRequest();

        ajaxRequest.open('GET', audioURL, true);
        ajaxRequest.responseType = 'arraybuffer';

        ajaxRequest.onload = function(e) {
            var audioData = ajaxRequest.response;
            audioCtx.decodeAudioData(audioData, function(buffer) {
                audioBuffer = buffer;
                convolver.buffer = audioBuffer;
            }, function(e){"Error with decoding audio data" + e.err});
        }
        ajaxRequest.send();
    }

    function onAudioSelect(evt){
        var selectedPreset = audioPreset.value;
        switch (selectedPreset) {
            case 'theForce':
            outputSound.src = inputSound.src = document.getElementById('theForceAudio').src;
            break;
            case 'chime':
            outputSound.src = inputSound.src = 'music/chime.mp3';
            break;
            default:
            alert('preset selected');
        }
    }

    function onIrPresetSelect(evt){
        var selectedPreset = irPreset.value;
        switch (selectedPreset) {
            case 'carpark':
            loadAudioPreset('music/carpark_balloon_ir_stereo_24bit_44100.wav');
            break;
            case 'slinky':
            loadAudioPreset('music/slinky_ir.wav');
            break;
            case 'centreStalls':
            loadAudioPreset('music/ir_centre_stalls.wav');
            break;
            default:
            alert('preset selected');
        }
    }

    function playOutput(evt){
        output.connect(convolver);
        convolver.connect(audioCtx.destination);
    }

    //pauseOutput event needed to remove trailing sound due to convolution
    // function pauseOutput(evt){
    //     convolver.disconnect();
    // }


    document.getElementById('files').addEventListener('change', handleFileSelect, false);
    document.getElementById('iFiles').addEventListener('change', handleImResFileSelect, false);
    document.getElementById('outputSound').addEventListener('play', playOutput, false);
    // document.getElementById('outputSound').addEventListener('pause', pauseOutput, false);
    irPreset.addEventListener('change', onIrPresetSelect, false);
    audioPreset.addEventListener('change', onAudioSelect, false);
    //document.getElementById('irPreset').onchange = onIrPresetSelect;

    var outputSound = document.getElementById('outputSound');
    output = audioCtx.createMediaElementSource(outputSound);
}

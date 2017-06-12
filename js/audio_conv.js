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
        //source.connect(audioCtx.destination);
    }

    function handleImResFileSelect(evt){

        var impulseResponseSound = document.getElementById('impulseResponse');
        impulseResponseSound.src = URL.createObjectURL(this.files[0]);
        var files = evt.target.files;
        //var response = audioCtx.createMediaElementSource(impulseResponseSound);
        // var myAudio = document.querySelector('#inputSound2');

        var imResponse = document.querySelector('#impulseResponse');
        var fileReader = new FileReader;
        fileReader.readAsArrayBuffer(this.files[0]);

        fileReader.onload = function(){
            var arrayBuffer = this.result;
            audioCtx.decodeAudioData(arrayBuffer, function(buffer) {
                convolver.buffer = buffer;
            });
        }
    }

    function onIrPresetSelect(evt){
        alert("selected");
    }

    function playOutput(evt){
        output.connect(convolver);
        convolver.connect(audioCtx.destination);
    }

    document.getElementById('files').addEventListener('change', handleFileSelect, false);
    document.getElementById('iFiles').addEventListener('change', handleImResFileSelect, false);
    document.getElementById('outputSound').addEventListener('play', playOutput, false);
    document.getElementById('irPreset').addEventListener('change', onIrPresetSelect, false);
    //document.getElementById('irPreset').onchange = onIrPresetSelect;

    var outputSound = document.getElementById('outputSound');
    output = audioCtx.createMediaElementSource(outputSound);
}

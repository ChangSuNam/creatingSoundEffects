const babblingBrookPlayButton = document.getElementById('babblingBrook');
const playButton = document.getElementById('button2');
let audioCtxBabblingBrook;
let audioCtx;

/**
 * Assign buttons with each functions
 */
babblingBrookPlayButton.addEventListener('click', function () {
    if (!audioCtxBabblingBrook) {
        initAudioBabblingBrook();
        return;
    }
    else if (audioCtxBabblingBrook.state === 'suspended') {
        audioCtxBabblingBrook.resume();
    }
    else if (audioCtxBabblingBrook.state === 'running') {
        audioCtxBabblingBrook.suspend();
    }

}, false);

playButton.addEventListener('click', function () {
    if (!audioCtx) {
        initAudio();
        return;
    }
    else{
        audioCtx.suspend();
        initAudio();
    }
   

}, false);

/**
 * create babbling brook noise
 */
function initAudioBabblingBrook(){

    audioCtxBabblingBrook = new (window.AudioContext || window.webkitAudioContext)

    ///code provided for brownNoise
    var bufferSize = 10 * audioCtxBabblingBrook.sampleRate,
    noiseBuffer = audioCtxBabblingBrook.createBuffer(1, bufferSize, audioCtxBabblingBrook.sampleRate),
    output = noiseBuffer.getChannelData(0);

    var lastOut = 0;
    for (var i = 0; i < bufferSize; i++) {
        var brown = Math.random() * 2 - 1;

        output[i] = (lastOut + (0.02 * brown)) / 1.02;
        lastOut = output[i];
        output[i] *= 3.5;
    }

    brownNoise = audioCtxBabblingBrook.createBufferSource();
    brownNoise.buffer = noiseBuffer;
    brownNoise.loop = true;
    brownNoise.start(0);
    ///

    /**lowpass filter
     *input is the input parameter for highpass filter */
    input = new BiquadFilterNode(audioCtxBabblingBrook)
    input.type = 'lowpass'
    input.frequency.setValueAtTime(400, audioCtxBabblingBrook.currentTime);
    brownNoise.connect(input)

    /**lowpass filter
     *frequency is the frequency parameter for highpass filter */
    frequency = new BiquadFilterNode(audioCtxBabblingBrook)
    frequency.type = 'lowpass'
    frequency.frequency.setValueAtTime(14, audioCtxBabblingBrook.currentTime);   
    frequency.gain.value = 400; //*400  
    //constant source node with offset 500 for +500
    let constSrc = new ConstantSourceNode(audioCtxBabblingBrook,{offset: 500});
    constSrc.connect(frequency)
    constSrc.start()    
    brownNoise.connect(frequency)

    //highpass filter
    brook = new BiquadFilterNode(audioCtxBabblingBrook); 
    brook.type = 'highpass'
    
    let gainNode = audioCtxBabblingBrook.createGain()
    gainNode.gain = 0.1
   
    frequency.connect(brook.frequency) // connect frequency
    brook.Q.value = 100/3  // reciprocal of 0.03, 33.3333...
    brook.connect(gainNode) // 0.1
    input.connect(brook)

    brook.connect(audioCtxBabblingBrook.destination)    
}

function initAudio(){
    audioCtx = new (window.AudioContext || window.webkitAudioContext)

    let osc1 = audioCtx.createOscillator()
    let osc2 = audioCtx.createOscillator()
    let osc3 = audioCtx.createOscillator()
    let osc4 = audioCtx.createOscillator()
    let osc5 = audioCtx.createOscillator()
    oscillatorList = [osc1, osc2, osc3, osc4, osc5]
    
    let globalGain = audioCtx.createGain()
    globalGain.gain.value =50; 
    globalGain.connect(audioCtx.destination);
    
    for (let i=0; i<oscillatorList.length;i++){
       oscillatorList[i].type = "triangle"
       oscillatorList[i].frequency.value = (i+1)*10 
       oscillatorList[i].connect(globalGain) 
       oscillatorList[i].start()
    }  

   globalGain.gain.setTargetAtTime(0, audioCtx.currentTime, 0.5)
  // 0 so that the sound stops. 0.5 so that it takes longer time to reach value 0
 
    


    

  
     
}

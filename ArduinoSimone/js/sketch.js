/*
  Author:     Calvin W Feldt
  Start Date: 02 May 2022

  Title: Arduino Simone
*/

// Variables: Definitions
//
// gameState: decides the application's current stage; controls the entire program's behavior
// fade1: variable for controlling the fade in and out of assets
// fade2: alternate to fade1
// fadeAmount: the amount that the fade should change in each cycle
// gameStateTemp: temporary gameState variable to allow the usage of the same transition.
// bg1, bg2, bg3: background color values
// lastFrame: the last frame for any sequence (reused throughout)
let gameState = "title screen";
let fade1 = 255;
let fade2 = 255;
let fadeAmount = 1;
let gameStateTemp = "temp";
let bg1 = 30, bg2 = 30, bg3 = 140;
let lastFrame = -60;
let colorAmount = 4;
let timeAllowed = 10;
let levelAmount = 5;
let timerState = false;
let currentLevel = 0;
let levelOrder = [];
levelOrder[-1] = 1;
let userOrder = [];
let userReady =  false;
let fadeRed = 0;
let fadeGreen = 0;
let fadeBlue = 0;
let fadeYellow = 0;
let inputIndex = -1;
let computerIndex = 0;
let whoseTurn = 0;        // 0: Computer's turn, 1: Player's turn
let xcord = 209;
let ycord = 181;
let xMove = 4;
let yMove = 4;

// Serial Communication
let serialPDM;                              // Variable to hold instance of serialport library
let portName = 'COM4';                      // Fill in your serial port name here
let sensors;                                // Sensor values
let buttonValue0;
let buttonValue1;                           // The state of the buttons
let buttonValue2;
let buttonValue3;
let lastButtonValue0 = 0;
let lastButtonValue1 = 0;
let lastButtonValue2 = 0;
let lastButtonValue3 = 0;
let lastButtonValue0Alt = 0;
let lastButtonValue1Alt = 0;
let lastButtonValue2Alt = 0;
let lastButtonValue3Alt = 0;
let lastButtonFrame = 0;
let button0Ready = false;       // The spacebar
let button1Ready = false;       // The red button
let button2Ready = false;       // The yellow button
let button3Ready = false;       // The blue button

// Tone.js Integration
time = .001;
Tone.Transport.bpm.value = 140;
let musicTriggered = false;
let changeTriggered = false;
let greenSoundTrigger = false;
let redSoundTrigger = false;
let yellowSoundTrigger = false;
let blueSoundTrigger = false;

const titleTheme = [   //The title screen and mode select theme
  {'time': '0:0:0', 'note': ['A#4', 'D5', 'F5', 'A5'], 'duration': '16n'},
  {'time': '0:0:2', 'note': ['A#4', 'D5', 'F5', 'A5'], 'duration': '16n'},
  {'time': '0:0:4', 'note': ['A#4', 'D5', 'F5', 'A5'], 'duration': '16n'},
  {'time': '0:0:6', 'note': ['A#4', 'D5', 'G5'], 'duration': '16n'},
  {'time': '0:0:16', 'note': ['A#4', 'D5', 'F5', 'A5'], 'duration': '16n'},
  {'time': '0:0:18', 'note': ['A#4', 'D5', 'F5', 'A5'], 'duration': '16n'},
  {'time': '0:0:20', 'note': ['A#4', 'D5', 'F5', 'A5'], 'duration': '16n'},
  {'time': '0:0:22', 'note': ['A#4', 'D5', 'G5'], 'duration': '16n'},
  {'time': '0:0:26', 'note': ['A#4', 'D5', 'F5', 'A5'], 'duration': '16n'},
  {'time': '0:0:28', 'note': ['A#4', 'D5', 'F5', 'A#5'], 'duration': '16n'},
  {'time': '0:0:30', 'note': ['A#4', 'D5', 'F5', 'C6'], 'duration': '16n'},
  {'time': '0:0:32', 'note': ['A#4', 'C#5', 'E5', 'A5'], 'duration': '16n'},
  {'time': '0:0:34', 'note': ['A#4', 'C#5', 'E5', 'A5'], 'duration': '16n'},
  {'time': '0:0:36', 'note': ['A#4', 'C#5', 'E5', 'A5'], 'duration': '16n'},
  {'time': '0:0:38', 'note': ['A#4', 'C#5', 'E5', 'G5'], 'duration': '16n'},
  {'time': '0:0:48', 'note': ['A#4', 'C#5', 'E5', 'A5'], 'duration': '16n'},
  {'time': '0:0:50', 'note': ['A#4', 'C#5', 'E5', 'A5'], 'duration': '16n'},
  {'time': '0:0:52', 'note': ['A#4', 'C#5', 'E5', 'A5'], 'duration': '16n'},
  {'time': '0:0:54', 'note': ['A#4', 'C#5', 'E5', 'G5'], 'duration': '16n'},
  {'time': '0:0:58', 'note': ['A#4', 'C#5', 'E5', 'A5'], 'duration': '16n'},
  {'time': '0:0:60', 'note': ['A#4', 'C#5', 'E5', 'A#5'], 'duration': '16n'},
  {'time': '0:0:62', 'note': ['A#4', 'C#5', 'E5', 'C6'], 'duration': '16n'},
  {'time': '0:0:64', 'note': ['D#5', 'G5', 'A#5', 'D6'], 'duration': '16n'},
  {'time': '0:0:66', 'note': ['D#5', 'G5', 'A#5', 'D6'], 'duration': '16n'},
  {'time': '0:0:68', 'note': ['D#5', 'G5', 'A#5', 'D6'], 'duration': '16n'},
  {'time': '0:0:70', 'note': ['D#5', 'G5', 'C6'], 'duration': '16n'},
  {'time': '0:0:80', 'note': ['D#5', 'G5', 'A#5', 'D6'], 'duration': '16n'},
  {'time': '0:0:82', 'note': ['D#5', 'G5', 'A#5', 'D6'], 'duration': '16n'},
  {'time': '0:0:84', 'note': ['D#5', 'G5', 'A#5', 'D6'], 'duration': '16n'},
  {'time': '0:0:86', 'note': ['D#5', 'G5', 'C6'], 'duration': '16n'},
  {'time': '0:0:90', 'note': ['D#5', 'G5', 'A#5', 'D6'], 'duration': '16n'},
  {'time': '0:0:92', 'note': ['D#5', 'G5', 'A#5', 'D#6'], 'duration': '16n'},
  {'time': '0:0:94', 'note': ['D#5', 'G5', 'A#5', 'F6'], 'duration': '16n'},
  {'time': '0:0:96', 'note': ['D#5', 'F#5', 'A5', 'D6'], 'duration': '16n'},
  {'time': '0:0:98', 'note': ['D#5', 'F#5', 'A5', 'D6'], 'duration': '16n'},
  {'time': '0:0:100', 'note': ['D#5', 'F#5', 'A5', 'D6'], 'duration': '16n'},
  {'time': '0:0:102', 'note': ['D#5', 'F#5', 'A5', 'C6'], 'duration': '16n'},
  {'time': '0:0:112', 'note': ['D#5', 'F#5', 'A5', 'D6'], 'duration': '16n'},
  {'time': '0:0:114', 'note': ['D#5', 'F#5', 'A5', 'D6'], 'duration': '16n'},
  {'time': '0:0:116', 'note': ['D#5', 'F#5', 'A5', 'D6'], 'duration': '16n'},
  {'time': '0:0:118', 'note': ['D#5', 'F#5', 'A5', 'C6'], 'duration': '16n'},
  {'time': '0:0:122', 'note': ['D#5', 'F#5', 'A5', 'D6'], 'duration': '16n'},
  {'time': '0:0:124', 'note': ['D#5', 'F#5', 'A5', 'C6'], 'duration': '16n'},
  {'time': '0:0:126', 'note': ['D#5', 'F#5', 'A#5'], 'duration': '16n'},
]

const titleTap = [
  {'time': '0:0:0', 'note': 'A3', 'duration': '16n'},
  {'time': '0:0:6', 'note': 'G3', 'duration': '16n'},
  {'time': '0:0:12', 'note': 'G3', 'duration': '16n'},
  {'time': '0:0:16', 'note': 'A3', 'duration': '16n'},
  {'time': '0:0:22', 'note': 'G3', 'duration': '16n'},
  {'time': '0:0:28', 'note': 'G3', 'duration': '16n'},
]

const titleTap2 = [
  {'time': '0:0:0', 'note': 'A3', 'duration': '16n'},
  {'time': '0:0:2', 'note': 'A3', 'duration': '16n'},
  {'time': '0:0:4', 'note': 'A3', 'duration': '16n'},
  {'time': '0:0:6', 'note': 'G3', 'duration': '16n'},
  {'time': '0:0:8', 'note': 'A3', 'duration': '16n'},
  {'time': '0:0:10', 'note': 'A3', 'duration': '16n'},
  {'time': '0:0:12', 'note': 'G3', 'duration': '16n'},
  {'time': '0:0:14', 'note': 'A3', 'duration': '16n'},
  {'time': '0:0:16', 'note': 'A3', 'duration': '16n'},
  {'time': '0:0:18', 'note': 'A3', 'duration': '16n'},
  {'time': '0:0:20', 'note': 'A3', 'duration': '16n'},
  {'time': '0:0:22', 'note': 'G3', 'duration': '16n'},
  {'time': '0:0:24', 'note': 'A3', 'duration': '16n'},
  {'time': '0:0:26', 'note': 'A3', 'duration': '16n'},
  {'time': '0:0:28', 'note': 'G3', 'duration': '16n'},
  {'time': '0:0:30', 'note': 'A3', 'duration': '16n'},
]


const titleBass = [
  {'time': '0:0:0', 'note': 'A3', 'duration': '8n'},
  {'time': '0:0:6', 'note': 'G3', 'duration': '4n'},
  {'time': '0:0:16', 'note': 'A3', 'duration': '8n'},
  {'time': '0:0:22', 'note': 'G3', 'duration': '4n'},
]

const synth1 = new Tone.PolySynth({   //Synth for the Melody
  oscillator: {
    volume: -2,
    count: 3,
    spread: 40,
    type: "triangle"
  }
}).toDestination();

const synth2 = new Tone.PluckSynth({   //Synth for the Bass
  oscillator: {
    volume: 10,
    count: 3,
    spread: 40,
    //type: "sawtooth"
  }
}).toDestination();

const synth3 = new Tone.Synth({   //Synth for the Bass
  oscillator: {
    volume: 4,
    count: 5,
    spread: 40,
    type: "sine"
  }
}).toDestination();

const synth4 = new Tone.PluckSynth({   //Synth for the Bass
  oscillator: {
    volume: 4,
    count: 3,
    spread: 40,
    //type: "sawtooth"
  }
}).toDestination();

const synth5 = new Tone.PolySynth({   //Synth for the Melody
  oscillator: {
    volume: 4,
    count: 3,
    spread: 40,
    type: "triangle"
  }
}).toDestination();

const titleThemePart = new Tone.Part(function(time, note) {
  synth1.triggerAttackRelease(note.note, note.duration, time);
}, titleTheme);
const titlePluck1 = new Tone.Part(function(time, note) {
  synth2.triggerAttackRelease(note.note, note.duration, time);
}, titleTap);
const titleBassPart = new Tone.Part(function(time, note) {
  synth3.triggerAttackRelease(note.note, note.duration, time);
}, titleBass);
const titlePluck2 = new Tone.Part(function(time, note) {
  synth4.triggerAttackRelease(note.note, note.duration, time);
}, titleTap2);

titleThemePart.loop = true;
titlePluck1.loop = true;
titleBassPart.loop = true;
titlePluck2.loop = true;
titleThemePart.loopEnd = "0:0:128";
titlePluck1.loopEnd = "0:0:32";
titleBassPart.loopEnd = "0:0:32";
titlePluck2.loopEnd = "0:0:32";


function preload() {
  // Fonts
  KamikazeFont = loadFont("media/fonts/Kamikaze.ttf");
  Kamikaze3DGradFont = loadFont("media/fonts/Kamikaze3DGradient.ttf");
  koreanCal = loadFont("media/fonts/Korean_Calligraphy.ttf");
  aldoFont = loadFont("media/fonts/AldotheApache.ttf");
  // Pictures and Sprites
  rolledLol = loadImage("media/neverGiveUp.jpg");
}


function setup() {
  serialPDM = new PDMSerial(portName);  // Serial open
  console.log(serialPDM.inData);        // Print to Console
  sensors = serialPDM.sensorData;       // Nickname for sensorData

  createCanvas(1152, 648);
  imageMode(CENTER);
}


function draw() {
  background(bg1, bg2, bg3);

  buttonValue1 = sensors.p9;
  buttonValue2 = sensors.p10;
  buttonValue3 = sensors.p11;

 if(buttonValue1 == 1 && buttonValue1 != lastButtonValue1){
  serialPDM.transmit('led1',1);
  console.log(serialPDM.sensorsConnected());
  lastButtonValue1 = 1;
 } else if (buttonValue1 == 0 && buttonValue1 != lastButtonValue1){
   serialPDM.transmit('led1',0);
   console.log(serialPDM.sensorsConnected());
   lastButtonValue1 = 0;
 }
 if(buttonValue2 == 1 && buttonValue2 != lastButtonValue2){
  serialPDM.transmit('led2',1);
  console.log(serialPDM.sensorsConnected());
  lastButtonValue2 = 1;
 } else if (buttonValue2 == 0 && buttonValue2 != lastButtonValue2){
   serialPDM.transmit('led2',0);
   console.log(serialPDM.sensorsConnected());
   lastButtonValue2 = 0;
 }
 if(buttonValue3 == 1 && buttonValue3 != lastButtonValue3){
  serialPDM.transmit('led3',1);
  console.log(serialPDM.sensorsConnected());
  lastButtonValue3 = 1;
 } else if (buttonValue3 == 0 && buttonValue3 != lastButtonValue3){
   serialPDM.transmit('led3',0);
   console.log(serialPDM.sensorsConnected());
   lastButtonValue3 = 0;
 }

  // This program operates around switch statements to decide what gameState actions should be taken.
  // A corresponding switch statement exists within the "mouseClicked" to designate actions based upon
  // the layout provided by this statement.
  // Generally, the gameState will progress from top to bottom, with the exception of Game Modes.
  switch(gameState) {

    case "title screen":        // The opening screen
      textFont(aldoFont);      // Any button can be pressed to advance the gameState
      noStroke();
      fill(220, 220, 220);
      textSize(100);
      text("Arduino", 245, 150);
      textSize(230);
      text("Simone!", 240, 320);
      fill(0, 0, 0, fade1);
      textSize(60);
      if(fade1 <= 40) fadeAmount = 3;
      if(fade1 >= 255) fadeAmount = -3;
      fade1 += fadeAmount;
      text("CLICK TO START", 370, 500);

      if(musicTriggered == false){    //Triggers the music to play.
        titleThemePart.start();
        titlePluck1.start();
        titleBassPart.start();
        musicTriggered = true;
      }
      Tone.Transport.start();
    break;

    case "transition1":         // Transitional phase between title screen and mode select
      textFont(aldoFont);
      noStroke();
      fill(220, 220, 220, fade2);
      textSize(100);
      text("Arduino", 245, 150);
      textSize(230);
      text("Simone!", 240, 320);
      fill(0, 0, 0, fade1);
      textSize(60);
      text("CLICK TO START", 370, 500);
      fadeAmount = -4;
      if(fade1 > 1) fade1 += fadeAmount;
      if(fade2 > 1) fade2 += fadeAmount;
      if(fade1 <= 1 && fade2 <= 1) gameState = 'mode select';
    break;

    case "mode select":         // Screen allowing the user to select the game mode
      noStroke();
      fill(220, 220, 220, fade1);
      textSize(100);
      if(fade1 < 255) fade1 += 4;
      text("Select Your Mode", 230, 150);
      textSize(50);

      if(mouseX > 420 && mouseX < 734) {
        if(mouseY > 230 && mouseY < 300) {
          fill(200, 200, 200, fade1);
          rect(410, 227, 334, 70, 10);
          fill(120, 120, 120, fade1);
          text("Timed Levels", 450, 280);
        } else {
          fill(160, 160, 160, fade1);
          rect(410, 227, 334, 70, 10);
          fill(80, 80, 80, fade1);
          text("Timed Levels", 450, 280);
        }
        if(mouseY > 350 && mouseY < 420) {
          fill(200, 200, 200, fade1);
          rect(410, 347, 334, 70, 10);
          fill(120, 120, 120, fade1);
          text("Endless", 496, 400);
        } else {
          fill(160, 160, 160, fade1);
          rect(410, 347, 334, 70, 10);
          fill(80, 80, 80, fade1);
          text("Endless", 496, 400);
        }
        if(mouseY > 470 && mouseY < 540) {
          fill(200, 200, 200, fade1);
          rect(410, 467, 334, 70, 10);
          fill(120, 120, 120, fade1);
          text("Don't Click Me", 435, 520);
        } else {
          fill(160, 160, 160, fade1);
          rect(410, 467, 334, 70, 10);
          fill(80, 80, 80, fade1);
          text("Don't Click Me", 435, 520);
        }
      } else {
        fill(160, 160, 160, fade1);
        rect(410, 227, 334, 70, 10);
        rect(410, 347, 334, 70, 10);
        rect(410, 467, 334, 70, 10);
        fill(80, 80, 80, fade1);
        text("Timed Levels", 450, 280);
        text("Endless", 496, 400);
        text("Don't Click Me", 435, 520);
      }
    break;
    
    case "transition2":
      noStroke();
      fill(220, 220, 220, fade1);
      textSize(100);
      text("Select Your Mode", 230, 150);
      textSize(50);
      fill(160, 160, 160, fade1);
      rect(410, 227, 334, 70, 10);
      rect(410, 347, 334, 70, 10);
      rect(410, 467, 334, 70, 10);
      fill(80, 80, 80, fade1);
      text("Timed Levels", 450, 280);
      text("Endless", 496, 400);
      text("Don't Click Me", 435, 520);
      fadeAmount = -3;
      if(fade1 > 1) fade1 += fadeAmount;
      if(fade1 <= 1) gameState = gameStateTemp;
    break;

    case "timedLevelsOptions":
      noStroke();
      fill(220, 220, 220, fade1);
      textSize(100);
      if(fade1 < 255) fade1 += 3;
      text("Game Options", 300, 150);
      textSize(50);
      fill(160, 160, 160, fade1);
      text("Colors:", 320, 280);
      text("Timer:", 320, 380);
      text("Levels:", 320, 480);
      text("-           +", 620, 280);
      text("-           +", 620, 380);
      text("-           +", 620, 480);
      fill(200, 200, 200, fade1);
      text(colorAmount, 690, 280);
      text(timeAllowed, 680, 380);
      text(levelAmount, 690, 480);
      if(mouseX > 410 && mouseX < 744 && mouseY > 530 && mouseY < 600){
        fill(200, 200, 200, fade1);
        rect(410, 530, 334, 70, 10);
        fill(120, 120, 120, fade1);
        text("Start", 516, 583);
      } else {
        fill(160, 160, 160, fade1);
        rect(410, 530, 334, 70, 10);
        fill(80, 80, 80, fade1);
        text("Start", 516, 583);
      }
    break;

    case "transition3":
      fadeAmount = -3;
      if(fade1 > 1) fade1 += fadeAmount;
      if(fade1 <= 1) gameState = gameStateTemp;
      noStroke();
      fill(220, 220, 220, fade1);
      textSize(100);
      if(fade1 < 255) fade1 += 3;
      text("Game Options", 300, 150);
      textSize(50);
      fill(160, 160, 160, fade1);
      text("Colors:", 320, 280);
      text("Timer:", 320, 380);
      text("Levels:", 320, 480);
      text("-           +", 620, 280);
      text("-           +", 620, 380);
      text("-           +", 620, 480);
      fill(200, 200, 200, fade1);
      text(colorAmount, 690, 280);
      text(timeAllowed, 680, 380);
      text(levelAmount, 690, 480);
      fill(160, 160, 160, fade1);
      rect(410, 530, 334, 70, 10);
      fill(80, 80, 80, fade1);
      text("Start", 516, 583);
      fadeAmount = -3;
      if(fade1 > 1) fade1 += fadeAmount;
      if(fade1 <= 1) gameState = gameStateTemp;
    break;

    case "playing":
      if(musicTriggered){
        synth1.volume.rampTo(-70, 2);
        titlePluck1.stop();
        titleBassPart.stop();
        musicTriggered = false;
      }
      if(fade1 < 255) fade1 += 4;
      noStroke();
      fill(160, 160, 160, fade1);
      textSize(20);
      text("Level", 1040, 50);
      textSize(60);
      text("1", 1045, 100);
      textSize(70);
      fill(220, 220, 220, fade2);
      if(button0Ready && button1Ready && button2Ready && button3Ready){
        if(fade2 > 0) fade2 -= 4;
        fill(60, 60, 60, fade1);
        rect(300, 200, 580, 130, 40);
        circle(375, 450, 150);
        rect(515, 375, 150, 150, 20);
        triangle(730, 375, 880, 375, 805, 525);
        if(fade2 > 0){
          fill(60, 255, 60, fade2);
          rect(310, 210, 560, 110, 30);
          fill(255, 60, 60, fade2);
          circle(375, 450, 130);
          fill(255, 255, 60, fade2);
          rect(525, 385, 130, 130, 16);
          fill(60, 60, 255, fade2);
          triangle(744, 385, 866, 385, 805, 508);
        } else {
          titleThemePart.stop();
          gameState = "playing2";
          fade1 = 255;
          computerIndex = 1;
          userIndex = 1;
          startFrameCount = frameCount + 60;
          greenSoundTrigger = false;
          redSoundTrigger = false;
          yellowSoundTrigger = false;
          blueSoundTrigger = false;
        }
        
      } else {
        if(fade2 < 255) fade2 +=4;
        if(buttonValue0 == 1){
          button0Ready = true;
          if(greenSoundTrigger == false){
            synth5.triggerAttackRelease("G4", "16n");
            greenSoundTrigger = true;
          }
        }
        if(buttonValue1 == 1){
          button1Ready = true;
          if(redSoundTrigger == false){
            synth5.triggerAttackRelease("C4", "16n");
            redSoundTrigger = true;
          }
        }
        if(buttonValue2 == 1){
          button2Ready = true;
          if(yellowSoundTrigger == false){
            synth5.triggerAttackRelease("D4", "16n");
            yellowSoundTrigger = true;
          }
        }
        if(buttonValue3 == 1){
          button3Ready = true;
          if(blueSoundTrigger == false){
            synth5.triggerAttackRelease("E4", "16n");
            blueSoundTrigger = true;
          }
        }
        text("Press all buttons to begin", 200, 100);
        fill(60, 60, 60, fade1);
        rect(300, 200, 580, 130, 40);
        circle(375, 450, 150);
        rect(515, 375, 150, 150, 20);
        triangle(730, 375, 880, 375, 805, 525);
        if(button0Ready) {
          fill(60, 255, 60, fade1);
          rect(310, 210, 560, 110, 30);
        }
        if(button1Ready){
          fill(255, 60, 60, fade1);
          circle(375, 450, 130);
        }
        if(button2Ready){
          fill(255, 255, 60, fade1);
          rect(525, 385, 130, 130, 16);
        }
        if(button3Ready){
          fill(60, 60, 255, fade1);
          triangle(744, 385, 866, 385, 805, 508);
        }
      }
    break;

    case "playing2":
      fill(60, 60, 60, fade1);
      rect(300, 200, 580, 130, 40);
      circle(375, 450, 150);
      rect(515, 375, 150, 150, 20);
      triangle(730, 375, 880, 375, 805, 525);
      fill(160, 160, 160);
      textSize(20);
      text("Level", 1040, 50);
      textSize(60);
      text(computerIndex + 1, 1045, 100);

      if(whoseTurn == 0){             // Computer's turn; shows the pattern
        fill(220, 220, 220, fade1);
        textSize(100);
        text("Remember!", 384, 150);
        if(frameCount - startFrameCount > 0){
          if((frameCount - startFrameCount) % 60 == 0){
            if(inputIndex < computerIndex){
              inputIndex++;
              fade2 = 255;
              if(levelOrder[inputIndex] == 0){
                synth5.triggerAttackRelease("G4", "16n");
              }
              if(levelOrder[inputIndex] == 1){
                synth5.triggerAttackRelease("C4", "16n");
              }
              if(levelOrder[inputIndex] == 2){
                synth5.triggerAttackRelease("D4", "16n");
              }
              if(levelOrder[inputIndex] == 3){
                synth5.triggerAttackRelease("E4", "16n");
              }
            } else {
              whoseTurn = 1;
              startFrameCount = frameCount;
              inputIndex = 0;
            }
          }
          fade2-= 4;
          if(levelOrder[inputIndex] == null){
            gameState = "resultsWinner";
          }
          if(levelOrder[inputIndex] == 0){
            fill(60, 255, 60, fade2);
            rect(310, 210, 560, 110, 30);
          }
          if(levelOrder[inputIndex] == 1){
            fill(255, 60, 60, fade2);
            circle(375, 450, 130);
          }
          if(levelOrder[inputIndex] == 2){
            fill(255, 255, 60, fade2);
            rect(525, 385, 130, 130, 16);
          }
          if(levelOrder[inputIndex] == 3){
            fill(60, 60, 255, fade2);
            triangle(744, 385, 866, 385, 805, 508);
          }
        }
        if(whoseTurn == 1){
          greenSoundTrigger = false;
          redSoundTrigger = false;
          yellowSoundTrigger = false;
          blueSoundTrigger = false;
        }
      }
      if(whoseTurn == 1){         // Player's turn; copy the pattern
        fadeRed -= 4;
        fadeBlue -= 4;
        fadeGreen -= 4;
        fadeYellow -= 4;
        fill(60, 255, 60, fadeGreen);
        rect(310, 210, 560, 110, 30);
        fill(255, 60, 60, fadeRed);
        circle(375, 450, 130);
        fill(255, 255, 60, fadeYellow);
        rect(525, 385, 130, 130, 16);
        fill(60, 60, 255, fadeBlue);
        triangle(744, 385, 866, 385, 805, 508);
        if(frameCount - lastButtonFrame > 15){
          synth1.volume = -2;
          if(buttonValue0 == 1 && lastButtonValue0Alt != 1){
            fadeGreen = 255;
            if(0 == levelOrder[inputIndex]){
              synth5.triggerAttackRelease("G4", "16n");
              userOrder[inputIndex] = 0;
              inputIndex++;
            } else {
              serialPDM.transmit('led1',1);
              console.log(serialPDM.sensorsConnected());
              gameState = "gameLoss";
              fade2 = 256;
            }
            //lastButtonValue0Alt = 1;
            lastButtonFrame = frameCount;
          }
          if(buttonValue1 == 1 && lastButtonValue1Alt != 1){
            fadeRed = 255;
            if(1 == levelOrder[inputIndex]){
              synth5.triggerAttackRelease("C4", "16n");
              userOrder[inputIndex] = 1;
              inputIndex++;
            } else {
              serialPDM.transmit('led1',1);
              console.log(serialPDM.sensorsConnected());
              gameState = "gameLoss";
              fade2 = 256;
            }
            //lastButtonValue1Alt = 1;
            lastButtonFrame = frameCount;
          }
          if(buttonValue2 == 1 && lastButtonValue2Alt != 1){
            fadeYellow = 255;
            if(2 == levelOrder[inputIndex]){
              synth5.triggerAttackRelease("D4", "16n");
              userOrder[inputIndex] = 2;
              inputIndex = inputIndex + 1;
            } else {
              serialPDM.transmit('led1',1);
              console.log(serialPDM.sensorsConnected());
              gameState = "gameLoss";
              fade2 = 256;
            }
            //lastButtonValue2Alt = 1;
            lastButtonFrame = frameCount;
          }
          if(buttonValue3 == 1 && lastButtonValue3Alt != 1){
            fadeBlue = 255;
            if(3 == levelOrder[inputIndex]){
              synth5.triggerAttackRelease("E4", "16n");
              userOrder[inputIndex] = 3;
              inputIndex++;
            } else {
              serialPDM.transmit('led1',1);
              console.log(serialPDM.sensorsConnected());
              gameState = "gameLoss";
              fade2 = 256;
            }
            //lastButtonValue3Alt = 1;
            lastButtonFrame = frameCount;
          }
        }
        if(buttonValue0 == 0 && lastButtonValue0 == 1){
          lastButtonValue0 = 0;
        }
        if(buttonValue1 == 0 && lastButtonValue1 == 1){
          lastButtonValue1 = 0;
        }
        if(buttonValue2 == 0 && lastButtonValue2 == 1){
          lastButtonValue2 = 0;
        }
        if(buttonValue3 == 0 && lastButtonValue3 == 1){
          lastButtonValue3 = 0;
        }
        if(inputIndex > computerIndex && fadeRed < 1 && fadeGreen < 1 && fadeBlue < 1 && fadeYellow < 1){
          if(levelOrder[computerIndex + 1] == null){
            serialPDM.transmit('led3',1);
            console.log(serialPDM.sensorsConnected());
            gameState = "resultsWinner";
          } else {
            computerIndex++;
            inputIndex = -1;
            whoseTurn = 0;
          }
        }
        if(timerState){
          if(frameCount - startFrameCount < timeAllowed * 60){
            fill(220, 220, 220, fade1);
            textSize(100);
            text("Your Turn", 384, 150);
            textSize(60);
            fill(160, 160, 160, fade1);
            text((int(((startFrameCount + (timeAllowed * 60) - frameCount)) / 60) + 1), 70, 100);
          } else {
            fill(220, 220, 220, fade1);
            textSize(100);
            text("FINISHED!", 410, 150);
            if(frameCount - startFrameCount > (timeAllowed + 2) * 60){
              serialPDM.transmit('led1',1);
              console.log(serialPDM.sensorsConnected());
              gameState = "gameLoss";
              fade2 = 256;
            }
          }
        } else {
          fill(220, 220, 220, fade1);
          textSize(100);
          text("Your Turn", 384, 150);
        }
        
      }
    break;

    case "gameLoss":
      if(musicTriggered == false){
        Tone.Transport.bpm.value = 126;
        titleThemePart.start();
        synth1.volume.rampTo(-2, 0.5);
        titlePluck2.start();
        titleBassPart.start();
        musicTriggered = true;
      }
      if(fade2 > 255){
        fadeAmount = -4;
      }
      if(fade2 < 40){
        fadeAmount = 4;
      }
      fade2 += fadeAmount;
      textSize(100);
      fill(220, 220, 220);
      text("Game Over!", 380, 200);
      fill(220, 80, 80, fade2);
      text(computerIndex + 1, 810, 300);
      textSize(60);
      fill(160, 160, 160);
      text("You made it to level:", 250, 290);
      textSize(40);
      text("Timer:", 480, 360);
      fill(220, 80, 80);
      if(timerState){
        text(timeAllowed, 600, 360);
      } else {
        text("Infinite", 600, 360);
      }
      fill(160, 160, 160);
      text("Colors:", 454, 420);
      fill(220, 80, 80);
      text(colorAmount, 600, 420);
    break;

    case "resultsWinner":
      if(musicTriggered == false){
        Tone.Transport.bpm.value = 126;
        titleThemePart.start();
        synth1.volume.rampTo(-2, 0.5);
        titlePluck2.start();
        titleBassPart.start();
        musicTriggered = true;
      } 
      if(xcord > 400){
        xMove = -2;
      }
      if(xcord < 210){
        xMove = 2;
      }
      xcord += xMove;
      if(ycord > 180){
        yMove = -2;
      }
      if(ycord < 120){
        yMove = 2;
      }
      ycord += yMove;
      textSize(140);
      fill(220, 220, 220);
      text("You Won!", xcord, ycord);
      fill(220, 80, 80);
      text(computerIndex + 1, 810, 300);
      textSize(60);
      fill(160, 160, 160);
      text("You made it to level:", 250, 290);
      textSize(40);
      text("Timer:", 480, 360);
      fill(220, 80, 80);
      if(timerState){
        text(timeAllowed, 600, 360);
      } else {
        text("Infinite", 600, 360);
      }
      fill(160, 160, 160);
      text("Colors:", 454, 420);
      fill(220, 80, 80);
      text(colorAmount, 600, 420);
    break;

    case "foolish1":
      if(bg1 > 0){
        bg1--;
      }
      if(bg2 > 0){
        bg2--;
      }
      if(bg3 > 0){
        bg3--;
      }
      textSize(40);
      fill(120, 30, 30);
      text("why would you do that?", 200, 440);
      if(frameCount - lastFrame > 180){
        text("are you an idiot?", 500, 120);
      }
      if(frameCount - lastFrame > 360){
        text("do you know how to read?", 60, 240);
      }
      if(frameCount - lastFrame > 540){
        text("how hard is it to follow simple instructions?", 120, 560);
      }
      fill(220, 220, 220);
      if(frameCount - lastFrame > 720){
        text("just remember, this is your fault", 400, 370);
      }
      if(frameCount - lastFrame > 900){
      image(rolledLol, 400, 300, 400, 400);
      }
    break;

    default:
      fill(0, 0, 0);
      textSize(80);
      text("Error", 460, 280);
      textSize(36);
      text("Invalid game mode detected", 340, 350);
      text("Please report error and restart", 310, 400);
    break;

  }

  if(buttonValue0 == 1){
    buttonValue0 = 0;
  }
}

// Procedures for when the mouse is pressed.
function mousePressed() {

  switch(gameState) {

    case "title screen":  
      gameState = "transition1";
    break;

    case "mode select":
      if(mouseX > 420 && mouseX < 724) {
        if(mouseY > 230 && mouseY < 300) {
          gameStateTemp = "timedLevelsOptions";
          gameState = "transition2";
        } else if(mouseY > 350 && mouseY < 420) {
          gameStateTemp = "playing";
          gameState = "transition2";
          tiemrState = false;
          levelAmount = 256;
          loadGameAssets();
        } else if(mouseY > 470 && mouseY < 540) {
          gameStateTemp = "foolish1";
          gameState = "transition2";
          lastFrame = frameCount;
        }
      }
    break;

    // For some reason I had trouble with this segment.
    // Every click incremented the values twice as much as expected.
    // My best solution was to increment the values by .5 instead of 1.
    case "timedLevelsOptions":
      if(mouseX > 615 && mouseX < 640){
        if(mouseX > 615 && mouseX < 640){
          if(mouseY > 250 && mouseY < 274){
            if(colorAmount > 2){
              colorAmount = colorAmount - .5;
            }
          } else if(mouseY > 350 && mouseY < 374){
            if(timeAllowed > 3){
              timeAllowed = timeAllowed - .5;
            }
          } else if(mouseY > 450 && mouseY < 474){
            if(levelAmount > 3){
              levelAmount = levelAmount - .5;
            }
          }
        }
      }
      if(mouseX > 763 && mouseX < 788){
        if(mouseY > 250 && mouseY < 274){
          if(colorAmount < 4){
            colorAmount = colorAmount + .5;
           }
        } else if(mouseY > 350 && mouseY < 374){
          if(timeAllowed < 30){
            timeAllowed = timeAllowed + .5;
          }
        } else if(mouseY > 450 && mouseY < 474){
          if(levelAmount < 20){
            levelAmount = levelAmount + .5;
          }
        }
      }
      if(mouseX > 410 && mouseX < 744 && mouseY > 530 && mouseY < 600){
        gameStateTemp = "playing";
        gameState = "transition3";
        timerState = true;
        fade2 = 0;
        loadGameAssets();
      }
    break;


  }
}

function keyPressed(){
  if(keyCode == 32){  //Spacebar
    buttonValue0 = 1;
  }
}

function loadGameAssets() {
  for(let i = 0; i < levelAmount; i++) {
    levelOrder[i] = int(random(colorAmount));
    userOrder[i] = -1;
  }
}
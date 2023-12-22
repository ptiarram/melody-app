// Middle C.
let first = 262;

// Array of frequencies in the key
// of C Major.
let frequencies = [
  first,
  first * 9/8,
  first * 5/4,
  first * 4/3,
  first * 3/2,
  first * 5/3,
  first * 15/8,
  first * 2
];

// Array of Oscillator objects.
let oscillators = [];

let melody = { name: 'Untitled', notes: [0,1,0,1,0,1,0,1], tempo: 120 };
let tempo = melody.tempo;
let noteDuration = 60 / tempo; // Duration of each note in seconds

let songs;
let songSelect;


function preload() {
  songs = loadJSON("/songs");
}


function setup() {
  createCanvas(400, 400);
  
  // Create Oscillator objects.
  for (let freq of frequencies) {
    let osc = new Oscillator(freq);
    osc.amp(0);
    osc.start();
    oscillators.push(osc);
  }
 
  let button = createButton('Play Song');
  button.position(50, 100);
  button.mousePressed(play);
  
  let savebutton = createButton('Save Song');
  savebutton.position(150, 100);
  savebutton.mousePressed(saveSong);
  
  // Create a dropdown to select drawings.
  songSelect = createSelect();
  songSelect.position(100, 150);

  
  // Add a list of options.
  songSelect.option(""); //none song
  for (let file of songs.files) {
    songSelect.option(file);
  }
  
  
  // Add a callback function.
  songSelect.changed(loadSong);
  
}

// Load the drawing file.
function loadSong() {
  // Get the drawing's file name.
  let fileName = songSelect.selected();

  // Load the file from the server.
  loadJSON(`/songs/${fileName}`, function (results) {
    melody = results;
    tempo = melody.tempo;
    noteDuration = 60 / tempo;
  });
}

function saveSong(){
    httpPost("/songs", "json", melody);
    redraw();
}


function draw() {
  background(220);
}

function play() {
  for (let i = 0; i < melody.notes.length; i++) {
    let n = melody.notes[i];
    setTimeout(function() { playNote(n); }, noteDuration * 1000 * i);
  }
}

function playNote(n) {
  oscillators[n].amp(1, 0.01); // Start playing the note
  setTimeout(function() { stopNote(n); }, noteDuration * 1000); // Stop after the duration
}

function stopNote(n) {
  oscillators[n].amp(0); // Stop playing the note
}

// Middle C.
let first = 262;

// Array of frequencies in the key
// of C Major.
let frequencies = [
  first,
  (first * 9) / 8,
  (first * 5) / 4,
  (first * 4) / 3,
  (first * 3) / 2,
  (first * 5) / 3,
  (first * 15) / 8,
  first * 2,
];

// Array of Oscillator objects.
let oscillators = [];

let melody = { name: "Untitled", notes: [] };
let nameInput;
let tempo = 120; // Beats per minute
let noteDuration = 60 / tempo; // Duration of each note in seconds

function setup() {
  createCanvas(400, 400);

  colorMode(HSB);

  // Create Oscillator objects.
  for (let freq of frequencies) {
    let osc = new Oscillator(freq);
    osc.amp(0);
    osc.start();
    oscillators.push(osc);
  }

  let playButton = createButton("Play Song");
  playButton.position(155, 410);
  playButton.mousePressed(play);

  nameInput = createInput(melody.name);
  nameInput.position(5, 450);
  nameInput.size(200);

  let savebutton = createButton("Save Song");
  savebutton.position(225, 450);
  savebutton.mousePressed(saveSong);
  
}

function draw() {
  drawEditor();
}

function drawEditor() {
  let numIntervals = 8;
  let gridSize = width / numIntervals;
  let numNotes = 8;
  for (let t = 0; t < numIntervals; t += 1) {
    // Draw from left to right.
    let x = t * gridSize;
    for (let n = 0; n < numNotes; n += 1) {
      // Draw from bottom to top.
      let y = height - (n + 1) * gridSize;
      
      // Set the fill color.
      if (melody.notes[t] === n) {
        let h = map(n, 0, numNotes, 0, 360);
        fill(h, 100, 100);
      } else {
        fill("white");
      }
      
      // Draw a rounded square.
      square(x, y, gridSize, 10);
    }
  }
}

function mousePressed() {
  updateMelody();
}

function updateMelody() {
  let numIntervals = 8;
  let gridSize = width / numIntervals;
  let numNotes = 8;
  for (let t = 0; t < numIntervals; t += 1) {
    // Move from left to right.
    let x = t * gridSize;
    for (let n = 0; n < numNotes; n += 1) {
      // Move from bottom to top.
      let y = height - (n + 1) * gridSize;
      
      // Check if the mouse is within the square.
      // If it is, set that time interval's note.
      if (mouseX > x && mouseX < x + gridSize && mouseY > y && mouseY < y + gridSize) {
        melody.notes[t] = n;
      }
    }
  }
}

function play() {
  for (let i = 0; i < melody.notes.length; i += 1) {
    let n = melody.notes[i];
    setTimeout(function () {
      playNote(n);
    }, noteDuration * 1000 * i);
  }
}

function playNote(n) {
  oscillators[n].amp(1, 0.01); // Start playing the note
  setTimeout(function () {
    stopNote(n);
  }, noteDuration * 1000); // Stop after the duration
}

function stopNote(n) {
  oscillators[n].amp(0, 0.01); // Stop playing the note
}

function saveSong(){
    melody.name = nameInput.value();
    httpPost("/songs", "json", melody);
    nameInput.value("");
}

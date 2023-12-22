const express = require('express');
const fs = require('fs');
const app = express();
const port = 3000;

// Serve static files from 'public' directory
app.use(express.static('public'));
app.use(express.static("songs"));
// To handle JSON payloads
app.use(express.json());

// API endpoint to get list of songs
app.get('/songs', (req, res) => {
  fs.readdir('songs', (err, files) => {
    if (err) {
      res.status(500).send('Error reading song files');
    } else {
      res.json({ files });
    }
  });
});

// API endpoint to get a specific song
app.get('/songs/:filename', (req, res) => {
  const filename = req.params.filename;
  fs.readFile(`songs/${filename}`, 'utf8', (err, data) => {
    if (err) {
      res.status(404).send('Song not found');
    } else {
      res.json(JSON.parse(data));
    }
  });
});

// API endpoint to save a song
// Write a new JSON file with
// points from a drawing.
app.post("/songs", function (req, res) {
  // Create a variable containing the
  // JSON sent from the client.
  let data = req.body;

  // Create a string with the path of
  // the file to write.
  let fileName = `${__dirname}/songs/${data.name}.json`;

  // Convert the JSON data into text for storage.
  let stringData = JSON.stringify(data);

  // Write the file.
  fs.writeFile(fileName, stringData, function (err) {
    // Log any errors that occur.
    if (err) {
      console.error(err);
    }
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

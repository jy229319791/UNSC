// create node.js and express server that listens on port 3000
// and responds with a message "Hello World" when a request is made to the root URL
const express = require("express");
const app = express();
const port = 3000;

const Datastore = require("nedb"); // https://github.com/louischatriot/nedb#readme
const db = new Datastore({ filename: "./parkings.db", autoload: true });

// // Insert a document
// db.insert({ name: "Jane Doe", age: 25 }, function (err, newDoc) {
//   console.log(newDoc);
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Try /getParkings or /setParking instead! ");
});

app.get("/getParkings", (req, res) => {
  // TODO: get parkings from mongodb, sort using address, and return them as json

  // This is how you can get all the parkings from the database
  db.find({}, (err, docs) => {
    res.json(docs);
  });
});
app.post("/setParking", (req, res) => {
  res.send(
    "TODO: set parking in mongodb and return the id of the parking created"
  );
});

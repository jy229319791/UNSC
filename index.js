// create node.js and express server that listens on port 3000
// and responds with a message "Hello World" when a request is made to the root URL
const express = require("express");
const app = express();
const port = 3000;

const Datastore = require("nedb"); // https://github.com/louischatriot/nedb#readme
const db = new Datastore({ filename: "./parkings.db", autoload: true });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Try /getParkings or /setParking instead! ");
});

app.get("/getParkings", (req, res) => {
  // TODO: get parkings from db, sort using address, and return them as json
  db.find({address:req.body}, (err, docs) => {
    res.json(docs);
  });

  // This is how you can get all the parkings from the database
  db.find({}, (err, docs) => {
    res.json(docs);
  });
});
app.post("/setParking", (req, res) => {
  const newParking = req.body;
  db.insert(newParking, function (err, newDoc) {
    if (err) {
      console.log("Error inserting data : ", err);
      res.status(500).send("error inserting data");
    } else {
      console.log("Data inserted : ", newDoc);
      res.status(200).send({ _id: newDoc._id });
    }
  });
});

/**var newParking = {
  address: "3000 Landerholm Circle SE, Bellevue, WA 98007",
  xLocation: "47.5854416125115",
  yLocation: " -122.14795645970051",
  author: "Tommy",
  rating: 4.5,
  creationDate: new Date(),
  description: "Here is the description",
  tags: ["great", "solid", "visible"],
  title: "Great Parking",
  image: "image"
};
db.insert(newParking, function (err, newDoc){
})*/
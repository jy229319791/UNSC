// create node.js and express server that listens on port 3000
// and responds with a message "Hello World" when a request is made to the root URL
const express = require("express");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");

const Datastore = require("nedb"); // https://github.com/louischatriot/nedb#readme
const db = new Datastore({ filename: "./parkings.db", autoload: true });

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Try /getParkings or /setParking instead! ");
});

app.get("/getParkings", (req, res) => {
  const query = req.query.address ? { address: req.query.address } : {};
  
  db.find(query).sort({ address: 1 }).exec((err, docs) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }
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

//Ying
//function to calculate the distance in miles.
function distance(lat1, lon1, lat2, lon2){
  function Radius(x) {
    return x * Math.PI / 180;
  } 

  const R = 3959; //radius in miles
  const dLat = Radius(lat2 - lat1);
  const dLon = Radius(lon2 - lon1);
  const a = Math.sin(dLat /2) *Math.sin(dLat /2 )+ Math.cos(Radius(Lat1))*Math.cos(Radius(lat2))* Math.sin (dLon /2) *Math.sin(dLon /2);

  const b = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  const distance = R* b;
  return distance;
}

app.get("/findParking", (req, res) => {
  const {x,y} = req.query;
  const max = 5; //max distance 5 miles

  if(!x || !y){
    res.status(400).send("Missing Latitude and Longitude.");
    return;
  }

  const lat = parseFloat(x);
  const lon = parseFloat(y);

  db.find({}, (err, parkings) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const nearestParkings = parkings.filter(parking => {
      return distance(lat, lon, parseFloat(parking.xLocation), parseFloat(parking.yLocation)) <= maxDistance;
    });

    res.json(nearestParkings);
  });
});
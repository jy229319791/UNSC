// create node.js and express server that listens on port 3000
const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;

const Datastore = require("nedb"); // https://github.com/louischatriot/nedb#readme
const db = new Datastore({ filename: "./parkings.db", autoload: true });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const GOOGLE_MAPS_API_KEY = "AIzaSyAFcBA5PGa8mPKp9WZqs23rtDYsN4F4Uwo";

const getCoords = async (addressString) => {
  let status;
  try {
    const response = await axios.get(
      `https://maps.googleapis.com/maps/api/geocode/json`,
      {
        params: {
          address: addressString,
          key: GOOGLE_MAPS_API_KEY,
        },
      }
    );
    status = response.data.status;
    const location = response.data.results[0].geometry.location;
    return [location.lat, location.lng];
  } catch (error) {
    console.error("Error fetching geocoding data:", status);
  }
};
// EXAMPLE USAGE
// getCoords("Bellevue").then(console.log);
// getCoords("3000 Landerholm Circle SE, Bellevue, WA 98007").then(console.log);

app.get("/", (req, res) => {
  res.send("Try /getParkings or /setParking instead! ");
});

app.get("/getParkings", (req, res) => {
  // TODO: get parkings from db, sort using address, and return them as json
  db.find({ address: req.body }, (err, docs) => {
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

app.get("/getCoordinates", async (req, res) => {
  const addressString = req.query.address;
  if (!addressString) {
    return res.status(400).send({ error: "Address string is required" });
  }

  const [x, y] = await getCoords(addressString);
  res.json({ x, y });
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

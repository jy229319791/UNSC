// create node.js and express server that listens on port 3000
const express = require("express");
const axios = require("axios");
const app = express();
const port = 3000;
const bodyParser = require("body-parser");
const geolib = require("geolib");
const Datastore = require("nedb"); // https://github.com/louischatriot/nedb#readme
const db = new Datastore({ filename: "./parkings.db", autoload: true });

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

const GOOGLE_MAPS_API_KEY = "AIzaSyAFcBA5PGa8mPKp9WZqs23rtDYsN4F4Uwo";
// Hammaad
// Converts address string to latitute and longitude
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

app.get("/", (req, res) => {
  res.send("Try /getParkings, /setParking, or /findParking instead! ");
});

// Hammaad
// API to convert address to coordinates
app.get("/getCoordinates", async (req, res) => {
  const address = req.query.address;
  if (!address) {
    return res.status(400).send("Address query parameter is required");
  }

  try {
    const coordinates = await getCoords(address);
    res.json({ x: coordinates[0], y: coordinates[1] });
  } catch (error) {
    res.status(500).send(error.message);
  }
});


app.get("/getParkings", (req, res) => {
  const query = req.query.address ? { address: req.query.address } : {};

  db.find(query)
    .sort({ address: 1 })
    .exec((err, docs) => {
      if (err) {
        res.status(500).json({ error: err.message });
        return;
      }
      res.json(docs);
    });
});

//Oscar
//Saving the data from an object from the front end onto the database
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

//Ying
//findParking Route
app.get("/findParking", (req, res) => {
  const { x, y } = req.query;
  //check if lat or lon is missing
  if (!x || !y) {
    res.status(400).send("Missing latitude or longitude");
    return;
  }

  const lat = parseFloat(x);
  const lon = parseFloat(y);

  //get all parking spots from the nedb file
  db.find({}, (err, parkings) => {
    if (err) {
      res.status(500).json({ error: err.message });
      return;
    }

    const max = 25 * 1609.34; //25 miles max distance

    //filter the parking within 25 miles
    const nearestParkings = parkings
      .filter((parking) => {
        const distance = geolib.getDistance(
          { latitude: lat, longitude: lon },
          {
            latitude: parseFloat(parking.xLocation),
            longitude: parseFloat(parking.yLocation),
          }
        );
        return distance <= max;
      })
      .map((parking) => {
        const distance = geolib.getDistance(
          { latitude: lat, longitude: lon },
          {
            latitude: parseFloat(parking.xLocation),
            longitude: parseFloat(parking.yLocation),
          }
        );
        return {
          ...parking,
          distance: (distance / 1609.34).toFixed(2) + " miles", // convert meters to miles
        };
      });

    //respond
    res.json(nearestParkings);
  });
});

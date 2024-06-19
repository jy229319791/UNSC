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

//update getParkings route to accept an id query parameter
app.get("/getParkings", (req, res) => {
  const { id } = req.query;
  const query = id ? { _id: id } : {};

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

<<<<<<< HEAD
=======
/*const parkings = [
  {
    address: "14200 SE Eastgate Way, Bellevue, WA 98007",
    xLocation: "47.5815",
    yLocation: "-122.1465",
    author: "King County Metro",
    rating: 4.0,
    creationDate: new Date(),
    description: "On-demand lockers available.",
    tags: ["safe", "convenient"],
    title: "Eastgate Park & Ride",
    image: "image"
  },
  {
    address: "SR-520 & Evergreen Point Rd, Medina, WA 98038",
    xLocation: "47.6401",
    yLocation: "-122.2405",
    author: "Sound Transit",
    rating: 4.2,
    creationDate: new Date(),
    description: "On-demand lockers available.",
    tags: ["safe", "connected"],
    title: "Evergreen Point Bridge Park & Ride",
    image: "image"
  },
  {
    address: "31621 23rd Ave S, Federal Way, WA 98003",
    xLocation: "47.3113",
    yLocation: "-122.3059",
    author: "Sound Transit",
    rating: 4.5,
    creationDate: new Date(),
    description: "Leased lockers available.",
    tags: ["secure", "spacious"],
    title: "Federal Way Transit Center",
    image: "image"
  },
  {
    address: "6601 8th Ave NE, Seattle, WA 98115",
    xLocation: "47.6761",
    yLocation: "-122.3201",
    author: "King County Metro",
    rating: 4.3,
    creationDate: new Date(),
    description: "On-demand lockers available.",
    tags: ["safe", "accessible"],
    title: "Green Lake Park & Ride",
    image: "image"
  },
  {
    address: "1755 Highlands Dr NE, Issaquah, WA 98029",
    xLocation: "47.5455",
    yLocation: "-122.0244",
    author: "King County Metro",
    rating: 4.1,
    creationDate: new Date(),
    description: "On-demand lockers available.",
    tags: ["secure", "convenient"],
    title: "Issaquah Highlands Park & Ride",
    image: "image"
  }
];
const parkings = [
  {
    address: "2795 El Camino Real, Palo Alto, CA 94306",
    xLocation: "37.4380",
    yLocation: "-122.1458",
    author: "City of Palo Alto",
    rating: 4.5,
    creationDate: new Date(),
    description: "Public parking, 2-hour limit.",
    tags: ["free", "public"],
    title: "El Camino Real Parking",
    image: "image"
  },
  {
    address: "520 Webster St, Palo Alto, CA 94301",
    xLocation: "37.4483",
    yLocation: "-122.1602",
    author: "City of Palo Alto",
    rating: 4.8,
    creationDate: new Date(),
    description: "Covered parking available. Close to shopping district.",
    tags: ["covered", "secure"],
    title: "Webster Street Garage",
    image: "image"
  },
  {
    address: "445 Bryant St, Palo Alto, CA 94301",
    xLocation: "37.4452",
    yLocation: "-122.1634",
    author: "City of Palo Alto",
    rating: 4.3,
    creationDate: new Date(),
    description: "Public parking near city center, 3-hour limit.",
    tags: ["public", "downtown"],
    title: "Bryant Street Lot",
    image: "image"
  },
  {
    address: "270 Grant Ave, Palo Alto, CA 94306",
    xLocation: "37.4263",
    yLocation: "-122.1453",
    author: "Stanford Shopping Center",
    rating: 4.7,
    creationDate: new Date(),
    description: "Extensive parking available, well-lit at night.",
    tags: ["spacious", "well-lit"],
    title: "Stanford Shopping Center Parking",
    image: "image"
  },
  {
    address: "801 California Ave, Palo Alto, CA 94304",
    xLocation: "37.4211",
    yLocation: "-122.1121",
    author: "California Ave Caltrain",
    rating: 4.2,
    creationDate: new Date(),
    description: "Public transit parking available, no overnight.",
    tags: ["transit", "no-overnight"],
    title: "California Ave Caltrain Lot",
    image: "image"
  }];
// insert parking entrys into the parkings.db
parkings.forEach(parking => {
  db.insert(parking, function (err, newDoc) {
    if (err) {
      console.log("Error inserting data: ", err);
    } else {
      console.log("Data inserted: ", newDoc);
    }
  });
});
*/


>>>>>>> main
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

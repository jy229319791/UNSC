// create node.js and express server that listens on port 3000
// and responds with a message "Hello World" when a request is made to the root URL
const express = require("express");
const app = express();
const port = 3000;

const { MongoClient } = require("mongodb");

// Connection URL
const url = "mongodb://localhost:" + port;
const client = new MongoClient(url);

// Database Name
const dbName = "bikeParking";

async function main() {
  // Use connect method to connect to the server
  await client.connect();
  console.log("Connected successfully to server");
  const db = client.db(dbName);
  const collection = db.collection("parkings");

  // TODO:

  return "done.";
}

main()
  .then(console.log)
  .catch(console.error)
  .finally(() => client.close());



  
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

app.get("/", (req, res) => {
  res.send("Try /getParkings or /setParking instead! ");
});

app.get("/getParkings", (req, res) => {
  res.send("TODO: get parkings from mongodb and return them as json");
});
app.post("/setParking", (req, res) => {
  res.send(
    "TODO: set parking in mongodb and return the id of the parking created"
  );
});

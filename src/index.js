const express = require("express");
const app = express();

const path = require("path");

const cors = require("cors");
const generatePair = require("./utils/create-rsa");
const ApiRouter = require("./routes");

generatePair(
  path.join(__dirname, "keys", "public"),
  path.join(__dirname, "keys", "private")
);

app.use(cors());
app.use(express.json({ limit: "250mb" }));
app.use(express.urlencoded({ limit: "250mb", extended: true }));

app.use(express.static(path.join(__dirname, "keys/public")));

ApiRouter(app);

app.listen(3000);

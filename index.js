const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

require('./src/database/config.js')

app.use(express.json());
app.use(cors());
dotenv.config();

const port = process.env.PORT;

app.listen(port);
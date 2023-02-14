const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const app = express();

const userRoutes = require("./src/routes/UserRoutes");
require('./src/database/config.js')

app.use(express.json());
app.use(cors());
dotenv.config();

const port = process.env.PORT;

app.use(userRoutes);

app.listen(port);
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

import routes from './src/routes/index.js'
import ('./src/database/config.js')

dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());
app.use(routes)

const port = process.env.PORT;

console.log("Server running on port " + port);
app.listen(port);
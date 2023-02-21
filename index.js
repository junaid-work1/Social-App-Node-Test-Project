import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'

import userRoutes from './src/routes/UserRoutes.js'
import postRoutes from './src/routes/PostRoutes.js'
import ('./src/database/config.js')

const app = express();

app.use(express.json());
app.use(cors());
dotenv.config();

const port = process.env.PORT;

app.use(userRoutes);
app.use(postRoutes);

app.listen(port);
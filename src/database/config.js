import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DATABASE_URL = process.env.DATABASE_URL;

mongoose.set("strictQuery", false);
mongoose.connect(DATABASE_URL, (err) => {
  if (!err) console.log("database connected");
  else console.log("database not connected");
});

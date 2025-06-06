import mongoose from "mongoose";
import { ENV_VARS } from "./envVars.js";

const dbconnect = async () => {
  try {
    mongoose.connection.on("connected", () => {
      console.log("Connection successful..");
    });
    mongoose.connection.on("error", (error) => {
      console.log(error.message);
    });
    mongoose.connection.on("disconnected", () => {
      console.log("disconnected!");
    });
    const connect = await mongoose.connect(
      `${ENV_VARS.MONGODB_URI}/punkrecords`
    );
    console.log("DB host......." + connect.connection.host);
  } catch (error) {
    console.log("DATABASE CONNECTION ERROR: " + error.message);
    process.exit(1); // this 1 means there's an error
  }
};

export default dbconnect;

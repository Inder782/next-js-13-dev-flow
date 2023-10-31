import mongoose from "mongoose";

let isConnected: boolean = false;
export const connectTodatabase = async () => {
  mongoose.set("strictQuery", true);

  if (!process.env.MONGODB_URL) {
    return console.log("MISSING MONGODB URL");
  }
  if (isConnected) {
    return console.log("Already connected");
  }
  try {
    await mongoose.connect(process.env.MONGODB_URL, {
      dbName: "devflow", // your db name
    });
    isConnected = true;
    console.log("Mongo connected");
  } catch (error) {
    console.log(error);
  }
};

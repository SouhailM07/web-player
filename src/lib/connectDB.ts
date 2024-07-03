import { connect } from "mongoose";

export default function connectMongoose() {
  connect(process.env.URI!)
    .then(() => {
      console.log("============================");
      console.log("DB is connected successfully");
      console.log("============================");
    })
    .catch((err) => console.log("Error: " + err));
}

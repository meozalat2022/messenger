import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import User from "./models/user.js";
import Message from "./models/message.js";
const app = express();
const port = 8000;
app.use(cors());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
mongoose
  .connect("mongodb+srv://zalatdodo:0123162554@cluster0.su5sxsr.mongodb.net/", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((err) => console.log("Something wrong occurred", err));
app.listen(port, () => {
  console.log("listening to port 8000");
});

// register new user endpoint

app.post("/register", (req, res) => {
  const { name, email, password, image } = req.body;

  // create new user

  const newUser = new User({ name, email, password, image });

  //save user

  newUser
    .save()
    .then(() => {
      res.status(200).json({ message: "Registered Successfully" });
    })
    .catch((err) => {
      console.log("Error occurred", err);
      res.status(500).json({ message: "Error registering" });
    });
});

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

//function to create a token for the user
const createToken = (userId) => {
  // Set the token payload
  const payload = {
    userId: userId,
  };

  // Generate the token with a secret key and expiration time
  const token = jwt.sign(payload, "Q$r2K6W8n!jCW%Zk", { expiresIn: "1h" });

  return token;
};

//endpoint for logging in of that particular user
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  //check if the email and password are provided
  if (!email || !password) {
    return res
      .status(404)
      .json({ message: "Email and the password are required" });
  }

  //check for that user in the database
  User.findOne({ email })
    .then((user) => {
      if (!user) {
        //user not found
        return res.status(404).json({ message: "User not found" });
      }

      //compare the provided passwords with the password in the database
      if (user.password !== password) {
        return res.status(404).json({ message: "Invalid Password!" });
      }

      const token = createToken(user._id);
      res.status(200).json({ token });
    })
    .catch((error) => {
      console.log("error in finding the user", error);
      res.status(500).json({ message: "Internal server Error!" });
    });
});

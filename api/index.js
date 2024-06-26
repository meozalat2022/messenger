import express from "express";
import mongoose from "mongoose";
import passport from "passport";
import cors from "cors";
import bodyParser from "body-parser";
import jwt from "jsonwebtoken";
import User from "./models/user.js";
import Message from "./models/message.js";
import multer from "multer";
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
  const token = jwt.sign(payload, "messengermessengermessenger", {
    expiresIn: "1h",
  });

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

//endpoint to retrieve all users except the logged in user

app.get("/users/:userId", (req, res) => {
  const loggedInUser = req.params.userId;

  User.find({ _id: { $ne: loggedInUser } })
    .then((users) => {
      res.status(200).json(users);
    })
    .catch((err) => {
      console.log("Users not found", err);
      res.status(500).json({ message: "Users not found" });
    });
});

//endpoint to add friend request

app.post("/fiend-request", async (req, res) => {
  const { currentUserId, selectedUserId } = req.body;

  try {
    // update selected user friend request array

    await User.findByIdAndUpdate(selectedUserId, {
      $push: { friendRequests: currentUserId },
    });

    // update current user sent friend request array

    await User.findByIdAndUpdate(currentUserId, {
      $push: { sentFriendRequests: selectedUserId },
    });

    res.sendStatus(200);
  } catch (error) {
    console.log("Error sending request", err);
    res.sendStatus(500);
  }
});

//endpoint to show all the friend-requests of a particular user
app.get("/friend-request/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    //fetch the user document based on the User id
    const user = await User.findById(userId)

      .populate("friendRequests", "name email image")
      .lean();

    const friendRequests = user.friendRequests;

    res.json(friendRequests);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//endpoint to accept a friend-request of a particular person
app.post("/friend-request/accept", async (req, res) => {
  try {
    const { senderId, recipientId } = req.body;

    //retrieve the documents of sender and the recipient
    const sender = await User.findById(senderId);
    const recipient = await User.findById(recipientId);

    sender.friends.push(recipientId);
    recipient.friends.push(senderId);

    recipient.friendRequests = recipient.friendRequests.filter(
      (request) => request.toString() !== senderId.toString()
    );

    sender.sentFriendRequests = sender.sentFriendRequests.filter(
      (request) => request.toString() !== recipientId.toString.toString()
    );

    await sender.save();
    await recipient.save();

    res.status(200).json({ message: "Friend Request accepted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

app.get("/accepted-friends/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate(
      "friends",
      "name email image"
    );
    const acceptedFriends = user.friends;
    res.json(acceptedFriends);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Configure multer for handling file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "files/"); // Specify the desired destination folder
  },
  filename: function (req, file, cb) {
    // Generate a unique filename for the uploaded file
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + "-" + file.originalname);
  },
});

const upload = multer({ storage: storage });

//endpoint to post messages and store it in the backend

app.post("/messages", upload.single("imageFile"), async (req, res) => {
  try {
    const { senderId, recipientId, messageType, message } = req.body;

    const newMessage = new Message({
      senderId,
      recipientId,
      messageType,
      message,
      timeStamp: new Date(),
      imageUrl: messageType === "image",
    });

    await newMessage.save();
    res.status(200).json({ message: "message sent successfully" });
  } catch (error) {
    res.status(500).json("internal error");
    console.log("Server error", error);
  }
});

//end point to catch the user details to design the chat bar header

app.get("/user/:userId", async (req, res) => {
  try {
    const { userId } = req.params;

    //fetch user data from the user Id

    const recipientId = await User.findById(userId);

    res.json(recipientId);
  } catch (error) {
    res.status(500).json("Error occurred");
    console.log(error);
  }
});

//end point fetch messages between two users
app.get("/messages/:senderId/:recipientId", async (req, res) => {
  try {
    const { senderId, recipientId } = req.params;

    const messages = await Message.find({
      $or: [
        { senderId: senderId, recipientId: recipientId },
        { senderId: recipientId, recipientId: senderId },
      ],
    }).populate("senderId", "_id name");

    res.json(messages);
  } catch (error) {
    res.status(500).json("error occurred");
    console.log(error);
  }
});

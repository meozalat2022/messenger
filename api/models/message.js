import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  recipientId: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
  },
  messageType: {
    type: String,
    enum: ["text", "image"],
  },
  message: String,
  imageUrl: String,
  timeStamp: {
    type: Date,
    default: Date.now(),
  },
});

const Message = mongoose.model("Message", messageSchema);

export default Message;

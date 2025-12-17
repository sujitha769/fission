import mongoose from "mongoose";

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true
    },

    description: {
      type: String,
      required: true
    },

    dateTime: {
      type: Date,
      required: true
    },

    location: {
      type: String,
      required: true
    },

    capacity: {
      type: Number,
      required: true
    },

    imageUrl: {
      type: String,
      required: false  
    },

     category: {
    type: String,
    enum: ['Technology', 'Business', 'Arts', 'Sports', 'Music', 'Education', 'Health', 'Food', 'Other'],
    default: 'Other'
  },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },

    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ]
  },
  { timestamps: true }
);

export default mongoose.model("Event", eventSchema);
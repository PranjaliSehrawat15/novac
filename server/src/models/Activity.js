const mongoose = require("mongoose")

const activitySchema = new mongoose.Schema({
    title:{
        type: String,
        required: [true, "Activity title is required"],
        trim: true,
    },

    type:{
        type: String,
        enum: ["call", "meeting", "email" , "followup"],
        required: true,
    }, 

    description: {
        type: String,
    },

    relatedTo: {
        type: String,
        enum: ["lead", "deal"],
    },

    relatedId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      refPath: "relatedToModel",
    },

    relatedToModel: {
      type: String,
      required: true,
      enum: ["Lead", "Deal"],
    },

    dueDate: {
      type: Date,
    },

    status: {
      type: String,
      enum: ["pending", "completed"],
      default: "pending",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Activity", activitySchema);
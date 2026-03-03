const mongoose = require("mongoose");

const stageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Stage name is required"],
      trim: true,
      unique: true,
    },

    order: {
      type: Number,
      required: true,
    },

    probability: {
      type: Number,
      min: 0,
      max: 100,
      default: 0,
    },

    isClosed: {
      type: Boolean,
      default: false,
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Stage", stageSchema);
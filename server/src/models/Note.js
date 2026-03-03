const mongoose = require("mongoose");

const noteSchema = new mongoose.Schema(
  {
    content: {
      type: String,
      required: [true, "Note content is required"],
      trim: true,
    },

    relatedTo: {
      type: String,
      enum: ["lead", "deal"],
      required: true,
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

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Note", noteSchema);
const mongoose = require("mongoose");

const dealSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Deal title is required"],
        trim: true,
    },

    value: {
        type: Number,
        required: [true, "Deal value is required"],
        min: 0,
    },

    stage: {
        type: String,
        enum: [
            "prospect",
            "qualification",
            "proposal",
            "negotiation",
            "won",
            "lost",
        ],
        default: "prospect",
    },

    status: {
        type: String,
        enum: ["open", "closed"],
        default: "open",
    },

    expectedClosedDate: {
        type: Date,
    },

    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deal", dealSchema);
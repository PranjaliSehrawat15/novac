const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
    },
    phone: {
        type: String,
    },
    company: {
        type: String,
    },
    status: {
        type: String,
        enum: ["new", "contacted", "qualified", "converted", "lost"],
        default: "new",
    },
    manager: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    assignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
    },
    notes: {
        type: String,
    },
},
{
    timestamps: true
});

module.exports = mongoose.model("Lead", leadSchema);
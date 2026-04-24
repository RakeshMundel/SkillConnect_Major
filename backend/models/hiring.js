const mongoose = require("mongoose");

const hiringSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    profileId: {
        type: String,
        required: true,
    },
    professionalName: {
        type: String,
        required: true,
    },
    hiredAt: {
        type: Date,
        default: Date.now,
    },
    amount: {
        type: Number,
        required: true,
    },
    scheduledDate: {
        type: String,
        required: true,
    },
    scheduledTime: {
        type: String,
        required: true,
    }
});

const Hiring = mongoose.model("Hiring", hiringSchema);
module.exports = Hiring;

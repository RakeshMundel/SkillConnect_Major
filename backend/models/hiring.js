const mongoose = require("mongoose");

const hiringSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: true,
    },
    userName: {
        type: String,
        default: "Client"
    },
    profileId: {
        type: String,
        required: true,
    },
    professionalName: {
        type: String,
        required: true,
    },
    professionalId: {
        type: String,
        required: true,
    },
    professionalPhone: {
        type: String,
        default: ""
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
    },
    status: {
        type: String,
        enum: ["deposit_paid", "fully_paid"],
        default: "deposit_paid"
    },
    completionImage: {
        type: String,
        default: ""
    },
    completedAt: {
        type: Date
    }
});

const Hiring = mongoose.model("Hiring", hiringSchema);
module.exports = Hiring;

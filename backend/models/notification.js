const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
    userId: {
        type: String, // Receiver
        required: true,
        index: true
    },
    senderId: {
        type: String, // Professional who completed work
    },
    title: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    link: {
        type: String, // URL to go to (e.g. /hired)
        default: "/hired"
    },
    read: {
        type: Boolean,
        default: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model("Notification", notificationSchema);

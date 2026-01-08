const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    content: { type: String, required: true }, 
    vote: {
        mbti: { type: String, required: false },
        enneagram: { type: String, required: false },
        zodiac: { type: String, required: false },
    },
    totalLikes: { type: Number, default: 0 },
}, { timestamps: true });

module.exports = mongoose.model('Post', postSchema);
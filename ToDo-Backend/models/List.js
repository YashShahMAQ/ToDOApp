const mongoose = require('mongoose');

//List Schema
const ListSchema = new mongoose.Schema(
    {
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true,
        },
        name: {
            type: String,
            required: true,
            trim: true,
        },
    },
    { 
        timestamps: true 
    }
);

module.exports = mongoose.model('List', ListSchema);

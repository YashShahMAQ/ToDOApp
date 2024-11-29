const mongoose = require('mongoose');

//Task Schema
//Defines the structure of the Task collection
const TaskSchema = new mongoose.Schema(
{
    listId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'List',
        required: true
    },

    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },

    description: {
        type: String,
        required: true,
        trim: true
    },

    isCompleted: {
        type: Boolean,
        default: false
    },
},
{
    timestamps: true
});

module.exports = mongoose.model('Task', TaskSchema);
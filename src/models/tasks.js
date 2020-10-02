const mongoose = require('mongoose');

const tasksSchema = new mongoose.Schema({
    description:{
        type: String,
        trim: true,
        required: true
    },
    completed : {
        type: Boolean,
        default: false
    },
    owner: {
        type: mongoose.Schema.ObjectId,
        required: true,
        ref: 'User'
    }
},{
    timestamps: true
})

const Tasks = mongoose.model('Tasks',tasksSchema)
module.exports = Tasks
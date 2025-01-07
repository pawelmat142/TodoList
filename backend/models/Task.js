const mongoose = require('mongoose')

const taskSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        ref: 'User',
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    important: {
        type: Boolean,
        required: true,
    },
    deadline: {
        type: String,
        required: false,
    },
    done: {
        type: Boolean,
        required: true,
    },
    subtasks: {
        type: String,
    }
})

const Task = mongoose.model('Task', taskSchema)

module.exports = Task

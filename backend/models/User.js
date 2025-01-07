const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    nickname: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
    },
    email: {
        type: String,
    }
})

const User = mongoose.model('User', userSchema)

module.exports = User

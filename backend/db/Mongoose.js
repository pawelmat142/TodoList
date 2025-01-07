require('dotenv').config({path: '.env'})
const mongoose = require('mongoose')
const url = process.env.MONGO_URI

mongoose.connect(url).then(() => {
    console.log('mongo connected')
})

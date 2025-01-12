require('dotenv').config({path: '.env'})
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const router = require('./router')
require('./db/Mongoose')

const app = express()

const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
}
app.use(cors(corsOptions))
app.options('*', cors(corsOptions))

app.use(express.static(path.join(__dirname, '/public')))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', router)

const port = process.env.PORT || 3333
app.listen(port, () => console.log('to-do list app listening on port: ' + port))
require('dotenv').config({path: '.env'})
const express = require('express')
const path = require('path')
const bodyParser = require('body-parser')
const cors = require('cors')
const router = require('./router')
require('./db/Mongoose')

const app = express()

const corsOptions = {
    origin: 'http://localhost:4200', // Zezwól na połączenia tylko z tej domeny
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Dozwolone metody HTTP
    allowedHeaders: ['Content-Type', 'Authorization'],  // Dozwolone nagłówki
};

// Globalna konfiguracja CORS
app.use(cors(corsOptions))
  
// Obsługuje zapytania OPTIONS (Preflight Request)
app.options('*', cors(corsOptions))

// app.use(cors())
app.use(express.static(path.join(__dirname, '/public')))
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use('/api', router)

const port = process.env.PORT || 3333
app.listen(port, () => console.log('to-do list app listening on port: ' + port))
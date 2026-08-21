import http from 'http';
import { app } from './app.js';
import { initializeSocket } from './socket/index.js';

import dotenv from 'dotenv'
dotenv.config({
    path: './.env'
})

import connectDB from './db/index.js'


const server = http.createServer(app)

initializeSocket(server)


connectDB()
    .then(() => {
        server.listen(process.env.PORT || 8000, () => {
            console.log(`Servering is Walking on http://localhost:${process.env.PORT}`)
        }) 
    })
    .catch((error) => {
        console.log("MongoDB Connection Fails!")
    })





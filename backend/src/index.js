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
        const PORT = process.env.PORT || 8000;

        server.listen(PORT, "0.0.0.0", () => {
            console.log(`Server is running on port ${PORT}`);
        });
    })
    .catch((error) => {
        console.log("MongoDB Connection Fails!")
    })





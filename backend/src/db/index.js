import mongoose from "mongoose";
import {DB_NAME} from '../constants.js'

const connectDB = async() => {
    try{
        const connectionResponse = await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`)
        console.log("Attempt to Connect Cluster Successfull...", connectionResponse.connection.host)
    }
    catch(error){
        console.log("There is some error While Connecting DB", error)
        process.exit(1)
    }
}
 
export default connectDB


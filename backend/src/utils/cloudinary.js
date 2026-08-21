import {v2 as cloudinary} from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});


const uploadOnCloudinary  = async(localFilePath) => {
    try{

        if(!localFilePath) return null;

        //upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localFilePath, {
            resource_type: "auto" //image, video, raw...
        })
        //file has been uploaded successfully...
        console.log("File is successfully on cloudinary... ", response.url)

        fs.unlinkSync(localFilePath) //removing file from local Storage as file successfully uploaded to Cloudinary 
        return response

    }catch(error){
        console.log("Cloudninary error", error)
        fs.unlinkSync(localFilePath) //remove the locally saved temporary file, 
        //as the operation gets failed
        return null
    }
}

const deleteFromCloudinary = async(publicId, resourceType = "image") => {
    try{
        if(!publicId) return null
        const response = await cloudinary.uploader.destroy(
            publicId, 
            {
                resource_type: resourceType
            }
        )
        return response

    }catch(error){
        console.log("Cloudinary Delete Error:", error);
        return null;
    }
}

export {uploadOnCloudinary, deleteFromCloudinary}
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

const CLOUDINARY_AVATAR_TRANSFORMATION = "w_240,h_240,c_fill,g_face,q_auto:good,f_auto";

const optimizeCloudinaryAvatar = (url, transformations = CLOUDINARY_AVATAR_TRANSFORMATION) => {
    if (!url || typeof url !== "string") return url;

    const uploadMarker = "/image/upload/";
    const uploadIndex = url.indexOf(uploadMarker);
    if (uploadIndex === -1) {
        return url;
    }

    let normalizedUrl = url;
    if (normalizedUrl.startsWith("http://res.cloudinary.com/")) {
        normalizedUrl = "https://" + normalizedUrl.slice("http://".length);
    }

    const markerIndex = normalizedUrl.indexOf(uploadMarker);
    const prefix = normalizedUrl.slice(0, markerIndex + uploadMarker.length);
    const suffix = normalizedUrl.slice(markerIndex + uploadMarker.length);

    if (suffix.startsWith(`${transformations}/`)) {
        return normalizedUrl;
    }

    const segments = suffix.split("/");
    let restIndex = 0;
    while (
        restIndex < segments.length &&
        !/^v\d+$/.test(segments[restIndex]) &&
        /([a-z]{1,3}_)/.test(segments[restIndex])
    ) {
        restIndex++;
    }

    const cleanSuffix = segments.slice(restIndex).join("/");
    return `${prefix}${transformations}/${cleanSuffix}`;
};

export {
    uploadOnCloudinary,
    deleteFromCloudinary,
    optimizeCloudinaryAvatar,
    CLOUDINARY_AVATAR_TRANSFORMATION
}
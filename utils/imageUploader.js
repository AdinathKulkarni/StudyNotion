const cloudinary = require('cloudinary').v2;

exports.uploadToCloudinary = async(file, folder, quality) => {
    try{
        const options = {folder};

        if(quality){
            options.quality = quality;
        }

        options.resourse_type = "auto";
        return await cloudinary.uploader.upload(file.tempFilePath, options)

    }catch(error){
        return res.status(500).json({
            success: false,
            message: "Error while uploading image",
        })
    }
}
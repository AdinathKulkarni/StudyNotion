const Tag = require('../models/tag');

exports.createTag = async(req, res) => {
    try{    

        const {name, description} = req.body;

        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "Please fill all the details",
            });
        }

        const tagDetails = await Tag.create({
            name: name,
            description: description,
        });

        return res.status(201).json({
            success: true,
            message: `${tag.name} created successfully`
        });

    }catch(error){
        console.log("unable to create tag", error);
        return res.status(500).json({
            success: false,
            message: "Error while creating the tag",
        });
    }
}

exports.getAllTags = async(req, res) => {
    try{
        const allTags = await Tag.find({}, {name: true}, {description: true});
        res.status(200).json({
            success: true,
            message: "Fetched all the tags successfully",
            data: allTags,
        }) 
    } catch(error){
        console.log("unable to get all tags", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching all the tags",
        });
    }
}
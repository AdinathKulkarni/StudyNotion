const Category = require('../models/category');

exports.createCategory = async(req, res) => {
    try{    

        const {name, description} = req.body;

        if(!name || !description){
            return res.status(400).json({
                success: false,
                message: "Please fill all the details",
            });
        }

        const categoryDetails = await Category.create({
            name: name,
            description: description,
        });

        return res.status(201).json({
            success: true,
            message: `${Category.name} created successfully`,
            categoryDetails,
        });

    }catch(error){
        console.log("unable to create category", error);
        return res.status(500).json({
            success: false,
            message: "Error while creating the category",
        });
    }
}

exports.getAllCategories = async(req, res) => {
    try{
        const allCategories = await Category.find({}, {name: true}, {description: true});
        res.status(200).json({
            success: true,
            message: "Fetched all the categories successfully",
            data: allCategories,
        }) 
    } catch(error){
        console.log("unable to get all categories", error);
        return res.status(500).json({
            success: false,
            message: "Error while fetching all the categories",
        });
    }
}

exports.categoryPageDetails = async(req, res) => {
    try{

        //get category id 
        const {categoryId} = req.body;

        //get courses for specified id
        const selectedCategory = await Category.findById(categoryId)
                                .populate("course")
                                .exec();

        //validation
        if(!selectedCategory){
            return res.status(404).json({
                success: false,
                message: "No Data found"
            });
        }

        //get courses different categories
        const differentCategories = await Category.find({
            _id: {$ne: categoryId}, // ne = not equal
        })
        .populate("course")
        .exec();

        //get top selling courses

        //return response
        return res.status(200).json({
            success: true,
            data: {
                selectedCategory,
                differentCategories,
            }
        })

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: "Error while fetching all the courses",
        })
    }
}
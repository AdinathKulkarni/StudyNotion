const Section = require('../models/section');
const Course = require('../models/course');

exports.createSection = async(req, res) => {
    try{
        //data fetch
        const {sectionName, courseId} = req.body;

        //validation
        if(!sectionName || !courseId){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        //create section
        const newSection = await Section.create({sectionName});

        //push inside course - update in course schema
        const updatedCourseDetails = await Course.findByIdAndUpdate(
            courseId,
            {
                $push: {
                    courseContent: newSection._id,
                }
            },
            {new: true},
        );

        //return response
        return res.status(201).json({
            success: true,
            message: "Section created successfully",
            data: updatedCourseDetails,
        });

    } catch(error) {
        return res.status(500).json({
            success: false,
            message: "Error while creating section",
            error: error.message,
        })
    }
} 

exports.updateSection = async(req, res) => {
    try{

        //fetch data
        const {sectionName, sectionId} = req.body;

        //validate data
        if(!sectionName || !sectionId){
            return res.status(400).json({
                success: false,
                message: "All fields are required",
            });
        }

        //update data
        const updatedSectionDetails = await Section.findByIdAndUpdate(sectionId,
            {sectionName}, {new: true}
        );

        //return response
        return res.status(200).json({
            success: true,
            message: "Section updated successfully",
            error: error.message,
        })

    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Error while updating the section",
            error: error.message,
        })
    }
}

exports.deleteSection = async(req, res) => {
    try{

        //data fetch
        const {sectionId} = req.body;

        //validate data
        if(!sectionId){
            return res.status(404).json({
                success: false,
                message: "Couldn't find section, please provide valid Id",
                error: error.message,
            })
        }

        //delete section
        const updatedSection = await Section.findByIdAndDelete(sectionId);
        
        //return response
        return res.status(200).json({
            success: true,
            message: "Section deleted successfully",
        });
    } catch(error){
        return res.status(500).json({
            success: false,
            message: "Error while deleting the section",
            error: error.message,
        })
    }
}
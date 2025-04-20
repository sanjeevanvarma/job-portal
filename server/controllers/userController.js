import { messageInRaw } from "svix"
import Job from "../models/Job.js"
import User from "../models/User.js" 
import JobApplication from "../models/JobApplication.js"
//import cloudinary from "../config/cloudinary.js";
import {v2 as cloudinary} from "cloudinary"
//import connectCloudinary as cloudinary from "../config/cloudinary.js";
/////////////////      Get user data       //////////////

export const getUserData = async (req, res) =>{

    const userId = req.auth.userId
    
    try {
        //const user = await User.findById({userId})
        const user = await User.findById(userId)


        if(!user)
        {
            res.json({success: false, message: 'User not found'})
        }
        res.json({success: true, user})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

/////////////////     Apply for a job      /////////////

export const applyForJob = async (req, res) =>{

    const  { jobId } = req.body

    const userId = req.auth.userId

    try {
        const isAlreadyApplied = await JobApplication.find({jobId, userId})

        if(isAlreadyApplied.length > 0){
             return res.json({success: false, message: 'Already Applied'})
        }
        
        const jobData = await Job.findById(jobId)

        if(!jobData){
            res.json({success: false, message: 'Job not found'})
        }

        await JobApplication.create({
            companyId:  jobData.companyId,
            userId,
            jobId,
            date: Date.now()
        })

        res.json({success: true, message: 'Applied Successfully'})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
    
}

/////////////////     Get user Applied Job Applications    //////////////

export const getUserJobApplications = async (req, res) =>{

    try {
        const userId = req.auth.userId

        const applications = await JobApplication.find({userId})
        .populate('companyId', 'name email image')
        .populate('jobId', 'title description location category level salary')
        .exec()

        if(!applications)
        {
            return res.json({success: false, message:'No Job Applications Found'})
        }

        return res.json({success: true, applications})

    } catch (error) {
        res.json({success: false, message: error.message})
    }
    
}

////////////////       Update User Profile        /////////////////

export const updateUserResume = async (req, res) =>{

    try {
        const userId = req.auth.userId

        const resumeFile = req.file

        console.log("resumeFile: ",resumeFile)

        const userData = await User.findById(userId)
        if(resumeFile){ // && resumeFile.path
        //if(resumeFile){
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)

            userData.resume = resumeUpload.secure_url
        }

        await userData.save()

        res.json({success: true, message: 'Resume Updated'})
    } catch (error) {

        res.json({success: false, message: error.message })
        
    }
    
}
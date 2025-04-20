import Company from "../models/company.js"
import bcrypt from 'bcrypt'
import { v2 as cloudinary } from 'cloudinary'
import generateToken from "../utils/generateToken.js"
import { messageInRaw } from "svix"
import Job from "../models/Job.js"
import JobApplication from "../models/JobApplication.js"

//////////////////////////      Register a new company         /////////////////////////////////
export const registerCompany = async(req, res) =>{

    console.log("Received body:", req.body);
    console.log("Received file:", req.file);

    const {name, email, password} = req.body

    const imageFile = req.file 

    // if(!name || !password || !email || !imageFile){
    //     return res.json({success: false, message: "Missing Details check once"})
    // }

    if (!name) return res.json({ success: false, message: "Name is required" });
    if (!email) return res.json({ success: false, message: "Email is required" });
    if (!password) return res.json({ success: false, message: "Password is required" });
    if (!imageFile) return res.json({ success: false, message: "Image file is required" });


    try {
        const companyExists = await Company.findOne({email})

        if(companyExists)
        {
            return res.json({success: false, message: "company already registered"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password, salt)

        const imageUpload = await cloudinary.uploader.upload(imageFile.path)

        const company = await Company.create({
            name,
            email,
            password: hashPassword,
            image: imageUpload.secure_url
        })

        res.json({
            success: true,
            company: {
                _id: company._id,
                name: company.name,
                email: company.email,
                image: company.image

            },
            token: generateToken(company._id)
        })

    } catch (error) {
        res.json({success:false, message:error.message})
    }

}

///////////////////////       Company Login     /////////////////////////

export const loginCompany = async(req, res) =>{
  
    const { email, password } = req.body
    try {
        const company = await Company.findOne({email})

        // if (!company) {
        //     return res.json({ success: false, message: "Invalid email or password" });
        // }

        //const isMatch = await bcrypt.compare(password, company.password);

        if(await bcrypt.compare(password, company.password))
        {
            res.json({
                success:true,
                company: {
                    _id: company._id,
                    name: company.name,
                    email: company.email,
                    image: company.image
                },
                token: generateToken(company._id)
            })
        }
        else{
            res.json({success:false,message:"Invalid email or password"})
        }
    } catch (error) {
        res.json({success:false, message:error.message})
    }

}

///////////////////////       Get Company Data     /////////////////////////

export const getCompanyData = async(req, res) =>{

    try {
        const company = req.company
        res.json({success: true, company})
    } catch (error) {
        res.json({success: false, message: error.message})
    }
}

///////////////////////       Post a New Job     /////////////////////////

//Client sends POST /api/company/post-job with a token of company and job data.
//protectCompany middleware verifies token, attaches company to request.
export const postJob = async(req, res) =>{

    const {title, description, location, salary, level, category} = req.body

     const companyId = req.company._id

     console.log(companyId, {title, description, location, salary, level, category})
     
    try {
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            companyId,
            date: Date.now(),
            level,
            category
        })

        await newJob.save()
        res.json({success: true, newJob, message: "Job posted successfully"});
    } catch (error) {
        console.error(error); 
        res.json({
        success: false,
        message: "Something went wrong while posting the job.",
        error: error.message,
    });
    }

}

///////////////////////       Get Company JobApplicants     /////////////////////////

export const getCompanyJobApplications = async(req, res) =>{

    try {
        const companyId = req.company._id

        const applications = await JobApplication.find({companyId})
        .populate('userId','name image resume')
        .populate('jobId', 'title location category level salary')
        .exec()

        return res.json({success: true, applications})
    } catch (error) {
        res.json({success: false, message: error.message})
    }

}

///////////////////////       Get Company Posted Jobs     /////////////////////////

export const getCompanyPostedJobs = async(req, res) =>{

    // try {
    //     const companyId = req.company.id
    //     const jobs = await Job.find({companyId})

    //     //(To Do) Adding Number of Applicants in data

    //     res.json({success: true, jobsData: jobs})

    // } catch (error) {
    //     res.json({success: false, message: error.message})
    // }

    try {
        const companyId = req.company._id
        console.log("Getting jobs for company:", companyId);

        const jobs = await Job.find({companyId})
        console.log("Found jobs:", jobs.length);

        //(To Do) Adding Number of Applicants in data
        const jobsData = await Promise.all(jobs.map(async (job)=>{
            const applicants = await JobApplication.find({jobId: job._id});
            return {...job.toObject(),applicants:applicants.length}
        } ))

        res.json({success: true, jobsData})

    } catch (error) {
        console.error("Error fetching posted jobs:", error.message);
        res.json({success: false, message: error.message})
    }

}

///////////////////////       Change Job Applications Status     /////////////////////////

export const changeJobApplicationsStatus = async(req, res) =>{

    try {
        
        const {id, status} = req.body

        await JobApplication.findByIdAndUpdate({_id: id}, {status})

        res.json({ success: true, message: 'Status Changed'})

    } catch (error) {
        res.json({ success: false, message: error.message })
    }

}

///////////////////////      Change Job Visibility     /////////////////////////     
export const changeVisibility = async(req, res) =>{

    try {
        const {id} = req.body
        console.log("Received request to change visibility for job ID:", id);

        const companyId = req.company._id
        console.log("Company making request:", companyId);

        const job = await Job.findById(id)
        console.log("Job found:", job);

        if(companyId.toString() === job.companyId.toString())
        {
            job.visible = !job.visible
            await job.save()
            console.log("Job visibility changed to:", job.visible);
        }
        else {
            console.log("Unauthorized attempt to change visibility");
        }

        res.json({success: true, job})
        
    } catch (error) {
        console.error("Error changing job visibility:", error.message);
        res.json({success: false, message: error.message})
    }

    // try {
    //     const {id} = req.body

    //     const companyId = req.company._id

    //     const job = Job.findById(id)

    //     if(companyId.toString() === job.companyId.toString())
    //     {
    //         job.visible = !job.visible
    //     }

    //     res.json({success: true, job})

    // } catch (error) {
    //     res.json({success: false, message: error.message})
    // }
}
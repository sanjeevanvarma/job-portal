import express from 'express'
import { changeJobApplicationsStatus, changeVisibility, getCompanyData, getCompanyJobApplications, getCompanyPostedJobs, loginCompany, postJob, registerCompany } from '../controllers/companyControllers.js'
import upload from '../config/multer.js'
import { protectCompany } from '../middleware/authMiddleware.js'

const router = express.Router()
//Register a company
router.post('/register',upload.single('image'), registerCompany)
//Client ⟶ (Form with file) ⟶ Multer (req.file) ⟶ Temp server file ⟶ Cloudinary upload ⟶ Get secure_url ⟶ Save to DB ⟶ Return success

//Company Login
router.post('/login',loginCompany)

//Get Company data
router.get('/company', protectCompany, getCompanyData)

//Post a job
router.post('/post-job', protectCompany ,postJob)


//Get Applicants data of a company
router.get('/applicants', protectCompany,getCompanyJobApplications)

//
router.get('/list-jobs', protectCompany,getCompanyPostedJobs)

router.post('/change-status', protectCompany,changeJobApplicationsStatus)

router.post('/change-visibility', protectCompany,changeVisibility)

export default router
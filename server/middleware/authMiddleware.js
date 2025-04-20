import jwt from 'jsonwebtoken'
import Company from '../models/company.js'

export const protectCompany = async(req, res, next) =>
{
    //company token
    const token = req.headers.token

    console.log("Received token:", token);

    if(!token)
    {
        return res.json({success: false, message: "Not Authorized Login Again"})
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET)

        req.company = await Company.findById(decoded.id).select('-password')

        // if (!req.company) {
        //     return res.status(401).json({ success: false, message: "Company not found." });
        //}

        next()
    } catch (error) {
        res.json({success:false, message:'Not authorized, Login Again'})
        console.error(error); // Logs full error in terminal
    //     res.json({
    //     success: false,
    //     message: "error in middleware",
    //     error: error.message  // Include the actual error message too
    // });
    }
}


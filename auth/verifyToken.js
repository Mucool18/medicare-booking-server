import jwt from "jsonwebtoken";
import Doctor from "../models/DoctorSchema.js";
import User from "../models/UserSchema.js";

export const authenticate = (req, res, next) => {
    // get token 
    const authToken = req.headers.authorization;
    console.log("auth token ", authToken)
    if(!authToken || !authToken.startsWith("Bearer ")) {
        return res.status(401).json({success: false, message: "You are not authorized "})
    }
    try {
        const token = authToken.split("Bearer ")[1];
        const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
        req.userId = decodedToken.id;
        req.role = decodedToken.role;
        next();
    } catch (error) {
        if(error.name === "TokenExpiredError"){
            return res.status(401).json({success: false, message: 'Token expired'})
        }
        return res.status(401).json({success: false, message: "You are not authorised "})
    }
}

export const restrict = roles => async (req,res,next)=>{
    const userId = req.userId;
    let user;
    try {
        console.log("userid => ", userId)
        const patient = await User.findById(userId);
        const doctor = await Doctor.findById(userId);
        
        if(patient){
            user = patient
        }
        if(doctor){
            user = doctor;
        }
        if(!roles.includes(user.role)){
           return res.status(401).json({success: false, message: "Yor are not authorised"})
        }
        next();
    } catch (error) {
        console.log("errroo ", error);
        return res.status(401).json({success: false, message: "Yor are not authorised"})
    }
}
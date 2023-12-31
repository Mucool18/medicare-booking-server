import UserSchema from "../models/UserSchema.js";
import DoctorSchema from "../models/DoctorSchema.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateTokken = (user) => {
    return jwt.sign({id: user._id, role:user.role}, process.env.JWT_SECRET_KEY,{expiresIn: "15d"});
}

export const register = async (req,res)=>{
    try {
        const {email, password, name, role, photo, gender} = req.body;
        let user = null;
        if(role === "patient"){
            user = await UserSchema.findOne({email});
        } else if (role === 'doctor'){
            user = await DoctorSchema.findOne({email});
        }

        if(user){
           return res.status(400).json({message:"User already exits", success: false});
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        if(role === "patient" || role === "admin"){
            user = new UserSchema({
                name,
                email,
                password: hashedPassword,
                photo,
                gender,
                role,
            })
            
        }
        if(role === "doctor"){
            user = new DoctorSchema({
                name,
                email,
                password: hashedPassword,
                photo,
                gender,
                role,
            })
        }

        await user.save();
        return res.status(200).json({success: true, message: "User successfully created"});

    } catch (error) {
        return res.status(500).json({success: false, message: "Internal server error , try again"});
    }
}

export const login = async (req,res)=>{
    
    try {
        const {email, password} = req.body;
        let user = null;
        const doctor = await DoctorSchema.findOne({email});
        if(doctor){
            user = doctor
        } else {
            const patient = await UserSchema.findOne({email});
            if(patient){
                user = patient
            } else {
                res.status(400).json({message: "User not found", success:false});
            }
        }
        console.log("user -> ", user.password, password)
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        console.log(" ispassword => ", isPasswordMatch)
        if(!isPasswordMatch){
            res.status(400).json({message: "Invalid credentials", success: false});
        }else{
             // auth token 
            const token = generateTokken(user);
            const {password, role, appointments, ...resp} = user._doc
            return res.status(200).json({success:true, message: "Successfull login", token , data: {...resp}, role })
        }
       
    } catch (error) {
        console.log("error=> ", error)
        res.status(500).json({message: "Failed to login", success: false})
    }
}
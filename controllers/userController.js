import User from "../models/UserSchema.js";
import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js"

export const updateUser = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedUser = await User.findByIdAndUpdate(id, {$set:req.body}, {new: true}).select("-password");
        res.status(200).json({message: 'Updated successfully', success: true, data: updatedUser});
    } catch (error) {
        res.status(500).json({message: 'Update Failed', success: false})
    }
}

export const deleteUser = async (req, res) => {
    const id = req.params.id;
    try {
        await User.findByIdAndDelete(id);
        res.status(200).json({message: 'Deleted successfully', success: true});
    } catch (error) {
        res.status(500).json({message: 'Deletion Failed', success: false})
    }
}

export const findSingleUser = async (req, res) => {
    const id = req.params.id;
    try {
        const user = await User.findById(id).select("-password");
        res.status(200).json({message: 'User found successfully', success: true, data: user});
    } catch (error) {
        res.status(500).json({message: 'Failed to find user', success: false})
    }
}

export const findAllUser = async (req, res) => {
    try {
        const user = await User.find({}).select("-password");
        return res.status(200).json({message: 'Users found successfully', success: true, data: user});
    } catch (error) {
        return res.status(500).json({message: 'Not found', success: false})
    }
}

export const getUserProfile = async (req, res) => {
    try {
        const userId = req.userId;
        const user = await User.findById(userId);
        if(!user){
            return res.status(404).json({message: 'No user found', success: false})
        }
        const {password, ...rest} = user._doc;
        return res.status(200).json({message: 'Users found successfully', success: true, data: {...rest}});
    } catch (err) {
        return res.status(500).json({message: 'Something went wrong, cannot get', success: false});
    }
}

export const getMyAppointments = async (req, res) => {
    try {
        const bookings = await Booking.find({user: req.userId});
        console.log("data -> ", bookings)
        if(!bookings || bookings.length == 0){
            return res.status(200).json({message: 'No bookings found', success: false, data: bookings});
        }
        const doctorIds = bookings.map((el)=> el.doctor.id);
        const doctors = await Doctor.find({_id: {$in : doctorIds}}).select("-password");
        res.status(200).json({success: true, message: "Appointment fetched successfully", data: doctors});
    } catch (error) {
        console.log("error =>> ", error)
        return res.status(500).json({message: 'Something went wrong, cannot get', success: false});
    }
}
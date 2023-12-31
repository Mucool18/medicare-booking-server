import Booking from "../models/BookingSchema.js";
import Doctor from "../models/DoctorSchema.js";

export const updateDoctor = async (req, res) => {
    const id = req.params.id;
    try {
        const updatedUser = await Doctor.findByIdAndUpdate(id, {$set:req.body}, {new: true}).select("-password");
        res.status(200).json({message: 'Updated successfully', success: true, data: updatedUser});
    } catch (error) {
        res.status(500).json({message: 'Update Failed', success: false})
    }
}

export const deleteDoctor = async (req, res) => {
    const id = req.params.id;
    try {
        await Doctor.findByIdAndDelete(id);
        res.status(200).json({message: 'Deleted successfully', success: true});
    } catch (error) {
        res.status(500).json({message: 'Deletion Failed', success: false})
    }
}

export const findSingleDoctor = async (req, res) => {
    const id = req.params.id;
    try {
        const doctor = await Doctor.findById(id).populate('reviews').select("-password");
        res.status(200).json({message: 'Doctor found successfully', success: true, data: doctor});
    } catch (error) {
        console.log("error -> ", error);
        res.status(500).json({message: 'Failed to find user', success: false})
    }
}

export const findAllDoctors = async (req, res) => {
    try {
        const {query} = req.query;
        let doctors;
        if(query){
            doctors = await Doctor.find({isApproved: "approved", $or: [
                {name: {$regex: query, $options: "i"}},
                {specialization: {$regex: query, $options: "i"}}
            ]}).select("-password");
        }else{
            doctors = await Doctor.find({}).select("-password");
        }
        
        res.status(200).json({message: 'Users found successfully', success: true, data: doctors});
    } catch (error) {
        res.status(500).json({message: 'Not found', success: false})
    }
}

export const getDoctorProfile = async (req, res) => {
    try {
        const doctorId = req.doctorId;
        const doctor = await Doctor.findById(doctorId);
        if(!doctor){
            return res.status(404).json({message: 'No user found', success: false})
        }
        const appointments = await Booking.find({doctor: doctorId});
        const {password, ...rest} = doctor._doc;
        return res.status(200).json({message: 'Appointments found successfully', success: true, data: {...rest, appointments}});
    } catch (err) {
        return res.status(500).json({message: 'Something went wrong, cannot get', success: false});
    }
}
import express from "express";
import { restrict, authenticate } from "../auth/verifyToken.js";
import { updateDoctor, deleteDoctor, findAllDoctors, findSingleDoctor, getDoctorProfile } from "../controllers/doctorController.js";
import reviewRoute from "./review.js";

const router = express.Router();

router.use("/:doctorId/reviews", reviewRoute)
router.get("/:id",authenticate, restrict(['doctor', 'admin']), findSingleDoctor);
router.get("/", authenticate, restrict(['admin']),findAllDoctors);
router.put("/:id", authenticate, restrict(['doctor', 'admin']), updateDoctor);
router.delete("/:id", authenticate, restrict(['doctor', 'admin']), deleteDoctor);
router.get("/profile/me",authenticate, restrict(['doctor', 'admin']), getDoctorProfile);

export default router;
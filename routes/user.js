import express from "express";
import { updateUser, deleteUser, findSingleUser, findAllUser, getUserProfile, getMyAppointments } from "../controllers/userController.js";
import { authenticate, restrict } from "../auth/verifyToken.js";

const router = express.Router();

router.get("/:id", authenticate, restrict(['patient', 'admin']), findSingleUser);
router.get("/", authenticate, findAllUser);
router.put("/:id", authenticate, restrict(['patient', 'admin']), updateUser);
router.delete("/:id", authenticate, restrict(['patient', 'admin']), deleteUser);
router.get("/profile/me", authenticate, restrict(['patient', 'admin']), getUserProfile);
router.get("/appointments/my-appointments", authenticate, restrict(['patient', 'admin']), getMyAppointments);

export default router;
import express from "express";
import { login, register ,adminLogin } from "../controllers/userControllers.js";

const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", (req, res) => {
  res.json({ message: "Logged out " });
});
router.post("/admin/login", adminLogin); 



export default router;
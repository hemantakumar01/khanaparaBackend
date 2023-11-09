import { Router } from "express";
const router = Router();

/** import all controllers */
import * as controller from "../controllers/appControllers.js";
import {
  authenticateToken,
  localVariable,
} from "../middleware/AuthMiddleware.js";
import { registerMail } from "../controllers/mailer.js";

/** POST Methods */
router.route("/register").post(controller.register); // register user
router.route("/registerMail").post(registerMail); // send the email
router.route("/authenticate").post(authenticateToken, (req, res) => res.end()); // authenticate user
router.route("/login").post(controller.login); // login in app

/** GET Methods */
router.route("/user/:username").get(controller.getUser); // user with username
router
  .route("/generateOTP")
  .get(authenticateToken, localVariable, controller.generateOTP); // generate random OTP
router.route("/verifyOTP").get(authenticateToken, controller.verifyOTP); // verify generated OTP
router.route("/createResetSession").get(controller.createResetSession); // reset all the variables

/** PUT Methods */
router.route("/updateuser").put(authenticateToken, controller.updateUser); // is use to update the user profile
router.route("/resetPassword").put(controller.resetPassword); // use to reset password

export default router;

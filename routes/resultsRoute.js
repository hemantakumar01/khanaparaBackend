import express from "express";
import {
  getResults,
  getSingleResults,
  postResults,
  sendMail,
  updateHit,
} from "../controllers/resultsController.js";
import resultsData from "../module/myModleSchema.js";

const router = express.Router();
router.get("/results", getResults);
router.post("/results", postResults);
// to get single result
router.post("/results/single", getSingleResults);

router.put("/updateHit/:documentId/:data1Index/:resultsIndex", updateHit);

// Send Email
router.post("/sendMail", sendMail);
export default router;

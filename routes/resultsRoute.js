import express from "express";
import {
  getResults,
  getSingleResults,
  postResults,
  sendMail,
  updateHit,
  pushData,
  pushArray,
  getMainData,
  updatePlay,
} from "../controllers/resultsController.js";
import resultsData from "../module/myModleSchema.js";

const router = express.Router();
// Get Main data
router.get("/getMainData", getMainData);
// post data
router.route("/pushData").post(pushData).put(pushArray);
// ===============================================
router.get("/results", getResults);
router.post("/results", postResults);
// to get single result
router.post("/results/single", getSingleResults);

router.put("/updateHit/:documentId/:data1Index/:resultsIndex", updateHit);

// Send Email
router.post("/sendMail", sendMail);
//Update Play
router.post("/updatePlay", updatePlay);

router.post("/updatePlayToTrue/:id", async (req, res) => {
  const documentId = req.params.id;

  try {
    const result = await resultsData.updateOne(
      { _id: documentId },
      {
        $set: {
          "firstRound.data1.$[].results.$[].play": req.body.round1,
        },
      }
    );
    res.status(200).send({
      success: true,
      message: "Successfull",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
router.post("/updatePlayToTrue2/:id", async (req, res) => {
  const documentId = req.params.id;

  try {
    const result = await resultsData.updateOne(
      { _id: documentId },
      {
        $set: {
          "firstRound.data2.$[].results.$[].play": req.body.round2,
        },
      }
    );
    res.status(200).send({
      success: true,
      message: "Successfull",
    });
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal Server Error");
  }
});
export default router;

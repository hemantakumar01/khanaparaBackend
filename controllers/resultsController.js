import resultsData from "../module/myModleSchema.js";
import nodemailer from "nodemailer";

export const getResults = async (req, res) => {
  try {
    const data = await resultsData.find({});
    if (!data) {
      return res.status(200).send({
        success: false,
        message: "No Data Found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getUser",
    });
  }
};

// To post all results
export const postResults = async (req, res) => {
  try {
    const firstRound = {
      data1: [
        {
          results: req.body.number.map((item, i) => {
            let dataArray = item.data;
            let newArray = { number: dataArray, hit: false };
            return newArray;
          }),
        },
      ],
      data2: [
        {
          results: req.body.number2.map((item, i) => {
            let dataArray = item.data;
            let newArray = { number: dataArray, hit: false };
            return newArray;
          }),
        },
      ],
    };
    console.log(firstRound);
    const data = await resultsData.create({ firstRound: firstRound });
    res.status(200).send({
      success: true,
      message: "Success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getUser",
    });
  }
};

export const getSingleResults = async (req, res) => {
  try {
    console.log(req.body.id);
    const data = await resultsData.findById({ _id: req.body.id });
    if (!data) {
      return res.status(200).send({
        success: false,
        message: "No Data Found",
      });
    }
    res.status(200).send({
      success: true,
      message: "Success",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getUser",
    });
  }
};

// Set hit
export const updateHit = async (req, res) => {
  const documentId = req.params.documentId;
  const data1Index = req.params.data1Index;
  const resultsIndex = req.params.resultsIndex;
  const newHitValue = req.body.hit; // Assuming the new "hit" value is sent in the request body
  console.log(
    `This is data1Index ${data1Index} and this is resultsIndex ${resultsIndex} and this is newHitValue ${newHitValue} and this is documentId ${documentId}`
  );
  try {
    // Find the document by its ID
    const document = await resultsData.findById({ _id: documentId });

    // Ensure the document and its structure exists
    if (
      !document ||
      !document.firstRound ||
      !document.firstRound.data1[data1Index] ||
      !document.firstRound.data1[data1Index].results[resultsIndex]
    ) {
      return res.status(404).json({ error: "Document or index not found" });
    }

    // Update the "hit" field
    document.firstRound.data1[data1Index].results[resultsIndex].hit =
      newHitValue;

    // Save the updated document
    await document.save();

    res.json({ message: "Hit field updated successfully" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ error: "An error occurred while updating the hit field" });
  }
};

// SendMail

export const sendMail = async (req, res) => {
  try {
    // Create a Nodemailer transporter with your Gmail account
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: "officialhemantpaswan1@gmail.com",
        pass: "", // Use the app password you generated
      },
      auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.PASSWORD}`, // Use the app password you generated
      },
    });

    // Define the email data
    const mailOptions = {
      from: "officialhemantpaswan1@gmail.com",
      to: "hemantakumarpaswan@gmail.com",
      subject: "Subject of the Email - final",
      text: "This is the text of the email.",
    };

    // Send the email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log("Error sending email: " + error);
      } else {
        console.log("Email sent: " + info.response);
      }
    });
    res.status(200).send({
      success: true,
      message: "Email send",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getUser",
    });
  }
};

import resultsData from "../module/myModleSchema.js";
import nodemailer from "nodemailer";
import DataSchema from "../module/pushDataSchema.js";
import axios from "axios";
import colors from "colors";

// Get Results

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Push Data >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const pushMainData = async (req, res) => {
  try {
    if (!req.body.data) {
      return res.status(200).send({
        message: "Please Enter Data",
        success: false,
      });
    }
    const data = await DataSchema.create({ data: req.body.data });
    res.status(200).send({
      success: true,
      message: "This is pushData",
      data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "error in pushData" });
  }
};
export const getMainData = async (req, res) => {
  try {
    const data = await DataSchema.findById({ _id: "654c3b71638d584b9c644a2f" });
    res.status(200).send({
      success: true,
      message: "GetData",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getMainData",
    });
  }
};
// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Push into array Data >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const pushArray = async (req, res) => {
  try {
    let id = "654c3b71638d584b9c644a2f";
    const data = await DataSchema.findById({ _id: id });
    data.data.push(req.body.data);
    data.save();
    res.status(200).send({
      success: true,
      message: "This is pushArray",
      data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "error in pushArray" });
  }
};

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
      message: "Error in getResults",
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
      message: "Error in postResults",
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
      message: "Error in getSingleResults",
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
      // auth: {
      //   user: "officialhemantpaswan1@gmail.com",
      //   pass: "", // Use the app password you generated
      // },
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
      message: "Error in sendMail",
    });
  }
};
// }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
export const getData = async (req, res) => {
  try {
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in getting Data",
    });
  }
};

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Push Data >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
export const pushData = async (req, res) => {
  try {
    if (!req.body.data) {
      return res.status(200).send({
        message: "Please Enter Data",
        success: false,
      });
    }
    const data = await DataSchema.create({ data: req.body.data });
    res.status(200).send({
      success: true,
      message: "This is pushData",
      data,
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ success: false, message: "error in pushData" });
  }
};

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Push into array Data >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
// {{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{{ Send Mail }}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}}
const sendResultMail = (dataArray1, dataArray2) => {
  // Create a transporter
  const transporter = nodemailer.createTransport({
    service: "Gmail",

    auth: {
      user: `${process.env.EMAIL}`,
      pass: `${process.env.PASSWORD}`, // Use the app password you generated
    },
  });

  // Build the email content
  let emailContent = "<h1>Your Data Values:</h1>";

  // Function to generate a list based on an array
  function generateList(dataArray, listName) {
    let listContent = `<div style="display: inline-block; margin-right: 20px;">`;
    listContent += `<h2>${listName}</h2><ul>`;

    dataArray.forEach((item) => {
      listContent += `<li>${item.data}</li>`;
    });

    listContent += "</ul></div>";
    return listContent;
  }

  // Add the lists to the email content
  emailContent += generateList(dataArray1, "List Between 00-49");
  emailContent += generateList(dataArray2, "List Between 50-99");

  // Define email options
  const mailOptions = {
    from: "officialhemantpaswan1@gmail.com",
    to: "hemantakumarpaswan@gmail.com",
    subject: "Your Data Values",
    html: emailContent, // Use html property to include HTML content
  };

  // Send the email
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error(error);
    } else {
      console.log("Email sent: " + info.response);
    }
  });
};

export const sendMailDaily = async () => {
  try {
    const { data } = await axios.get(`http://localhost:8080/api/getMainData`);
    let round1 = [];
    let round2 = [];
    data?.data?.data?.map((item) => {
      if (item.first < 50) {
        round1.push({ data: item.first });
      } else {
        round2.push({ data: item.first });
      }
    });
    console.log(colors.red(round1.length));
    // console.log(colors.green(round2));
    const randomNumber1 = [];
    const randomNumber2 = [];
    for (let i = 0; i < 20; i++) {
      const num1 = Math.floor(Math.random() * round1.length);
      const num2 = Math.floor(Math.random() * round1.length);

      randomNumber1.push(round1[num1]);
      randomNumber2.push(round2[num2]);
    }

    await axios.post(`http://localhost:8080/api/results`, {
      number: randomNumber1,
      number2: randomNumber2,
    });
    sendResultMail(randomNumber1, randomNumber2);
    // console.log(colors.red());
    console.log(colors.green(randomNumber2));
  } catch (error) {
    console.log(error);
  }
};

export const updatePlay = async (req, res) => {
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
    console.log(error);
    res.status(500).send({
      success: false,
      message: "error in UpdatePlay",
    });
  }
};

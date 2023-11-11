const nodemailer = require("nodemailer");
const DataSchema = require("../module/pushDataSchema.js");
const axios = require("axios");
const colors = require("colors");
const resultsData = require("../module/myModleSchema.js");
const moment = require("moment");

// Get Results

// <<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<<  Push Data >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
exports.pushMainData = async (req, res) => {
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

exports.pushData = async (req, res) => {
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

exports.getMainData = async (req, res) => {
  try {
    const data = await DataSchema.findById("654f6fb472daeb15ff7e078f");
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
exports.pushArray = async (req, res) => {
  try {
    const id = "654f6fb472daeb15ff7e078f";
    const data = await DataSchema.findById(id);
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

exports.getResults = async (req, res) => {
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
exports.postResults = async (req, res) => {
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
    const today = new Date();
    const isoString = today.toISOString();
    const ismatched = await resultsData.find({});
    const arrayofDate = [];
    if (ismatched) {
      ismatched.map((item) => {
        if (
          moment(item.createdAt).format("DD-MM-YYYY") ===
          moment(isoString).format("DD-MM-YYYY")
        ) {
          arrayofDate.push(item.createdAt);
        }
      });
    }
    if (arrayofDate.length > 0) {
      return res.status(200).send({
        success: false,
        message: "Data Already exist",
      });
    }
    const data = await resultsData.create({ firstRound: firstRound });
    res.status(200).send({
      success: true,
      message: "Success",
      data: ismatched,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in postResults",
    });
  }
};

exports.getSingleResults = async (req, res) => {
  try {
    const data = await resultsData.findById(req.body.id);
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
exports.updateHit = async (req, res) => {
  const documentId = req.params.documentId;
  const data1Index = req.params.data1Index;
  const resultsIndex = req.params.resultsIndex;
  const newHitValue = req.body.hit; // Assuming the new "hit" value is sent in the request body
  console.log(
    colors.red(
      `This is data1Index ${data1Index} and this is resultsIndex ${resultsIndex} and this is newHitValue ${newHitValue} and this is documentId ${documentId}`
    )
  );
  try {
    // Find the document by its ID
    const document = await resultsData.findById(documentId);

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
    if (req.body.data === "data1") {
      document.firstRound.data1[data1Index].results[resultsIndex].hit =
        newHitValue;
    }
    if (req.body.data === "data2") {
      document.firstRound.data2[data1Index].results[resultsIndex].hit =
        newHitValue;
    }

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
exports.sendMail = async (req, res) => {
  try {
    // Create a Nodemailer transporter with your Gmail account
    const transporter = nodemailer.createTransport({
      service: "Gmail",
      auth: {
        user: `${process.env.EMAIL}`,
        pass: `${process.env.PASSWORD}`,
      },
    });

    // Define the email data
    const mailOptions = {
      from: EMAIL,
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
      message: "Email sent",
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in sendMail",
    });
  }
};
// }}}}}}}

exports.updatePlay = async (req, res) => {
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

exports.sendMail = async (req, res) => {
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

exports.sendMailDaily = async (req, res) => {
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
    res.status(200).send({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      data: error,
      message: "senner in sendMailDaily",
    });
  }
};

exports.getAllData = async (req, res) => {
  try {
    const data = await DataSchema.findById({ _id: "654f6fb472daeb15ff7e078f" });
    res.status(200).send({
      success: true,
      message: "Data Are",
      data,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      success: false,
      message: "Error in retAllData",
    });
  }
};

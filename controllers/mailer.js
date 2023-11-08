import nodemailer from "nodemailer";
import MailGen from "mailgen";
import "dotenv/config";
const EMAIL = process.env.EMAIL;
const PASSWORD = process.env.PASSWORD;
let nodeConfig = {
  host: "smtp.forwardemail.net",
  port: 465,
  secure: true,
  auth: {
    user: EMAIL,
    pass: PASSWORD,
  },
};

let tranporter = nodemailer.createTransport(nodeConfig);

let mailGenerator = new MailGen({
  theme: "default",
  product: {
    name: "Hemanta Kr. Paswan",
    link: "http://localhost:8080",
  },
});

/** POST: http://localhost:8080/api/registerMail 

  "username" : "example123",
  "userEmail" : "admin123@gmail.com",
  "text" : "This is simple text",
  "subject" : "This is sample Subject"

*/
export const registerMail = async (req, res) => {
  const { username, userEmail, text, subject } = req.body;
  // Generate SMTP service account from ethereal.email

  // Creating config
  const config = {
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: PASSWORD,
    },
  };
  // Create a SMTP transporter object
  let transporter = nodemailer.createTransport(config);
  var email = {
    body: {
      name: username,
      intro: text || "This is Intro",
      outro: "This is Outro",
    },
  };
  var emailbody = mailGenerator.generate(email);
  // Message object
  let message = {
    from: EMAIL,
    to: userEmail,
    subject: subject || "Signup Sccessffully",
    html: emailbody,
  };

  transporter.sendMail(message, (err, info) => {
    if (err) {
      console.log("Error occurred. " + err.message);
      return process.exit(1);
    }
    res.status(200).send(`Message Succesfully send to ${userEmail}`);
  });
};

const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");
const users = require("../controllers/users")
require("dotenv").config();

const sendEmail = async (email, subject, text) => {
  try {
    const transport = nodemailer.createTransport(
      nodemailerSendgrid({
        apiKey: process.env.SENDGRID_API_KEY,
      })
    );
    await transport.sendMail({
      from: "aditya007547@gmail.com",
      to: email,
      subject: subject,
      text: text,
    });
  } catch (err) {
    throw err;
  }
};
module.exports = sendEmail;

const nodemailer = require("nodemailer");
const nodemailerSendgrid = require("nodemailer-sendgrid");
require("dotenv").config();

const sendEmail = async (email, subject, text, res) => {
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
    res.send({
      error: 1,
      message: err.message || "failed to send mail",
      data: err,
    });
  }
};
module.exports = sendEmail;

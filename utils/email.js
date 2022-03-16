const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();

const sendMail = async (email, subject, html, url) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.HOST,
      service: process.env.SERVICE,
      port: 587,
      secure: true,
      auth: {
        user: process.env.USER,
        pass: process.env.PASS,
      },
    });
    // point to the template folder
    const handlebarOptions = {
      viewEngine: {
        partialsDir: path.join(__dirname, "../views/"),
        defaultLayout: false,
      },
      viewPath: path.join(__dirname, "../views/"),
    };

    // use a template file with nodemailer
    transporter.use("compile", hbs(handlebarOptions));

    await transporter.sendMail({
      from: process.env.USER,
      to: email,
      subject: subject,
      template: html, // the name of the template file i.e email.handlebars
      context: {
        url: url, // replace {{name}} with Adebola
      },
    });
    console.log("Email Sent Successfully.");
    return true;
  } catch (error) {
    console.log("Email Sent Failed");
    console.log("EMAIL ERROR => " + error);
    return false;
  }
};

module.exports = sendMail;

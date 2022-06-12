const nodemailer = require('nodemailer');

const sendMail = async options =>{
    //create a transporter
    const transporter = nodemailer.createTransport({
        //for gmail use for now we will use mailtrap
        // service :'Gmail',
        // auth:{
        //     user: process.env.EMAIL_USERNAME,
        //     pass: process.env.EMAIL_PASSWORD
        // }
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth:{
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
        //for gmail activate the "less secure app" option
    });

    //Define the email option
    const mailOptions = {
        from:'Natours <admin@natour.io>',
        to:options.email,
        subject:options.subject,
        text:options.message,
        //html for url purposes
    }

    //Actually send the mail
    await transporter.sendMail(mailOptions);
}

module.exports = sendMail;
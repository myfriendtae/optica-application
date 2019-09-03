const nodemailer = require("nodemailer");

module.exports = function sendmail(Fields, email) {

    // Send an email confirmation
    const emailoutput = `
    Your request has been entered.

    Sample Details
    - Date: ${Date.now()}
    - Customer: ${Fields.customer}
    - Product: ${Fields.product}
    - Unit: ${Fields.qty}
    - Status:${Fields.status}

    Thank you,
    Dispatch Team
    `

    // create reusable transporter object using the default SMTP transport
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: "do.not.reply.optica@gmail.com", // generated ethereal user
            pass: "FAKEPASSWORD" // generated ethereal password
        }
    });

    // setup email data with unicode symbols
    let mailOptions = {
        from: `"Do Not Reply" <do.not.reply.optica@gmail.com>`, // sender address
        to: `${email}`, // list of receivers
        subject: "Your Request Confirmed", // Subject line
        text: emailoutput // plain text body
        // html:  // html body
    };

    // send mail with defined transport object
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            return console.log(error);
        }
        console.log("Message sent: %s", info.messageId);
    });

}

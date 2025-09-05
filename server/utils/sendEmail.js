
// 
import nodeMailer from 'nodemailer';

// This function will send email code in the user's mail.
export const sendEmail = async ({ email, subject, message }) => {
    const transporter = nodeMailer.createTransport({
        host : process.env.SMTP_HOST,
        service : process.env.SMTP_SERVICE,
        port : process.env.SMTP_PORT,
        auth : {
            user : process.env.SMTP_MAIL, // from which email we have to send the email to user
            pass : process.env.SMTP_PASSWORD
        },
    });


    const options = {
        from : process.env.SMTP_MAIL,
        to : email, // user's email
        subject, // main title or subject
        html : message // currently mail is in html format (becaus we are sending the complete html templete).
    };

    await transporter.sendMail(options)
}
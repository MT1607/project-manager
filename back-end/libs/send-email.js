import dotenv from "dotenv";
import {Resend} from "resend";

dotenv.config();

const keyResend = process.env.RESENT_TOKEN || "";
const resend = new Resend(`${keyResend}`);
console.log("resend", resend);
console.log("key resend", keyResend);

const fromEmail = process.env.FROM_EMAIL;

const sendEmail = async (to, subject, html) => {
    const {data, error} = await resend.emails.send({
        from: `From ${fromEmail} <${fromEmail}>`,
        to: to,
        subject: subject,
        html: html,
    });

    if (error) {
        console.error("Error sending email", error);
        return false;
    }

    if (data) {
        console.log("Email sent successfully ", data);
        return true;
    }
}

export default sendEmail;

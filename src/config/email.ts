import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || "localhost",
  port: parseInt(process.env.EMAIL_PORT || "1025"),
});

export const sendResetCodeEmail = async (email: string, code: string) => {
  const mailOptions = {
    from: "no-reply@wishlist.local",
    to: email,
    subject: "Password Reset Code",
    text: `Your password reset code is: ${code}. It is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

export const sendReservationCodeEmail = async (
  email: string,
  code: string,
  giftName: string,
  eventTitle: string
) => {
  const mailOptions = {
    from: "no-reply@wishlist.local",
    to: email,
    subject: "Gift Reservation Confirmation Code",
    text: `You have reserved the gift "${giftName}" for the event "${eventTitle}". Your confirmation code is: ${code}. It is valid for 10 minutes.`,
  };

  await transporter.sendMail(mailOptions);
};

export default transporter;

const nodemailer = require('nodemailer');
const email = process.env.EMAIL
const EMAIL_PASS = process.env.EMAIL_PASS
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: email || 'patelvinit135@gmail.com',
        pass: EMAIL_PASS || 'ahak wfar lzol dqaq',
    },
});

async function sendMail(to, data) {
    try {
        const info = await transporter.sendMail({
            from: `"E-Book Library" <${process.env.EMAIL}>`,
            to: to,
            subject: 'E-Book Reservation Confirmation - E-Library',
            text: `
      Dear User,
      
      Congratulations! Your reservation for the e-book has been successfully confirmed.
      
      We are excited to provide you with access to this book from our digital library. Below are the e-book details:
      
      - Book Title: ${data.title}
      - Author: ${data.author}
      - Publish Date: ${data.publishDate}
      
      You can access the e-book through your account on our platform. Should you have any questions or require assistance, feel free to reach out to us at any time.
      
      Enjoy your reading journey!
      
      Best regards,
      E-Library Management Team
    `
        });
        console.log('Message sent: %s', info.messageId);
        return info;
    } catch (error) {
        console.error('Error sending email:', error);
        throw error;
    }
}

module.exports = sendMail;

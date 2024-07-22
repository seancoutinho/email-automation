// cronJob.js
const nodemailer = require('nodemailer');
const ejs = require('ejs');
const fs = require('fs');
const path = require('path');
const cron = require('node-cron');
require('dotenv').config();

// Configure Nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

async function sendEmail(to, subject, templateData) {
    const templatePath = path.join(__dirname, 'templates', 'email.ejs');
    const template = fs.readFileSync(templatePath, 'utf-8');
    const html = ejs.render(template, templateData);

    const mailOptions = {
        from: process.env.EMAIL_USER,
        to,
        subject,
        html
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully!');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}

// Schedule a task to send an email every day at 10:20 AM
cron.schedule('30 13 * * *', () => {
    sendEmail('sean@raysuncapital.com', 'Daily Update', {
        name: 'John Doe',
        message: 'Here is your daily update!'
    });
});

// pages/api/sendEmail.js
import nodemailer from 'nodemailer';
import ejs from 'ejs';
import fs from 'fs';
import path from 'path';

// Configure Nodemailer transport
const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export default async (req, res) => {
    if (req.method === 'POST') {
        const { to, subject, templateData } = req.body;
        const templatePath = path.join(process.cwd(), 'templates', 'email.ejs');
        const template = fs.readFileSync(templatePath, 'utf-8');
        const html = ejs.render(template, templateData);

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to,
            subject,
            html,
        };

        try {
            await transporter.sendMail(mailOptions);
            res.status(200).json({ message: 'Email sent successfully!' });
        } catch (error) {
            console.error('Error sending email:', error);
            res.status(500).json({ error: 'Error sending email' });
        }
    } else {
        res.status(405).json({ error: 'Method not allowed' });
    }
};

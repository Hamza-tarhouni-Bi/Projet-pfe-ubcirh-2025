// utiles/ForgetMail.js
const nodemailer = require('nodemailer');
const path = require('path');
const fs = require('fs');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  },
  tls: { rejectUnauthorized: false }
});

exports.sendCurrentPasswordEmail = async (email, nom, prenom, password) => {
  try {
    const date = new Date();
    const formattedDate = date.toLocaleDateString('fr-FR');
    const formattedTime = date.toLocaleTimeString('fr-FR');

    const mailOptions = {
      from: `"UBCI RH" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Votre mot de passe actuel - UBCI RH',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2c3e50;">Bonjour ${prenom} ${nom},</h2>
          
          <p>Suite à votre demande, voici vos informations de connexion actuelles :</p>
          
          <div style="background: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Email :</strong> ${email}</p>
            <p><strong>Mot de passe :</strong> ${password}</p>
          </div>
          
          <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p><strong>Important :</strong></p>
            <ul>
              <li>Ne partagez jamais votre mot de passe</li>
              <li>Changez votre mot de passe après connexion</li>
              <li>Contactez le support en cas de problème</li>
            </ul>
          </div>
          
          <p>Cordialement,<br>L'équipe RH UBCI</p>
          
          <div style="margin-top: 30px; font-size: 12px; color: #6c757d;">
            <p>Email généré le ${formattedDate} à ${formattedTime}</p>
          </div>
        </div>
      `,
      attachments: [] // Vous pouvez ajouter le logo ici si nécessaire
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé avec succès:', info.messageId);
    return info;
  } catch (error) {
    console.error('Échec envoi email:', {
      email,
      error: error.message,
      stack: error.stack
    });
    throw new Error('Échec de l\'envoi de l\'email avec mot de passe');
  }
};
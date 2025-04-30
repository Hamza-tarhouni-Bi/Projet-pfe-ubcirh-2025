const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendUpdateEmail = async (email, nom, prenom, updatedFields) => {
  try {
    let updatedFieldsHtml = '';
    const excludedFields = ['password', '_id', '__v', 'image'];
    const hasValidFields = Object.keys(updatedFields).some(key => !excludedFields.includes(key));

    if (hasValidFields) {
      for (const [key, value] of Object.entries(updatedFields)) {
        if (!excludedFields.includes(key) && value !== undefined) {
          updatedFieldsHtml += `
            <tr>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${key}</td>
              <td style="padding: 8px; border-bottom: 1px solid #ddd;">${value}</td>
            </tr>
          `;
        }
      }
    }

    const mailOptions = {
      from: `"UBCI RH" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Mise à jour de vos informations UBCI HR MANAGER',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <div style="text-align: center; padding: 10px; background-color: #f8f8f8; margin-bottom: 20px;">
            <h2 style="color: #333;">Mise à jour de vos informations</h2>
          </div>
          
          <p>Bonjour <strong>${prenom} ${nom}</strong>,</p>
          
          <p>Nous vous informons que des modifications ont été apportées à votre profil dans notre système de gestion.</p>
          
          ${updatedFieldsHtml ? `
            <p>Voici les informations qui ont été mises à jour :</p>
            <table style="width: 100%; border-collapse: collapse; margin: 15px 0;">
              <tr style="background-color: #f8f8f8;">
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Champ</th>
                <th style="padding: 10px; text-align: left; border-bottom: 2px solid #ddd;">Nouvelle valeur</th>
              </tr>
              ${updatedFieldsHtml}
            </table>
          ` : '<p>Vos informations ont été mises à jour dans notre système.</p>'}
          
          <p>Si vous n\'êtes pas à l\'origine de ces modifications, contactez le service RH immédiatement.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e1e1;">
            <p style="margin: 0; color: #777; font-size: 14px;">Cordialement,</p>
            <p style="margin: 5px 0 0; color: #777; font-size: 14px;">L'équipe UBCI</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email de mise à jour envoyé: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de mise à jour:', error);
    throw error;
  }
};

const sendProfileImageUpdateEmail = async (email, nom, prenom) => {
  try {
    const mailOptions = {
      from: `"UBCI RH" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Mise à jour de votre photo de profil',
      html: `
        <p>Bonjour ${prenom} ${nom},</p>
        <p>Votre photo de profil a été mise à jour avec succès dans le système UBCI HR Manager.</p>
        <p>Si ce n'était pas vous, veuillez contacter immédiatement le service RH.</p>
        <p>Cordialement,<br>L'équipe RH UBCI</p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email envoyé:', info.messageId);
    return true;
  } catch (error) {
    console.error('Erreur dans sendProfileImageUpdateEmail:', error);
    throw error;
  }
};

module.exports = {
  sendUpdateEmail,
  sendProfileImageUpdateEmail
};
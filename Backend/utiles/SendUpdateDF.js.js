const nodemailer = require('nodemailer');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendUpdateDemandeFormationEmail = async (email, nom, prenom, nomFormation, statut) => {
  try {
    // Chemin vers l'image dans le dossier images
    const logoPath = path.join(__dirname, '../images/logo-ubci.png');
    
    const mailOptions = {
      from: `"Service Formations" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Statut de votre demande: ${nomFormation}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <!-- En-tête avec logo -->
          <div style="text-align: center; padding: 20px 0;">
            <img src="cid:companyLogo" alt="Logo" style="max-height: 80px;">
          </div>
          
          <!-- Contenu -->
          <div style="padding: 20px;">
            <p>Bonjour ${prenom} ${nom},</p>
            <p>Votre demande pour la formation <strong>${nomFormation}</strong> 
            est maintenant <strong style="color: ${
              statut === 'Approuvée' ? 'green' : 
              statut === 'Rejetée' ? 'red' : 'orange'
            }">${statut}</strong>.</p>
          </div>
          
          <!-- Pied de page -->
          <div style="text-align: center; padding: 20px; color: #777; font-size: 14px; border-top: 1px solid #eee;">
            <p>Cordialement,<br><strong>L'équipe Formations</strong></p>
          </div>
        </div>
      `,
      attachments: [{
        filename: 'default.jpg',
        path: logoPath,
        cid: 'companyLogo' // cet ID est référencé dans le src (cid:companyLogo)
      }]
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email envoyé à ${email}`);
  } catch (error) {
    console.error("Erreur d'envoi d'email:", error);
    throw error;
  }
};

module.exports = { sendUpdateDemandeFormationEmail };
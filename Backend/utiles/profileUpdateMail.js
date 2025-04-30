// utiles/profileUpdateMail.js
const nodemailer = require('nodemailer');

// Configuration du transporteur d'emails
const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST || 'smtp.gmail.com',
  port: process.env.EMAIL_PORT || 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER || 'votre-email@gmail.com',
    pass: process.env.EMAIL_PASSWORD || 'votre-mot-de-passe'
  }
});

// Fonction pour envoyer un email de mise à jour de profil
exports.sendProfileUpdateEmail = async (email, nom, prenom, changedFields) => {
  try {
    // Génération du contenu des modifications
    let changesHTML = '';
    
    Object.keys(changedFields).forEach(field => {
      let fieldName = '';
      switch(field) {
        case 'nom': fieldName = 'Nom'; break;
        case 'prenom': fieldName = 'Prénom'; break;
        case 'email': fieldName = 'Email'; break;
        case 'tel': fieldName = 'Téléphone'; break;
        case 'password': fieldName = 'Mot de passe'; break;
        default: fieldName = field;
      }

      const value = field === 'password' 
        ? '******' // Ne pas afficher le mot de passe
        : changedFields[field];

      changesHTML += `
        <tr>
          <td style="padding: 10px; border-bottom: 1px solid #eaeaea;">${fieldName}</td>
          <td style="padding: 10px; border-bottom: 1px solid #eaeaea;">${value}</td>
        </tr>
      `;
    });

    // Date et heure actuelles
    const date = new Date();
    const formattedDate = date.toLocaleDateString('fr-FR', { 
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    const formattedTime = date.toLocaleTimeString('fr-FR', { 
      hour: '2-digit',
      minute: '2-digit'
    });

    // Contenu de l'email
    const mailOptions = {
      from: '"UBCI RH" <no-reply@ubci.com>',
      to: email,
      subject: 'Confirmation de modification de votre profil',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <img src="cid:logo" alt="UBCI Logo" style="max-width: 150px; height: auto;" />
          </div>
          
          <h2 style="color: #38b2ac; text-align: center;">Modification de votre profil</h2>
          
          <p>Bonjour ${prenom} ${nom},</p>
          
          <p>Nous vous informons que des modifications ont été apportées à votre profil le ${formattedDate} à ${formattedTime}.</p>
          
          <div style="background-color: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <h3 style="color: #2c7a7b; margin-top: 0;">Détails des modifications :</h3>
            
            <table style="width: 100%; border-collapse: collapse;">
              <tr style="background-color: #f2f2f2;">
                <th style="padding: 10px; text-align: left;">Champ</th>
                <th style="padding: 10px; text-align: left;">Nouvelle valeur</th>
              </tr>
              ${changesHTML}
            </table>
          </div>
          
          <p>Si vous n'avez pas effectué ces modifications, veuillez contacter immédiatement votre service RH ou l'administrateur système.</p>
          
          <div style="background-color: #e6fffa; padding: 15px; border-radius: 5px; margin: 20px 0;">
            <p style="margin: 0; color: #2c7a7b; font-weight: bold;">Pour des raisons de sécurité :</p>
            <ul style="margin-top: 5px; padding-left: 20px; color: #2c7a7b;">
              <li>Ne partagez jamais vos identifiants de connexion</li>
              <li>Vérifiez régulièrement l'activité de votre compte</li>
              <li>Déconnectez-vous lorsque vous avez terminé</li>
            </ul>
          </div>
          
          <p>Cordialement,<br>L'équipe UBCI RH</p>
          
          <div style="text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #eaeaea; color: #718096; font-size: 12px;">
            <p>Cet email a été envoyé automatiquement. Merci de ne pas y répondre.</p>
            <p>&copy; ${new Date().getFullYear()} UBCI RH. Tous droits réservés.</p>
          </div>
        </div>
      `,
      attachments: [
        {
          filename: 'logo.png',
          path: `${__dirname}/../public/Logo_UBCI.png`, // Ajustez le chemin selon votre structure
          cid: 'logo'
        }
      ]
    };

    // Envoi de l'email
    const info = await transporter.sendMail(mailOptions);
    return info;
    
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de mise à jour de profil:', error);
    throw error;
  }
};
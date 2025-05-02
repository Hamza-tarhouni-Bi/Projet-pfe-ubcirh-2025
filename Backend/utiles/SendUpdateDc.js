const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const sendUpdateDemandeCongeEmail = async (email, nom, prenom, DateDebut, DateFin, statut, motif) => {
  try {
    const formattedDateDebut = new Date(DateDebut).toLocaleDateString('fr-FR');
    const formattedDateFin = new Date(DateFin).toLocaleDateString('fr-FR');

    // Déterminer la couleur et le message en fonction du statut
    let statutColor, statutMessage;
    
    if (statut === 'Approuvée') {
      statutColor = 'green';
      statutMessage = '<p>Nous vous souhaitons un excellent congé !</p>';
    } else if (statut === 'Rejetée') {
      statutColor = 'red';
      statutMessage = `
        <p>Votre demande a été rejetée pour le motif suivant :</p>
        <p><strong>${motif || 'Motif non spécifié'}</strong></p>
        <p>Pour plus d'informations, veuillez contacter votre responsable ou le service RH.</p>
      `;
    } else {
      statutColor = '#333';
      statutMessage = '<p>Pour plus d\'informations, veuillez contacter votre responsable ou le service RH.</p>';
    }

    const mailOptions = {
      from: `"UBCI RH" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: `Mise à jour de votre demande de congé (${formattedDateDebut} - ${formattedDateFin})`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <div style="text-align: center; padding: 10px; background-color: #f8f8f8; margin-bottom: 20px;">
            <h2 style="color: #333;">Statut de votre demande de congé</h2>
          </div>
          
          <p>Bonjour <strong>${prenom} ${nom}</strong>,</p>
          
          <p>Nous vous informons que votre demande de congé du <strong>${formattedDateDebut}</strong> au <strong>${formattedDateFin}</strong> a été <strong style="color: ${statutColor}">${statut}</strong>.</p>
          
          <p>Détails de votre demande :</p>
          <ul>
            <li>Date de début: ${formattedDateDebut}</li>
            <li>Date de fin: ${formattedDateFin}</li>
            <li>Statut: <strong>${statut}</strong></li>
            ${statut === 'Rejetée' ? `<li>Motif: <strong>${motif || 'Non spécifié'}</strong></li>` : ''}
          </ul>
          
          ${statutMessage}
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e1e1;">
            <p style="margin: 0; color: #777; font-size: 14px;">Cordialement,</p>
            <p style="margin: 5px 0 0; color: #777; font-size: 14px;">L'équipe RH UBCI</p>
          </div>
        </div>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Email de statut de congé envoyé: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de mise à jour de congé:', error);
    throw error;
  }
};

module.exports = {
  sendUpdateDemandeCongeEmail
};
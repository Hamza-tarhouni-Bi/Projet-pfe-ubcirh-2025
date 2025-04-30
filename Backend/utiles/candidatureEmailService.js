// utiles/candidatureEmailService.js
const nodemailer = require('nodemailer');

// Configuration du transporteur d'email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

/**
 * Envoie un email de notification lorsqu'une candidature est acceptée
 * @param {string} email - Email du candidat
 * @param {string} nom - Nom du candidat
 * @param {string} prenom - Prénom du candidat
 * @param {string} poste - Poste pour lequel la candidature a été acceptée
 * @returns {Promise} - Résultat de l'opération d'envoi
 */
const sendAcceptedCandidatureEmail = async (email, nom, prenom, poste) => {
  try {
    // Définir les options de l'email
    const mailOptions = {
      from: `"UBCI RH" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Félicitations! Votre candidature a été acceptée - UBCI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <div style="text-align: center; padding: 10px; background-color: #f8f8f8; margin-bottom: 20px;">
            <h2 style="color: #333;">Candidature Acceptée</h2>
          </div>
          
          <p>Bonjour <strong>${prenom} ${nom}</strong>,</p>
          
          <p>Nous avons le plaisir de vous informer que votre candidature pour le poste de <strong>${poste}</strong> a été acceptée!</p>
          
          <p>Nous sommes impressionnés par votre profil et votre expérience, et nous pensons que vous seriez un excellent ajout à notre équipe.</p>
          
          <div style="background-color: #f0fff0; padding: 15px; border-left: 4px solid #28a745; margin: 15px 0;">
            <p><strong>Prochaines étapes :</strong></p>
            <p>Un membre de notre équipe RH vous contactera très prochainement pour discuter des détails et organiser un entretien complémentaire.</p>
          </div>
          
          <p>Si vous avez des questions dans l'intervalle, n'hésitez pas à nous contacter à l'adresse <a href="mailto:rh@ubci.tn">rh@ubci.tn</a>.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e1e1;">
            <p style="margin: 0; color: #777; font-size: 14px;">Cordialement,</p>
            <p style="margin: 5px 0 0; color: #777; font-size: 14px;">L'équipe de recrutement UBCI</p>
          </div>
        </div>
      `
    };

    // Envoyer l'email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email de candidature acceptée envoyé: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de candidature acceptée:', error);
    throw error;
  }
};

/**
 * Envoie un email de notification lorsqu'une candidature est refusée
 * @param {string} email - Email du candidat
 * @param {string} nom - Nom du candidat
 * @param {string} prenom - Prénom du candidat
 * @param {string} poste - Poste pour lequel la candidature a été refusée
 * @returns {Promise} - Résultat de l'opération d'envoi
 */
const sendRejectedCandidatureEmail = async (email, nom, prenom, poste) => {
  try {
    // Définir les options de l'email
    const mailOptions = {
      from: `"UBCI RH" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'Information concernant votre candidature - UBCI',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e1e1e1; border-radius: 5px;">
          <div style="text-align: center; padding: 10px; background-color: #f8f8f8; margin-bottom: 20px;">
            <h2 style="color: #333;">Réponse à votre candidature</h2>
          </div>
          
          <p>Bonjour <strong>${prenom} ${nom}</strong>,</p>
          
          <p>Nous vous remercions d'avoir postulé pour le poste de <strong>${poste}</strong> chez UBCI.</p>
          
          <p>Après un examen attentif de votre candidature, nous regrettons de vous informer que nous avons décidé de poursuivre avec d'autres candidats dont le profil correspond plus précisément aux besoins spécifiques de ce poste.</p>
          
          <p>Nous apprécions sincèrement l'intérêt que vous avez manifesté pour rejoindre notre équipe et vous encourageons à postuler pour d'autres opportunités qui pourraient mieux correspondre à vos compétences et aspirations.</p>
          
          <p>Votre candidature restera dans notre base de données pendant 6 mois, et nous vous contacterons si un poste correspondant à votre profil se présente.</p>
          
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e1e1e1;">
            <p style="margin: 0; color: #777; font-size: 14px;">Cordialement,</p>
            <p style="margin: 5px 0 0; color: #777; font-size: 14px;">L'équipe de recrutement UBCI</p>
          </div>
        </div>
      `
    };

    // Envoyer l'email
    const info = await transporter.sendMail(mailOptions);
    console.log('Email de candidature refusée envoyé: %s', info.messageId);
    return true;
  } catch (error) {
    console.error('Erreur lors de l\'envoi de l\'email de candidature refusée:', error);
    throw error;
  }
};

module.exports = {
  sendAcceptedCandidatureEmail,
  sendRejectedCandidatureEmail
};
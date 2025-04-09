import React, { useState, useEffect } from 'react';
import moment from 'moment';
import 'moment/locale/fr';

const Congé = () => {
  const [currentDate, setCurrentDate] = useState(moment());
  const [selectedDate, setSelectedDate] = useState(null);
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState('');
  const [newEventType, setNewEventType] = useState('congé-paye');

  // Configuration de la langue française
  moment.locale('fr');

  // Jours fériés en Tunisie (dates fixes pour 2025)
  const joursFeries = [
    { date: '2025-01-01', nom: "Jour de l'an" },
    { date: '2025-01-14', nom: "Fête de la Révolution et de la Jeunesse" },
    { date: '2025-03-20', nom: "Fête de l'Indépendance" },
    { date: '2025-04-09', nom: "Jour des Martyrs" },
    { date: '2025-05-01', nom: "Fête du Travail" },
    { date: '2025-07-25', nom: "Fête de la République" },
    { date: '2025-08-13', nom: "Fête de la Femme" },
    { date: '2025-10-15', nom: "Fête de l'Évacuation" }
  ];
  
  // Jours fériés à dates variables (basés sur calendriers lunaires)
  // Ces dates sont approximatives pour 2025 et devraient être mises à jour
  const joursFeriesVariables = [
    { date: '2025-04-10', nom: "Aïd El-Fitr", duree: 3 },
    { date: '2025-06-17', nom: "Aïd El-Idha", duree: 3 },
    { date: '2025-07-07', nom: "Nouvel An Hégire" },
    { date: '2025-09-16', nom: "Mouled" }
  ];

  // Types de congés disponibles
  const typesConges = [
    { id: 'congé-paye', label: 'Congé payé', color: '#2ecc71' },
    { id: 'rtt', label: 'RTT', color: '#3498db' },
    { id: 'congé-maladie', label: 'Congé maladie', color: '#e74c3c' },
    { id: 'congé-maternité', label: 'Congé maternité', color: '#9b59b6' },
    { id: 'congé-formation', label: 'Congé formation', color: '#f39c12' },
    { id: 'sans-solde', label: 'Congé sans solde', color: '#95a5a6' }
  ];

  // Fonction pour vérifier si une date est un jour férié
  const estJourFerie = (date) => {
    const dateFormatee = moment(date).format('YYYY-MM-DD');
    
    // Vérifier les jours fériés fixes
    const fixe = joursFeries.find(jour => jour.date === dateFormatee);
    if (fixe) return fixe.nom;
    
    // Vérifier les jours fériés variables
    for (const jour of joursFeriesVariables) {
      const dateDebut = moment(jour.date);
      const dateFin = moment(jour.date).add((jour.duree || 1) - 1, 'days');
      
      if (moment(date).isBetween(dateDebut, dateFin, null, '[]')) {
        return jour.nom;
      }
    }
    
    return null;
  };

  // Génération des jours du mois
  const genererJoursDuMois = () => {
    const debutMois = moment(currentDate).startOf('month');
    const finMois = moment(currentDate).endOf('month');
    const debutCalendrier = moment(debutMois).startOf('week');
    const finCalendrier = moment(finMois).endOf('week');
    
    const jours = [];
    let jour = moment(debutCalendrier);
    
    while (jour.isSameOrBefore(finCalendrier)) {
      jours.push(moment(jour));
      jour.add(1, 'day');
    }
    
    return jours;
  };

  // Changement de mois
  const moisPrecedent = () => {
    setCurrentDate(moment(currentDate).subtract(1, 'month'));
  };
  
  const moisSuivant = () => {
    setCurrentDate(moment(currentDate).add(1, 'month'));
  };

  // Sélection d'une date
  const selectionnerDate = (date) => {
    setSelectedDate(date);
    setShowModal(true);
    setNewEventTitle(''); // Réinitialiser le titre
    setNewEventType('congé-paye'); // Définir le type par défaut
  };

  // Ajout d'un événement
  const ajouterEvenement = () => {
    if (selectedDate && newEventTitle.trim() !== '') {
      const nouvelEvenement = {
        date: moment(selectedDate).format('YYYY-MM-DD'),
        titre: newEventTitle,
        type: newEventType
      };
      
      setEvents([...events, nouvelEvenement]);
      setShowModal(false);
      setSelectedDate(null);
    }
  };

  // Suppression d'un événement
  const supprimerEvenement = (date, titre) => {
    const eventsFiltered = events.filter(event => 
      !(event.date === date && event.titre === titre)
    );
    setEvents(eventsFiltered);
  };

  return (
    <div className="formationadmin">
      <div className="calendrier-container">
        <div className="calendrier-header">
          <h2>Calendrier des Congés</h2>
          <div className="navigation-mois">
            <button className="btn-navigation" onClick={moisPrecedent}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M15 18l-6-6 6-6"></path>
              </svg>
            </button>
            <h3>{currentDate.format('MMMM YYYY')}</h3>
            <button className="btn-navigation" onClick={moisSuivant}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 18l6-6-6-6"></path>
              </svg>
            </button>
          </div>
        </div>
        
        <div className="jours-semaine">
          {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map(jour => (
            <div key={jour} className="jour-semaine">{jour}</div>
          ))}
        </div>
        
        <div className="jours-mois">
          {genererJoursDuMois().map(jour => {
            const estMoisCourant = jour.month() === currentDate.month();
            const estAujourdhui = jour.isSame(moment(), 'day');
            const estSelectionne = selectedDate && jour.isSame(selectedDate, 'day');
            const jourFerie = estJourFerie(jour);
            const evenementsDuJour = events.filter(e => moment(e.date).isSame(jour, 'day'));
            const dateFormatee = jour.format('YYYY-MM-DD');
            
            return (
              <div 
                key={dateFormatee} 
                className={`jour-calendrier ${estMoisCourant ? 'mois-courant' : 'autre-mois'} 
                          ${estAujourdhui ? 'aujourdhui' : ''} 
                          ${estSelectionne ? 'selectionne' : ''} 
                          ${jourFerie ? 'jour-ferie' : ''}`}
                onClick={() => selectionnerDate(jour)}
              >
                <div className="numero-jour">{jour.date()}</div>
                {jourFerie && (
                  <div className="indicateur-ferie" title={jourFerie}>
                    <span className="tooltip-text">{jourFerie}</span>
                    🌙
                  </div>
                )}
                <div className="evenements-container">
                  {evenementsDuJour.map((evt, index) => {
                    const typeConge = typesConges.find(t => t.id === evt.type);
                    return (
                      <div 
                        key={index} 
                        className="evenement"
                        style={{ backgroundColor: typeConge ? typeConge.color : '#999' }}
                        title={evt.titre}
                      >
                        <span className="evenement-titre">{evt.titre}</span>
                        <button 
                          className="btn-supprimer" 
                          onClick={(e) => {
                            e.stopPropagation();
                            supprimerEvenement(dateFormatee, evt.titre);
                          }}
                          title="Supprimer ce congé"
                        >
                          ×
                        </button>
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>
        
        {/* Modal pour ajouter un congé */}
        {showModal && (
          <div className="modal-overlay" onClick={() => setShowModal(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h3>Ajouter un congé</h3>
                <button className="btn-fermer" onClick={() => setShowModal(false)}>×</button>
              </div>
              
              <div className="modal-body">
                <div className="date-selection">
                  <span className="label">Date sélectionnée:</span>
                  <span className="value">{selectedDate.format('DD MMMM YYYY')}</span>
                </div>
                
                <div className="form-group">
                  <label htmlFor="nom-conge">Nom du congé</label>
                  <input 
                    type="text"
                    id="nom-conge"
                    value={newEventTitle}
                    onChange={(e) => setNewEventTitle(e.target.value)}
                    placeholder="Saisissez un nom pour ce congé"
                    className="input-field"
                  />
                </div>
                
                <div className="form-group">
                  <label>Type de congé</label>
                  <div className="types-conges">
                    {typesConges.map((type) => (
                      <div 
                        key={type.id} 
                        className={`type-conge ${newEventType === type.id ? 'selected' : ''}`}
                        onClick={() => setNewEventType(type.id)}
                        style={{ 
                          borderColor: newEventType === type.id ? type.color : 'transparent',
                          backgroundColor: `${type.color}20` 
                        }}
                      >
                        <div className="type-color" style={{ backgroundColor: type.color }}></div>
                        <span>{type.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="modal-footer">
                <button 
                  className="btn btn-annuler" 
                  onClick={() => setShowModal(false)}
                >
                  Annuler
                </button>
                <button 
                  className="btn btn-ajouter" 
                  onClick={ajouterEvenement}
                  disabled={!newEventTitle.trim()}
                >
                  Ajouter
                </button>
              </div>
            </div>
          </div>
        )}
        
        <style jsx>{`
          .calendrier-container {
            max-width: 1000px;
            margin: 0 auto;
            font-family: 'Roboto', 'Arial', sans-serif;
            background-color: #fff;
            border-radius: 10px;
            box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
            padding: 20px;
          }
          
          .calendrier-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 25px;
            padding-bottom: 15px;
            border-bottom: 1px solid #eaeaea;
          }
          
          .calendrier-header h2 {
            font-size: 24px;
            font-weight: 500;
            color: #333;
            margin: 0;
          }
          
          .navigation-mois {
            display: flex;
            align-items: center;
            gap: 20px;
          }
          
          .navigation-mois h3 {
            font-size: 18px;
            margin: 0;
            text-transform: capitalize;
            min-width: 140px;
            text-align: center;
          }
          
          .btn-navigation {
            background: #fff;
            color: #555;
            border: 1px solid #eaeaea;
            border-radius: 50%;
            width: 36px;
            height: 36px;
            cursor: pointer;
            display: flex;
            align-items: center;
            justify-content: center;
            transition: all 0.2s ease;
          }
            
          .btn-navigation:hover {
            background-color: #f6f6f6;
            color: #333;
            transform: scale(1.05);
          }
          
          .jours-semaine {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            text-align: center;
            font-weight: 500;
            background-color: #f8f9fa;
            padding: 12px 0;
            border-radius: 8px;
            margin-bottom: 10px;
          }
          
          .jour-semaine {
            font-size: 14px;
            color: #555;
          }
          
          .jours-mois {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
            grid-gap: 8px;
          }
          
          .jour-calendrier {
            aspect-ratio: 1;
            border-radius: 8px;
            border: 1px solid #eaeaea;
            padding: 8px;
            cursor: pointer;
            position: relative;
            overflow: hidden;
            transition: all 0.2s ease;
            display: flex;
            flex-direction: column;
          }
          
          .jour-calendrier:hover {
            box-shadow: 0 0 0 2px rgba(52, 152, 219, 0.3);
          }
          
          .mois-courant {
            background-color: white;
          }
          
          .autre-mois {
            background-color: #f9f9f9;
            color: #aaa;
          }
          
          .aujourdhui {
            background-color: #e6f7ff;
            font-weight: bold;
            border: 2px solid #48aff0;
          }
          
          .selectionne {
            box-shadow: 0 0 0 2px #3498db;
          }
          
          .jour-ferie {
            background-color: #fff5f5;
          }
          
          .numero-jour {
            font-size: 14px;
            font-weight: 500;
            margin-bottom: 4px;
          }
          
          .indicateur-ferie {
            position: absolute;
            top: 8px;
            right: 8px;
            font-size: 12px;
            cursor: help;
            position: relative;
          }
          
          .indicateur-ferie .tooltip-text {
            visibility: hidden;
            width: 120px;
            background-color: rgba(0, 0, 0, 0.8);
            color: #fff;
            text-align: center;
            border-radius: 4px;
            padding: 5px;
            position: absolute;
            z-index: 1;
            bottom: 125%;
            left: 50%;
            transform: translateX(-50%);
            opacity: 0;
            transition: opacity 0.3s;
            font-size: 11px;
            font-weight: normal;
          }
          
          .indicateur-ferie:hover .tooltip-text {
            visibility: visible;
            opacity: 1;
          }
          
          .evenements-container {
            display: flex;
            flex-direction: column;
            gap: 4px;
            margin-top: 4px;
            flex: 1;
            overflow-y: auto;
          }
          
          .evenement {
            padding: 4px 6px;
            border-radius: 4px;
            font-size: 12px;
            color: white;
            display: flex;
            justify-content: space-between;
            align-items: center;
            transition: all 0.2s ease;
          }
          
          .evenement-titre {
            flex: 1;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }
          
          .btn-supprimer {
            background: none;
            border: none;
            color: rgba(255, 255, 255, 0.8);
            cursor: pointer;
            width: 16px;
            height: 16px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 14px;
            font-weight: bold;
            padding: 0;
            margin-left: 4px;
            opacity: 0.7;
            transition: opacity 0.2s;
            border-radius: 50%;
          }
          
          .btn-supprimer:hover {
            opacity: 1;
            background-color: rgba(0, 0, 0, 0.1);
          }
          
          /* Modal */
          .modal-overlay {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.5);
            display: flex;
            align-items: center;
            justify-content: center;
            z-index: 1000;
          }
          
          .modal-content {
            background-color: white;
            border-radius: 10px;
            width: 90%;
            max-width: 500px;
            box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
            animation: modalAppear 0.3s ease;
          }
          
          @keyframes modalAppear {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          
          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 15px 20px;
            border-bottom: 1px solid #eaeaea;
          }
          
          .modal-header h3 {
            margin: 0;
            font-size: 18px;
            color: #333;
          }
          
          .btn-fermer {
            background: none;
            border: none;
            font-size: 24px;
            color: #777;
            cursor: pointer;
            width: 30px;
            height: 30px;
            display: flex;
            align-items: center;
            justify-content: center;
            border-radius: 50%;
            transition: all 0.2s;
          }
          
          .btn-fermer:hover {
            background-color: #f0f0f0;
            color: #333;
          }
          
          .modal-body {
            padding: 20px;
          }
          
          .date-selection {
            display: flex;
            align-items: center;
            margin-bottom: 20px;
            padding: 10px 15px;
            background-color: #f8f9fa;
            border-radius: 6px;
          }
          
          .date-selection .label {
            font-weight: 500;
            color: #555;
            margin-right: 10px;
          }
          
          .date-selection .value {
            font-weight: 600;
            color: #333;
          }
          
          .form-group {
            margin-bottom: 20px;
          }
          
          .form-group label {
            display: block;
            margin-bottom: 8px;
            font-weight: 500;
            color: #444;
          }
          
          .input-field {
            width: 100%;
            padding: 12px 15px;
            border: 1px solid #ddd;
            border-radius: 6px;
            font-size: 14px;
            transition: border-color 0.2s;
          }
          
          .input-field:focus {
            outline: none;
            border-color: #3498db;
            box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.2);
          }
          
          .types-conges {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 10px;
          }
          
          .type-conge {
            padding: 10px;
            border-radius: 6px;
            display: flex;
            align-items: center;
            cursor: pointer;
            transition: all 0.2s;
            border: 2px solid transparent;
          }
          
          .type-conge:hover {
            transform: translateY(-2px);
          }
          
          .type-conge.selected {
            font-weight: 500;
          }
          
          .type-color {
            width: 14px;
            height: 14px;
            border-radius: 50%;
            margin-right: 8px;
          }
          
          .modal-footer {
            padding: 15px 20px;
            display: flex;
            justify-content: flex-end;
            gap: 10px;
            border-top: 1px solid #eaeaea;
          }
          
          .btn {
            padding: 10px 18px;
            border-radius: 6px;
            font-size: 14px;
            font-weight: 500;
            cursor: pointer;
            transition: all 0.2s;
            border: none;
          }
          
          .btn-annuler {
            background-color: #f0f0f0;
            color: #555;
          }
          
          .btn-annuler:hover {
            background-color: #e0e0e0;
            color: #333;
          }
          
          .btn-ajouter {
            background-color: #3498db;
            color: white;
          }
          
          .btn-ajouter:hover {
            background-color: #2980b9;
          }
          
          .btn-ajouter:disabled {
            background-color: #b2d6f5;
            cursor: not-allowed;
          }
        `}</style>
      </div>
    </div>
  );
};

export default Congé;
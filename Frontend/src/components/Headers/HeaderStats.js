  import React, { useState, useEffect } from "react";
  import axios from "axios";

  // components
  import CardStats from "components/Cards/CardStats.js";

  export default function HeaderStats() {
    const [departmentCount, setDepartmentCount] = useState(0);
    const [personnelCount, setPersonnelCount] = useState(0);
    const [formationCount, setFormationCount] = useState(0);
    //Recuperer le nombre de personnels:
    useEffect(() => {
      
      const fetchPersonnelCount = async () => {
        try {
          const response = await axios.get('/api/allpersonnel');
          
          setPersonnelCount(response.data.length.toString());
        } catch (error) {
          console.error("Erreur lors de la récupération des personnels:", error);
          setPersonnelCount("Erreur");
        }
      };

      fetchPersonnelCount();
    }, []);

    useEffect(() => {
      // Récupérer le nombre de départements 
      const fetchDepartmentCount = async () => {
        try {
          const response = await axios.get('/api/alldepartment');
          
          setDepartmentCount(response.data.length.toString());
        } catch (error) {
          console.error("Erreur lors de la récupération des départements:", error);
          setDepartmentCount("Erreur");
        }
      };

      fetchDepartmentCount();
    }, []);

      //Recuperer le nombre de formation:
      useEffect(() => {
      
        const fetchFormationCount = async () => {
          try {
            const response = await axios.get('/api/getformation');
            
            setFormationCount(response.data.length.toString());
          } catch (error) {
            console.error("Erreur lors de la récupération des formations:", error);
            setFormationCount("Erreur");
          }
        };
  
        fetchFormationCount();
      }, []);

    return (
      <>
        {/* Header */}
        <div className="relative bg-lightBlue-600 md:pt-32 pb-32 pt-12" style={{ backgroundColor: "#49babd" }}>
          <div className="px-4 md:px-10 mx-auto w-full">
            <div>
              {/* Card stats */}
              <div className="flex flex-wrap">
                <div className="w-full lg:w-6/12 xl:w-4/12 px-4">
                  <CardStats
                    statSubtitle="Nombre du personnel"
                    statTitle={personnelCount}
                  
                    statIconName="fas fa-users"
                    statIconColor="bg-pink-500"
                  />
                </div>
                <div className="w-full lg:w-6/12 xl:w-4/12 px-4">
                  <CardStats
                    statSubtitle="Nombre du departement"
                    statTitle={departmentCount}
                    statArrow="down"
                    statPercent="3.48"
                    statPercentColor="text-red-500"
                    statDescripiron="Since last week"
                    statIconName="fas fa-building"
                    statIconColor="bg-orange-500"
                  />
                </div>
                <div className="w-full lg:w-6/12 xl:w-4/12 px-4">
                  <CardStats
                    statSubtitle="Nombre de formation"
                    statTitle={formationCount}
                    statArrow="down"
                    statPercent="1.10"
                    statPercentColor="text-orange-500"
                    statDescripiron="Since yesterday"
                    statIconName="fas fa-chalkboard-teacher"
                    statIconColor="bg-pink-500"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </>
    );
  }
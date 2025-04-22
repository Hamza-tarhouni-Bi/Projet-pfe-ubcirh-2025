  import React, { useState, useEffect } from "react";
  import axios from "axios";

  // components
  import CardStats from "components/Cards/CardStats.js";

  export default function HeaderStats() {
    const [departmentCount, setDepartmentCount] = useState(0);
    
    useEffect(() => {
      // Récupérer le nombre de départements 
      const fetchDepartmentCount = async () => {
        try {
          const response = await axios.get('/alldepartment');
          
          setDepartmentCount(response.data.length.toString());
        } catch (error) {
          console.error("Erreur lors de la récupération des départements:", error);
          setDepartmentCount("Erreur");
        }
      };

      fetchDepartmentCount();
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
                    statTitle="350,897"
                    statArrow="up"
                    statPercent="3.48"
                    statPercentColor="text-emerald-500"
                    statDescripiron="Since last month"
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
                    statTitle="924"
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
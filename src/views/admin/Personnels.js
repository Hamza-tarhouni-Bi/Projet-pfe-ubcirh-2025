import React from 'react';
import CardPersonnels from 'components/Cards/CardPersonnels';
import Home from 'views/Home';
export default function Personnels() {
  return (
     <>
        <div className="flex flex-wrap mt-4">
          <div className="w-full mb-12 px-4">
           <CardPersonnels/>
          </div>
          
        </div>
      </>
  )
}








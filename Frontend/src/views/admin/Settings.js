import React from "react";

// components

import CardSettings from "components/Cards/CardSettings.js";


export default function Settings() {
  return (
    <>
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-full lg:w-8/12 px-4">
          <CardSettings />
        </div>
        
      </div>
    </>
  );
}
import React from "react";

// components

import City from "components/Cards/CardCity";
import CardTableCity from "components/Cards/CardTableCity";

export default function Cities() {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full px-4">
          <City />
        </div>
        <div className="w-full px-4">
          <CardTableCity />
        </div>
       
      </div>
    </>
  );
}

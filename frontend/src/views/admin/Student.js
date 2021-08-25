import React from "react";

// components

import CardStudent from "components/Cards/CardStudent";
import CardTableStudent from "components/Cards/CardTableStudent";

export default function Student() {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full px-4">
          <CardStudent />
        </div>
        <div className="w-full px-4">
          <CardTableStudent />
        </div>
       
      </div>
    </>
  );
}

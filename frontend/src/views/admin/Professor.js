import React from "react";

// components

import CardProfessor from "components/Cards/CardProfessor";
import CardTableProfessor from "components/Cards/CardTableProfessor";

export default function Professor() {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full px-4">
          <CardProfessor />
        </div>
        <div className="w-full px-4">
          <CardTableProfessor />
        </div>
       
      </div>
    </>
  );
}
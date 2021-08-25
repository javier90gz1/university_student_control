import React from "react";

// components

import CardGroup from "components/Cards/CardGroup";
import CardTableGroup from "components/Cards/CardTableGroup";

export default function Group() {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full px-4">
          <CardGroup />
        </div>
        <div className="w-full px-4">
          <CardTableGroup />
        </div>
       
      </div>
    </>
  );
}
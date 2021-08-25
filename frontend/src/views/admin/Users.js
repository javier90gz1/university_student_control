import React from "react";

// components

import CardUser from "components/Cards/CardUser.js";
import CardTableUser from "components/Cards/CardTableUser.js"

export default function Settings() {
  return (
    <>
      <div className="flex flex-wrap">
        <div className="w-full px-4">
          <CardUser />
        </div>
        <div className="w-full px-4">
          <CardTableUser />
        </div>
      </div>
    </>
  );
}

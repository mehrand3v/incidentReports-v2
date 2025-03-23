// src/components/shared/DevSignature.jsx
import React, { useState } from "react";

const DevSignature = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="inline-flex items-center group cursor-pointer"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center">
        <span
          className={`${
            isHovered ? "text-blue-300" : "text-blue-300"
          } transition-colors text-sm`}
        >
          &lt;
        </span>
        <span
          className="text-sm font-signature text-blue-300 group-hover:text-blue-300 group-hover:drop-shadow-glow transition-all"
          style={{
            fontFamily: "'Dancing Script', cursive",
            textShadow: isHovered ? "0 0 5px rgba(96, 165, 250, 0.5)" : "none",
            letterSpacing: "0.1em",
          }}
        >
          Mehrand3v
        </span>
        <span
          className={`${
            isHovered ? "text-blue-300" : "text-blue-300"
          } transition-colors text-sm`}
        >
          &gt;
        </span>
      </div>
    </div>
  );
};

export default DevSignature;

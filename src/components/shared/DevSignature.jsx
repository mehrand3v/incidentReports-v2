// src/components/shared/DevSignature.jsx
import React, { useState } from "react";

const DevSignature = () => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className="inline-flex items-center group cursor-pointer ml-6"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <span
        className="text-sm font-mono italic text-blue-300 group-hover:text-blue-300 group-hover:drop-shadow-glow transition-all"
        style={{
          textShadow: isHovered ? "0 0 5px rgba(96, 165, 250, 0.5)" : "none",
        }}
      >
        Mehrand3v
      </span>
    </div>
  );
};

export default DevSignature;

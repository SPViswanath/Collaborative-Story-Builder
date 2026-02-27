import React from "react";

function LoadingGif() {
  return (
    <div className="flex justify-center items-center py-8 space-x-2">
      <div 
        className="w-3 h-3 bg-green-600 rounded-full animate-bounce" 
        style={{ animationDelay: "0s", animationDuration: "1s" }}
      ></div>
      <div 
        className="w-3 h-3 bg-green-600 rounded-full animate-bounce" 
        style={{ animationDelay: "0.2s", animationDuration: "1s" }}
      ></div>
      <div 
        className="w-3 h-3 bg-green-600 rounded-full animate-bounce" 
        style={{ animationDelay: "0.4s", animationDuration: "1s" }}
      ></div>
    </div>
  );
}

export default LoadingGif;

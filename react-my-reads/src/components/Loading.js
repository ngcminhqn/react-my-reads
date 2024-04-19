import React from "react";
import ReactDOM from "react-dom";

export default function Loading({ isLoading = false }) {
  return isLoading
    ? ReactDOM.createPortal(
        <div className="loader-container">
          <span className="loader"></span>
        </div>,
        document.getElementById("root")
      )
    : null;
}

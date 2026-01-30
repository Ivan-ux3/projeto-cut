import React from "react";

export default function Toolbar(){
  return (
    <header className="toolbar">
      <div className="brand">Cut • Design</div>
      <div className="actions">
        <button>Export</button>
        <button>Share</button>
      </div>
    </header>
  );
}
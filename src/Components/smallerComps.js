import { useState } from "react";

export function Loader() {
  return <div className="loader">Loading.....</div>;
}

export function ErrorMessage({ errorMSG }) {
  return (
    <p className="error">
      <span>❌ </span>
      {errorMSG}
    </p>
  );
}
export function Box({ children }) {
  const [isOpen, setIsOpen] = useState(true);
  return (
    <div className="box">
      <button className="btn-toggle" onClick={() => setIsOpen((open) => !open)}>
        {isOpen ? "–" : "+"}
      </button>
      {isOpen && children}
    </div>
  );
}

import { useEffect, useRef, useState } from "react";

export function Search({ query, setQuery }) {
  const [value, setValue] = useState("");
  const inputEL = useRef(null);
  const [isFocused, setIsFocused] = useState(false);

  function Search(strSearch) {
    const urlPrefix = `http://www.omdbapi.com/?apikey=636f8485&s=`;
    strSearch.length > 2 ? setQuery(urlPrefix + strSearch) : setQuery("");
    setValue(strSearch);
    return;
  }

  useEffect(
    function () {
      // If the input is currently focused, do not attach the listener.
      // React will run the cleanup function below (removing the old listener).
      if (isFocused) return;

      function callback(e) {
        if (e.code.toLowerCase().includes("enter")) inputEL.current.focus();
        console.log("e.code is as " + e.code);
      }

      document.addEventListener("keydown", callback);

      // This cleanup physically removes the listener when isFocused changes to true
      return () => document.removeEventListener("keydown", callback);
    },
    [isFocused],
  );

  return (
    <input
      className="search"
      type="text"
      placeholder="Search movies..."
      value={value}
      onChange={(e) => Search(e.target.value)}
      ref={inputEL}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
    />
  );
}
export function NumResults({ numMovies }) {
  return (
    <p className="num-results">
      Found <strong>{numMovies}</strong> results
      {/* Found <strong>{movies.length}</strong> results */}
    </p>
  );
}

export function Navbar({ children }) {
  return (
    <nav className="nav-bar">
      <div className="logo">
        <span role="img">🍿</span>
        <h1>usePopcorn</h1>
      </div>
      {children}
    </nav>
  );
}

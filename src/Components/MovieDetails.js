import { useState, useEffect } from "react";
import StarRating from "./StarRatings";

export function MovieDetails({ movieData, onAddWatched, onCloseMovie }) {
  const [userRating, setUserRating] = useState(0);

  useEffect(
    function () {
      function callback(e) {
        if (e.code.toLocaleLowerCase() === "escape") onCloseMovie();
        console.log("ok you pressed it.");
      }
      document.addEventListener("keydown", callback);

      return () => document.removeEventListener("keydown", callback);
    },
    [onCloseMovie],
  );

  return (
    <div className="details">
      <header>
        <button className="btn-back" onClick={onCloseMovie}>
          ←
        </button>
        <img
          src={movieData.Poster}
          alt={`Poster of Movie ${movieData.Title}`}
        />
        <div className="details-overview">
          <h2>{movieData.Title}</h2>
          <p>
            {movieData.Released} • {movieData.Runtime}
          </p>
          <p>{movieData.Genre}</p>
          <p>⭐ {movieData.imdbRating} IMDb rating</p>
        </div>
      </header>
      <section>
        <div className="rating">
          <StarRating maxRating={10} size={24} onSetRating={setUserRating} />
          {userRating ? (
            <button
              className="btn-add"
              onClick={() => onAddWatched(userRating)}
            >
              + Add to list
            </button>
          ) : (
            ""
          )}
        </div>
        <p>
          <em>{movieData.Plot}</em>
        </p>
        <p>Starring {movieData.Actors}</p>
        <p>{movieData.Director}</p>
      </section>
    </div>
  );
}

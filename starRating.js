import { useState } from "react";

const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};
const starsBox = { display: "flex" };

function StarRating({
  maxRating = 10,
  width = "48",
  height = "48",
  color = "#fcc419ff",
  className = "",
  // ratingsArr = ["Bad", "Average", "Good", "Better", "Awesome"],
}) {
  const textStyle = {
    lineHeight: "1",
    margin: "0px",
    color,
    // fontSize: "24px",
    fontSize: `${height / 1.5}px`,
  };
  const starStyle = {
    width: `${width}px`,
    height: `${height}px`,
    display: "block",
    cursor: "pointer",
  };

  let [tempRating, setTempRating] = useState(0);
  let [rating, setRating] = useState(0);
  let [isDisable, setIsDisable] = useState(true);

  return (
    <div className="rating">
      <div className={className} style={containerStyle}>
        <div style={starsBox}>
          {Array.from({ length: maxRating }, (_, i) => {
            return (
              <span
                key={i + 1}
                role="button"
                style={starStyle}
                onClick={() => {
                  setRating(i + 1);
                  setIsDisable(false);
                }}
                onMouseEnter={() => setTempRating(i + 1)}
                onMouseLeave={() => setTempRating(0)}
              >
                {tempRating < i + 1 && (rating < i + 1 || tempRating) ? (
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke={color}>
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="{2}"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
                    />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" height={height} width={width} fill={color} stroke={color}>
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                )}
              </span>
            );
          })}
        </div>
        <p style={textStyle}>{ratingsArr.length ? ratingsArr[tempRating - 1] || ratingsArr[rating - 1] || "" : tempRating || rating || ""}</p>
      </div>
      {!isDisable && <button class="btn-add">+ Add to list</button>}
    </div>
  );
}

export default StarRating;

// commit from office pc to check some thing on date 29 May 2026

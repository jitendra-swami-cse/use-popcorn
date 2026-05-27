const containerStyle = {
  display: "flex",
  alignItems: "center",
  gap: "16px",
};
const starsBox = { display: "flex" };

function StarRating({
  maxRating = 10,
  width = "48px",
  height = "48px",
  color = "#fcc419ff",
}) {
  const textStyle = {
    lineHeight: "1",
    margin: "0px",
    color,
    fontSize: `${height / 1.5}px`,
  };
  const starStyle = {
    width,
    height,
    display: "block",
    cursor: "pointer",
  };

  return (
    <div className="container" style={containerStyle}>
      <div style={starsBox}>
        {Array.from({ length: maxRating }, (_, i) => {
          return <span style={starStyle}>S{i}</span>;
        })}
      </div>
      <p style={textStyle}>{maxRating}</p>
      {/* <button class="btn-add">+ Add to list</button> */}
    </div>
  );
}

export default StarRating;

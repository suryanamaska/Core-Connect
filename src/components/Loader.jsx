import "./css/Loader.css";

// eslint-disable-next-line react/prop-types
const Loader = ({ run }) => {
  return (
    <div className={`${run ? "" : "hidden"}`}>
      <div className="loader">
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
        <div className="loader-square"></div>
      </div>
    </div>
  );
};

export default Loader;

import React from "react";
import spinner from "./spinner.gif";

const Spinner = ({ style }) => {
  return (
    <div>
      <img src={spinner} style={styles.spinner} alt="Loading..." />
    </div>
  );
};

const styles = {
  spinner: { width: "200px", margin: "auto", display: "block" },
};

export default Spinner;

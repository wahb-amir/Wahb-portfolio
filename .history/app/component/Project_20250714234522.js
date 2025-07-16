import React from "react";
import ImageSlider from "./ImageSlider";
const Project = () => {
  return (
    <div id="project-section">
      
      <ImageSlider
        images={[
          "/image1.jpeg",
          "/image1.jpeg",
          "/image1.jpeg",
        ]}
      />
    </div>
  );
};

export default Project;

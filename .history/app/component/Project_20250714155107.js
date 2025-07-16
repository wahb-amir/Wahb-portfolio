import React from "react";
import ImageSlider from "./ImageSlider";
const Project = () => {
  return (
    <div>
      Hi my name is Project
      <p>This is a placeholder for the Project component.</p>
      <p>Here you can add your project details.</p>
      <ImageSlider
        images={[
          "/public/image1.jpeg",
          "/public/image1.jpeg",
          "/image1.jpeg",
        ]}
      />
    </div>
  );
};

export default Project;

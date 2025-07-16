import React from "react";
import ImageSlider from "./ImageSlider";
const Project = () => {
  return (
    <div>
      Hi my name is Project
      <p>This is a placeholder for the Project component.</p>
      <p>Here you can add your project details.</p>
      <ImageSlider images={["/", "/path/to/image2.jpg", "/path/to/image3.jpg"]} />
    </div>
  );
};

export default Project;

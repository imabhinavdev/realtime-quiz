import Card from "@/components/Card";
import React from "react";

const HomePage = () => {
  return (
    <div className="w-full">
      <Card
        title="Take Quiz"
        desc="This is a quiz app where you can take a quiz and test your knowledge."
        btn="Start quiz"
        link="/login"
      />
    </div>
  );
};

export default HomePage;

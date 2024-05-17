import Card from "@/components/Card";
import React from "react";

const AdminPage = () => {
  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 gap-8">
      {CardData.map((card, index) => (
        <Card
          key={index}
          title={card.title}
          desc={card.desc}
          link={card.link}
          btn={card.btn}
        />
      ))}
    </div>
  );
};

export default AdminPage;

const CardData = [
  {
    title: "Manage Questions",
    desc: "You can manage questions here like adding, deleting, updating new questions.",
    link: "#",
    btn: "Click Me",
  },
  {
    title: "Control Quiz",
    desc: "You can control the quiz here like starting, stopping, and resetting the quiz.",
    link: "#",
    btn: "Click Me",
  },
  {
    title: "Check Leaderboard",
    desc: "You can check the leaderboard here to see the top scorers of the quiz.",
    link: "#",
    btn: "Click Me",
  },
];

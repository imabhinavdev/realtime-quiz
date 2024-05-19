import Link from "next/link";
import React from "react";

const AdminNavbar = () => {
  return (
    <div>
      {/* Admin Navbar */}
      <nav>
        <ul className="flex gap-4 my-2 mb-4 mx-1">
          {AdminData.map((item, index) => (
            <Link href={item.link} key={index} className="font-semibold">
              <li> {item.text} </li>
            </Link>
          ))}
        </ul>
      </nav>
    </div>
  );
};

export default AdminNavbar;

const AdminData = [
  {
    text: "Dashboard",
    link: "/admin",
  },
  {
    text: "Questions",
    link: "/admin/questions",
  },
  {
    text: "Quiz Control",
    link: "/admin/quiz",
  },
  {
    text: "Leaderboard",
    link: "/leaderboard",
  },
];

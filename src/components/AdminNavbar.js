import Link from "next/link";
import React from "react";

const AdminNavbar = () => {
  return (
    <div>
      {/* Admin Navbar */}
      <nav>
        <ul className="grid grid-cols-3 md:grid-cols-6 gap-4 my-2 mb-4 mx-1">
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
    link: "/mainhuadmin",
  },
  {
    text: "Questions",
    link: "/mainhuadmin/questions",
  },
  {
    text: "Quiz Control",
    link: "/mainhuadmin/quiz",
  },
  {
    text: "Leaderboard",
    link: "/leaderboard",
  },
];

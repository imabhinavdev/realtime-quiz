import AdminNavbar from "@/components/AdminNavbar";

export default function AdminLayout({ children }) {
  return (
    <div className="w-full">
      <AdminNavbar />
      {children}
    </div>
  );
}

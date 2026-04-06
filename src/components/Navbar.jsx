import { useAuth } from "../context/AuthContext";

const roleColors = {
  admin: { bg: "bg-indigo-500/10", text: "text-indigo-400", border: "border-indigo-500/20" },
  manager: { bg: "bg-purple-500/10", text: "text-purple-400", border: "border-purple-500/20" },
  user: { bg: "bg-emerald-500/10", text: "text-emerald-400", border: "border-emerald-500/20" },
};

const Navbar = ({ title }) => {
  const { user } = useAuth();
  const color = roleColors[user?.role] || roleColors.user;

  return (
    <header className="h-16 bg-gray-900 border-b border-gray-800 flex items-center justify-between px-6">
      {/* Page Title */}
      <h2 className="text-white font-semibold text-lg">{title}</h2>

      {/* Right Side */}
      <div className="flex items-center gap-3">
        {/* Role Badge */}
        <span className={`px-3 py-1 text-xs font-medium rounded-full border ${color.bg} ${color.text} ${color.border} capitalize`}>
          {user?.role}
        </span>

        {/* User Avatar */}
        <div className={`w-8 h-8 rounded-full ${color.bg} border ${color.border} flex items-center justify-center`}>
          <span className={`text-sm font-semibold ${color.text}`}>
            {user?.name?.charAt(0).toUpperCase()}
          </span>
        </div>

        {/* User Name */}
        <span className="text-gray-300 text-sm font-medium hidden md:block">
          {user?.name}
        </span>
      </div>
    </header>
  );
};

export default Navbar;
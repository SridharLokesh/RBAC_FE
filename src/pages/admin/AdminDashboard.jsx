import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import API from "../../api/axios";

const StatCard = ({ title, value, color, icon }) => (
  <div className="bg-gray-900 border border-gray-800 rounded-2xl p-6">
    <div className="flex items-center justify-between mb-4">
      <p className="text-gray-400 text-sm font-medium">{title}</p>
      <div className={`w-10 h-10 rounded-xl bg-${color}-500/10 border border-${color}-500/20 flex items-center justify-center`}>
        <svg className={`w-5 h-5 text-${color}-400`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={icon} />
        </svg>
      </div>
    </div>
    <p className="text-3xl font-bold text-white">{value}</p>
  </div>
);

const AdminDashboard = () => {
  const [stats, setStats] = useState({ managers: 0, users: 0, dashboards: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [m, u, d] = await Promise.all([
          API.get("/admin/managers"),
          API.get("/admin/users"),
          API.get("/admin/dashboards"),
        ]);
        setStats({
          managers: m.data.total,
          users: u.data.total,
          dashboards: d.data.total,
        });
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Layout title="Admin Dashboard">
      <div className="space-y-6">
        {/* Welcome */}
        <div className="bg-gradient-to-r from-indigo-600/20 to-purple-600/20 border border-indigo-500/20 rounded-2xl p-6">
          <h1 className="text-2xl font-bold text-white">Welcome back, Admin</h1>
          <p className="text-gray-400 mt-1">Here's what's happening in your system today.</p>
        </div>

        {/* Stats */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <StatCard title="Total Managers" value={stats.managers} color="indigo"
              icon="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
            <StatCard title="Total Users" value={stats.users} color="purple"
              icon="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            <StatCard title="Total Dashboards" value={stats.dashboards} color="emerald"
              icon="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </div>
        )}
      </div>
    </Layout>
  );
};

export default AdminDashboard;
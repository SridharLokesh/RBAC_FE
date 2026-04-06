import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import API from "../../api/axios";

const UserDashboard = () => {
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchDashboards = async () => {
      try {
        const { data } = await API.get("/user/dashboards");
        setDashboards(data.dashboards);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboards");
      } finally {
        setLoading(false);
      }
    };
    fetchDashboards();
  }, []);

  return (
    <Layout title="My Dashboards">
      <div className="space-y-5">
        <div className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 border border-emerald-500/20 rounded-2xl p-6">
          <h1 className="text-xl font-bold text-white">Welcome 👋</h1>
          <p className="text-gray-400 mt-1 text-sm">Here are the dashboards shared with you by your manager.</p>
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : dashboards.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl text-center py-16">
            <div className="w-14 h-14 bg-gray-800 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-sm">No dashboards available yet.</p>
            <p className="text-gray-600 text-xs mt-1">Your manager hasn't created any dashboards.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboards.map((d) => (
              <div key={d._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-emerald-500/30 transition">
                <div className="w-10 h-10 bg-emerald-500/20 border border-emerald-500/30 rounded-xl flex items-center justify-center mb-4">
                  <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{d.title}</h3>
                <p className="text-gray-500 text-xs line-clamp-2 mb-3">{d.description || "No description"}</p>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-full">
                    {d.managerId?.name || "Manager"}
                  </span>
                  <span className="text-gray-600 text-xs">{new Date(d.createdAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default UserDashboard;
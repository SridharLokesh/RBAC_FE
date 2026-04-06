import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import API from "../../api/axios";

const MyTeam = () => {
  const [teammates, setTeammates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data } = await API.get("/user/teammates");
        setTeammates(data.teammates);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load team");
      } finally {
        setLoading(false);
      }
    };
    fetchTeam();
  }, []);

  return (
    <Layout title="My Team">
      <div className="space-y-5">
        <div>
          <h1 className="text-xl font-bold text-white">My Team</h1>
          <p className="text-gray-500 text-sm mt-0.5">Users under the same manager as you</p>
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
        )}

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : teammates.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl text-center py-12 text-gray-500">
            No teammates found under your manager.
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {teammates.map((t) => (
              <div key={t._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-emerald-500/30 transition">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center">
                    <span className="text-emerald-400 font-bold text-lg">{t.name?.charAt(0).toUpperCase()}</span>
                  </div>
                  <div>
                    <p className="text-white font-semibold text-sm">{t.name}</p>
                    <p className="text-gray-500 text-xs">{t.email}</p>
                    <span className="mt-1 inline-block px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs rounded-full capitalize">
                      {t.role}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyTeam;
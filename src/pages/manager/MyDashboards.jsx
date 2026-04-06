import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import API from "../../api/axios";

const MyDashboards = () => {
  const [dashboards, setDashboards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ title: "", description: "" });
  const [error, setError] = useState("");

  const fetchDashboards = async () => {
    try {
      const { data } = await API.get("/manager/dashboards");
      setDashboards(data.dashboards);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchDashboards(); }, []);

  const openCreate = () => {
    setForm({ title: "", description: "" });
    setError("");
    setModalOpen(true);
  };

  const openEdit = (d) => {
    setForm({ _id: d._id, title: d.title, description: d.description });
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    try {
      if (form._id) {
        await API.put(`/manager/dashboards/${form._id}`, { title: form.title, description: form.description });
      } else {
        await API.post("/manager/dashboards", form);
      }
      setModalOpen(false);
      fetchDashboards();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this dashboard?")) return;
    try {
      await API.delete(`/manager/dashboards/${id}`);
      fetchDashboards();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title="My Dashboards">
      {modalOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
          <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-white font-semibold text-lg">{form._id ? "Edit Dashboard" : "Create Dashboard"}</h3>
              <button onClick={() => setModalOpen(false)} className="text-gray-500 hover:text-white transition">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            {error && <div className="mb-4 px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>}
            <div className="space-y-4">
              <input type="text" placeholder="Dashboard Title" value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition" />
              <textarea placeholder="Description (optional)" value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                rows={3}
                className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-purple-500 transition resize-none" />
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setModalOpen(false)}
                className="flex-1 px-4 py-2.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white text-sm transition">
                Cancel
              </button>
              <button onClick={handleSubmit} disabled={saving}
                className="flex-1 px-4 py-2.5 rounded-lg bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white text-sm font-medium transition flex items-center justify-center gap-2">
                {saving ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Save"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">My Dashboards</h1>
            <p className="text-gray-500 text-sm mt-0.5">Manage dashboards under your account</p>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-500 text-white text-sm font-medium rounded-lg transition shadow-lg shadow-purple-500/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Dashboard
          </button>
        </div>
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="w-8 h-8 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : dashboards.length === 0 ? (
          <div className="bg-gray-900 border border-gray-800 rounded-2xl text-center py-12 text-gray-500">
            No dashboards yet. Create one!
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {dashboards.map((d) => (
              <div key={d._id} className="bg-gray-900 border border-gray-800 rounded-2xl p-5 hover:border-purple-500/30 transition group">
                <div className="flex items-start justify-between mb-3">
                  <div className="w-10 h-10 bg-purple-500/20 border border-purple-500/30 rounded-xl flex items-center justify-center">
                    <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => openEdit(d)}
                      className="px-2.5 py-1 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 text-purple-400 text-xs rounded-lg transition">
                      Edit
                    </button>
                    <button onClick={() => handleDelete(d._id)}
                      className="px-2.5 py-1 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs rounded-lg transition">
                      Delete
                    </button>
                  </div>
                </div>
                <h3 className="text-white font-semibold text-sm mb-1">{d.title}</h3>
                <p className="text-gray-500 text-xs line-clamp-2">{d.description || "No description"}</p>
                <p className="text-gray-600 text-xs mt-3">{new Date(d.createdAt).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </Layout>
  );
};

export default MyDashboards;
import { useState, useEffect } from "react";
import Layout from "../../components/Layout";
import API from "../../api/axios";

const Modal = ({ title, onClose, onSubmit, form, setForm, loading }) => (
  <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 px-4">
    <div className="bg-gray-900 border border-gray-700 rounded-2xl p-6 w-full max-w-md shadow-2xl">
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-white font-semibold text-lg">{title}</h3>
        <button onClick={onClose} className="text-gray-500 hover:text-white transition">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="space-y-4">
        <input
          type="text" placeholder="Full Name" value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition"
        />
        <input
          type="email" placeholder="Email Address" value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition"
        />
        {!form._id && (
          <input
            type="password" placeholder="Password" value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="w-full bg-gray-800 border border-gray-700 text-white placeholder-gray-500 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:border-indigo-500 transition"
          />
        )}
      </div>
      <div className="flex gap-3 mt-6">
        <button onClick={onClose}
          className="flex-1 px-4 py-2.5 rounded-lg border border-gray-700 text-gray-400 hover:text-white hover:border-gray-600 text-sm transition">
          Cancel
        </button>
        <button onClick={onSubmit} disabled={loading}
          className="flex-1 px-4 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-800 text-white text-sm font-medium transition flex items-center justify-center gap-2">
          {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : "Save"}
        </button>
      </div>
    </div>
  </div>
);

const Managers = () => {
  const [managers, setManagers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");

  const fetchManagers = async () => {
    try {
      const { data } = await API.get("/admin/managers");
      setManagers(data.managers);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchManagers(); }, []);

  const openCreate = () => {
    setForm({ name: "", email: "", password: "" });
    setError("");
    setModalOpen(true);
  };

  const openEdit = (manager) => {
    setForm({ _id: manager._id, name: manager.name, email: manager.email });
    setError("");
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    setSaving(true);
    setError("");
    try {
      if (form._id) {
        await API.put(`/admin/managers/${form._id}`, { name: form.name, email: form.email });
      } else {
        await API.post("/admin/managers", form);
      }
      setModalOpen(false);
      fetchManagers();
    } catch (err) {
      setError(err.response?.data?.message || "Something went wrong");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this manager and all their users & dashboards?")) return;
    try {
      await API.delete(`/admin/managers/${id}`);
      fetchManagers();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <Layout title="Managers">
      {modalOpen && (
        <Modal
          title={form._id ? "Edit Manager" : "Create Manager"}
          onClose={() => setModalOpen(false)}
          onSubmit={handleSubmit}
          form={form} setForm={setForm}
          loading={saving}
        />
      )}
      <div className="space-y-5">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-white">Managers</h1>
            <p className="text-gray-500 text-sm mt-0.5">Manage all managers in the system</p>
          </div>
          <button onClick={openCreate}
            className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-medium rounded-lg transition shadow-lg shadow-indigo-500/20">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add Manager
          </button>
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm">{error}</div>
        )}

        {/* Table */}
        <div className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden">
          {loading ? (
            <div className="flex justify-center py-12">
              <div className="w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : managers.length === 0 ? (
            <div className="text-center py-12 text-gray-500">No managers found. Create one!</div>
          ) : (
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-800">
                  <th className="text-left px-6 py-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">Email</th>
                  <th className="text-left px-6 py-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">Created</th>
                  <th className="text-right px-6 py-4 text-gray-400 text-xs font-semibold uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800">
                {managers.map((m) => (
                  <tr key={m._id} className="hover:bg-gray-800/50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-indigo-500/20 border border-indigo-500/30 rounded-full flex items-center justify-center">
                          <span className="text-indigo-400 text-xs font-semibold">{m.name?.charAt(0).toUpperCase()}</span>
                        </div>
                        <span className="text-white text-sm font-medium">{m.name}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-400 text-sm">{m.email}</td>
                    <td className="px-6 py-4 text-gray-500 text-sm">{new Date(m.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => openEdit(m)}
                          className="px-3 py-1.5 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 text-indigo-400 text-xs rounded-lg transition">
                          Edit
                        </button>
                        <button onClick={() => handleDelete(m._id)}
                          className="px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 text-red-400 text-xs rounded-lg transition">
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default Managers;
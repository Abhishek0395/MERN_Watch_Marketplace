import { useEffect, useState } from "react";
import "./auth.css";
import { clearStoredUser } from "./authStorage";
import { ENDPOINTS, HOME_URL } from "./config";
import "./portal.css";

export default function AdminPortal({ user }) {
  const [pending, setPending] = useState([]);
  const [allWatches, setAllWatches] = useState([]);
  const [users, setUsers] = useState([]);
  const [status, setStatus] = useState("loading");
  const [message, setMessage] = useState("");

  const loadAll = () => {
    setStatus("loading");
    Promise.all([
      fetch(ENDPOINTS.adminPendingWatches).then((r) => r.json()),
      fetch(ENDPOINTS.adminAllWatches).then((r) => r.json()),
      fetch(ENDPOINTS.adminUsers).then((r) => r.json()),
    ])
      .then(([p, w, u]) => {
        setPending(p);
        setAllWatches(w);
        setUsers(u);
      })
      .finally(() => setStatus("ready"));
  };

  useEffect(loadAll, []);

  const handleApprove = async (id) => {
    await fetch(ENDPOINTS.adminApproveWatch(id), {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ adminId: user._id }),
    });
    loadAll();
  };

  const handleReject = async (id) => {
    await fetch(ENDPOINTS.adminRejectWatch(id), { method: "PATCH" });
    loadAll();
  };

  const handleDeleteWatch = async (id) => {
    if (!window.confirm("Delete this watch permanently?")) return;
    await fetch(ENDPOINTS.adminDeleteWatch(id), { method: "DELETE" });
    loadAll();
  };

  const handleDeleteUser = async (id) => {
    if (!window.confirm("Delete this user and all their listings?")) return;
    await fetch(ENDPOINTS.adminDeleteUser(id), { method: "DELETE" });
    loadAll();
  };

  const handleLogout = () => {
    clearStoredUser();
    window.location.href = HOME_URL;
  };

  return (
    <div className="portal-wrap">
      <div className="portal-header">
        <h1>Admin portal</h1>
        <button onClick={handleLogout}>Log out</button>
      </div>

      {message && <p className="empty-text">{message}</p>}
      {status === "loading" && <p className="empty-text">Loading…</p>}

      <div className="portal-section">
        <h2>Pending watches ({pending.length})</h2>
        {pending.length === 0 ? (
          <p className="empty-text">Nothing waiting for review.</p>
        ) : (
          <table className="portal-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Seller</th>
                <th>Price</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pending.map((w) => (
                <tr key={w._id}>
                  <td>{w.title}</td>
                  <td>{w.seller?.name || w.seller?.email}</td>
                  <td>${w.price?.toLocaleString()}</td>
                  <td>
                    <button
                      className="action-btn approve"
                      onClick={() => handleApprove(w._id)}
                    >
                      Approve
                    </button>
                    <button
                      className="action-btn reject"
                      onClick={() => handleReject(w._id)}
                    >
                      Reject
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      <div className="portal-section">
        <h2>All watches ({allWatches.length})</h2>
        <table className="portal-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Seller</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {allWatches.map((w) => (
              <tr key={w._id}>
                <td>{w.title}</td>
                <td>{w.seller?.name || w.seller?.email}</td>
                <td>
                  <span className={`pill ${w.status}`}>{w.status}</span>
                </td>
                <td>
                  <button
                    className="action-btn danger"
                    onClick={() => handleDeleteWatch(w._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="portal-section">
        <h2>Users ({users.length})</h2>
        <table className="portal-table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u._id}>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td>{u.role}</td>
                <td>
                  <button
                    className="action-btn danger"
                    onClick={() => handleDeleteUser(u._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

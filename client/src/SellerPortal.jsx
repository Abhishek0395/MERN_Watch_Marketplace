import { useEffect, useState } from "react";
import "./auth.css";
import { clearStoredUser } from "./authStorage";
import { ENDPOINTS, HOME_URL } from "./config";
import "./portal.css";

const emptyForm = {
  title: "",
  brand: "",
  description: "",
  price: "",
  condition: "Good",
  images: "",
};

export default function SellerPortal({ user }) {
  const [myWatches, setMyWatches] = useState([]);
  const [status, setStatus] = useState("loading");
  const [form, setForm] = useState(emptyForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const loadMine = () => {
    setStatus("loading");
    fetch(ENDPOINTS.allWatches)
      .then((res) => res.json())
      .then((all) =>
        setMyWatches(
          all.filter(
            (w) => w.seller === user._id || w.seller?._id === user._id,
          ),
        ),
      )
      .finally(() => setStatus("ready"));
  };

  useEffect(loadMine, [user._id]);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await fetch(ENDPOINTS.sellerCreateWatch, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: user._id,
          title: form.title,
          brand: form.brand,
          description: form.description,
          price: Number(form.price),
          condition: form.condition,
          images: form.images
            ? form.images.split(",").map((s) => s.trim())
            : [],
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not list watch");
      setForm(emptyForm);
      loadMine();
    } catch (err) {
      setError(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleLogout = () => {
    clearStoredUser();
    window.location.href = HOME_URL;
  };

  return (
    <div className="portal-wrap">
      <div className="portal-header">
        <h1>Seller portal</h1>
        <button onClick={handleLogout}>Log out</button>
      </div>

      <div className="portal-section">
        <h2>List a new watch</h2>
        <form className="portal-form" onSubmit={handleSubmit}>
          {error && <div className="auth-error">{error}</div>}
          <label>
            Title
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Brand
            <input
              name="brand"
              value={form.brand}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Description
            <textarea
              name="description"
              rows={3}
              value={form.description}
              onChange={handleChange}
            />
          </label>
          <label>
            Price (USD)
            <input
              name="price"
              type="number"
              min="0"
              value={form.price}
              onChange={handleChange}
              required
            />
          </label>
          <label>
            Condition
            <select
              name="condition"
              value={form.condition}
              onChange={handleChange}
            >
              <option>New</option>
              <option>Like New</option>
              <option>Excellent</option>
              <option>Good</option>
              <option>Fair</option>
            </select>
          </label>
          <label>
            Image URLs (comma separated)
            <input
              name="images"
              value={form.images}
              onChange={handleChange}
              placeholder="https://…, https://…"
            />
          </label>
          <button type="submit" disabled={submitting}>
            {submitting ? "Submitting…" : "Submit for approval"}
          </button>
        </form>
      </div>

      <div className="portal-section">
        <h2>Your listings</h2>
        {status === "loading" && <p className="empty-text">Loading…</p>}
        {status === "ready" && myWatches.length === 0 && (
          <p className="empty-text">You haven&apos;t listed anything yet.</p>
        )}
        {myWatches.length > 0 && (
          <table className="portal-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Price</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {myWatches.map((w) => (
                <tr key={w._id}>
                  <td>{w.title}</td>
                  <td>${w.price?.toLocaleString()}</td>
                  <td>
                    <span className={`pill ${w.status}`}>{w.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

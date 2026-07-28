import { useEffect, useState } from "react";
import "./auth.css";
import { clearStoredUser } from "./authStorage";
import { ENDPOINTS, HOME_URL } from "./config";
import "./portal.css";

export default function BuyerPortal({ user }) {
  const [watches, setWatches] = useState([]);
  const [purchases, setPurchases] = useState([]);
  const [status, setStatus] = useState("loading");
  const [buyingId, setBuyingId] = useState(null);
  const [message, setMessage] = useState("");

  const loadAvailable = () => {
    fetch(ENDPOINTS.allWatches)
      .then((res) => res.json())
      .then((all) => setWatches(all.filter((w) => w.status === "approved")))
      .catch(() => setMessage("Could not load watches."));
  };

  const loadPurchases = () => {
    fetch(ENDPOINTS.userById(user._id))
      .then((res) => res.json())
      .then((freshUser) => {
        const ids = freshUser.purchasedWatches || [];
        return Promise.all(
          ids.map((id) => fetch(ENDPOINTS.watchById(id)).then((r) => r.json())),
        );
      })
      .then(setPurchases)
      .catch(() => {});
  };

  useEffect(() => {
    Promise.all([loadAvailable(), loadPurchases()]).finally(() =>
      setStatus("ready"),
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleBuy = async (watchId) => {
    setBuyingId(watchId);
    setMessage("");
    try {
      const res = await fetch(ENDPOINTS.buyWatch(watchId), {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Purchase failed");
      setMessage("Purchase successful.");
      loadAvailable();
      loadPurchases();
    } catch (err) {
      setMessage(err.message);
    } finally {
      setBuyingId(null);
    }
  };

  const handleLogout = () => {
    clearStoredUser();
    window.location.href = HOME_URL;
  };

  return (
    <div className="portal-wrap">
      <div className="portal-header">
        <h1>Buyer portal</h1>
        <button onClick={handleLogout}>Log out</button>
      </div>

      {message && <p className="empty-text">{message}</p>}

      <div className="portal-section">
        <h2>Available watches</h2>
        {status === "loading" && <p className="empty-text">Loading…</p>}
        {status === "ready" && watches.length === 0 && (
          <p className="empty-text">Nothing available right now.</p>
        )}
        <div className="watch-grid">
          {watches.map((w) => (
            <div className="watch-tile" key={w._id}>
              <h4>{w.title}</h4>
              <p>
                {w.brand} · {w.condition} · ${w.price?.toLocaleString()}
              </p>
              <button
                className="action-btn approve"
                onClick={() => handleBuy(w._id)}
                disabled={buyingId === w._id}
              >
                {buyingId === w._id ? "Buying…" : "Buy"}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="portal-section">
        <h2>Your purchases</h2>
        {purchases.length === 0 ? (
          <p className="empty-text">No purchases yet.</p>
        ) : (
          <div className="watch-grid">
            {purchases.map((w) => (
              <div className="watch-tile" key={w._id}>
                <h4>{w.title}</h4>
                <p>
                  {w.brand} · ${w.price?.toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

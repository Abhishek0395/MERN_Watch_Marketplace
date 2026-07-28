import { useEffect, useState } from "react";
import { clearStoredUser, getStoredUser, setStoredUser } from "./authStorage";
import { ENDPOINTS, HOME_URL } from "./config";

export default function AuthGate({ children, allowedRole }) {
  const [status, setStatus] = useState("checking");
  const [user, setUser] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const uid = params.get("uid");

    const settle = (fetchedUser) => {
      if (!fetchedUser || (allowedRole && fetchedUser.role !== allowedRole)) {
        clearStoredUser();
        setStatus("denied");
        return;
      }
      setStoredUser(fetchedUser);
      setUser(fetchedUser);
      setStatus("ok");
    };

    if (uid) {
      fetch(ENDPOINTS.userById(uid))
        .then((res) => (res.ok ? res.json() : Promise.reject()))
        .then(settle)
        .catch(() => setStatus("denied"));
    } else {
      const stored = getStoredUser();
      if (!stored) {
        setStatus("denied");
      } else {
        settle(stored);
      }
    }
  }, [allowedRole]);

  if (status === "checking")
    return <p style={{ padding: 40 }}>Checking your session…</p>;
  if (status === "denied") {
    window.location.href = HOME_URL;
    return null;
  }
  return children(user);
}

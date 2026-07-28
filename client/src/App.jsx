import { BrowserRouter, Route, Routes } from "react-router-dom";
import AdminPortal from "./AdminPortal";
import AuthGate from "./AuthGate";
import BuyerPortal from "./BuyerPortal";
import SellerPortal from "./SellerPortal";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin"
          element={
            <AuthGate allowedRole="admin">
              {(user) => <AdminPortal user={user} />}
            </AuthGate>
          }
        />
        <Route
          path="/seller"
          element={
            <AuthGate allowedRole="seller">
              {(user) => <SellerPortal user={user} />}
            </AuthGate>
          }
        />
        <Route
          path="/buyer"
          element={
            <AuthGate allowedRole="user">
              {(user) => <BuyerPortal user={user} />}
            </AuthGate>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

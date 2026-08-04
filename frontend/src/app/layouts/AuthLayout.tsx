import { Outlet } from "react-router-dom";

export default function AuthLayout() {
  return (
    <main className="min-h-screen bg-slate-50">
      <div className="flex min-h-screen">
        <Outlet />
      </div>
    </main>
  );
}
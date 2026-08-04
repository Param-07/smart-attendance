import { ScanFace } from "lucide-react";

import Card from "@/shared/components/Card";

import BrandingPanel from "./components/BrandingPanel";
import LoginForm from "./components/LoginForm";

export default function LoginPage() {
  return (
    <>
      <BrandingPanel />

      <section className="flex flex-1 items-center justify-center p-6 sm:p-8 lg:p-12">
        <div className="w-full max-w-md">
          {/* Mobile Branding */}
          <div className="mb-8 flex flex-col items-center text-center lg:hidden">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg">
              <ScanFace size={30} />
            </div>

            <h1 className="text-3xl font-bold tracking-tight text-slate-900">
              Smart Attendance
            </h1>

            <p className="mt-2 text-sm text-slate-500">
              AI Powered Teacher Attendance Management
              System
            </p>
          </div>

          <Card className="rounded-2xl p-8 shadow-[0_12px_30px_rgba(15,23,42,.08)] sm:p-10">
            <div className="mb-8 text-center">
              <h2 className="text-3xl font-bold tracking-tight text-slate-900">
                Welcome Back
              </h2>

              <p className="mt-2 text-sm text-slate-500">
                Sign in to continue
              </p>
            </div>

            <LoginForm />
          </Card>
        </div>
      </section>
    </>
  );
}
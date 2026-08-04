import {
  MapPinned,
  ScanFace,
  ShieldCheck,
} from "lucide-react";

const FEATURES = [
  {
    icon: ScanFace,
    title: "Face Recognition",
    description: "Secure AI-based teacher verification",
  },
  {
    icon: MapPinned,
    title: "GPS Verification",
    description: "Location-aware attendance tracking",
  },
  {
    icon: ShieldCheck,
    title: "Fast & Secure",
    description: "Enterprise-grade authentication",
  },
];

export default function BrandingPanel() {
  return (
    <aside className="relative hidden lg:flex lg:w-2/5 xl:w-[42%]">
      <div className="relative flex h-full flex-col justify-between overflow-hidden bg-linear-to-br from-blue-600 via-blue-700 to-blue-900 p-8 xl:p-12 text-white">
        {/* Background Decoration */}
        <div className="absolute -left-24 -top-24 h-72 w-72 rounded-full bg-white/10 blur-3xl" />
        <div className="absolute -bottom-28 -right-28 h-80 w-80 rounded-full bg-cyan-300/10 blur-3xl" />

        <div className="relative z-10">
          {/* Logo */}
          <div className="mb-12 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-sm">
            <ScanFace
              size={34}
              strokeWidth={2.2}
            />
          </div>

          {/* Heading */}
          <div className="space-y-4">
            <h1 className="text-5xl font-extrabold tracking-tight text-white">
              Smart
              <br />
              Attendance
            </h1>

            <p className="max-w-sm text-lg leading-8 text-blue-100">
              AI Powered Teacher Attendance Management
              System
            </p>
          </div>

          <div className="my-10 h-px w-20 bg-white/20" />

          {/* Features */}
          <div className="space-y-6">
            {FEATURES.map(
              ({
                icon: Icon,
                title,
                description,
              }) => (
                <div
                  key={title}
                  className="flex items-start gap-4"
                >
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10">
                    <Icon size={22} />
                  </div>

                  <div>
                    <h3 className="font-semibold">
                      {title}
                    </h3>

                    <p className="mt-1 text-sm leading-6 text-blue-100">
                      {description}
                    </p>
                  </div>
                </div>
              ),
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 border-t border-white/10 pt-8">
          <p className="text-sm italic text-blue-100">
            "Making attendance effortless."
          </p>

          <p className="mt-2 text-xs text-blue-200">
            Smart Attendance • Version 1.0
          </p>
        </div>
      </div>
    </aside>
  );
}
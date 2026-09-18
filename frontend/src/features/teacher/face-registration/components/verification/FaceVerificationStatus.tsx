import {
  Check,
  Loader2,
  ScanFace,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

import type {
  FaceVerificationStatusProps,
  FaceVerificationStep,
} from "./FaceVerificationStatus.types";

const steps: Array<{
  id: FaceVerificationStep;
  label: string;
  icon: typeof ScanFace;
}> = [
  {
    id: "capture",
    label: "Capture",
    icon: ScanFace,
  },
  {
    id: "face_detection",
    label: "Face detected",
    icon: ScanFace,
  },
  {
    id: "liveness",
    label: "Liveness check",
    icon: ShieldCheck,
  },
  {
    id: "processing",
    label: "Secure processing",
    icon: Sparkles,
  },
];

export default function FaceVerificationStatus({
  currentStep,
}: FaceVerificationStatusProps) {
  const currentIndex = steps.findIndex(
    (step) => step.id === currentStep,
  );

  return (
    <section
      aria-label="Face verification progress"
      className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
    >
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-50 text-blue-700">
          <ShieldCheck size={20} />
        </div>

        <div>
          <h2 className="text-sm font-semibold text-slate-900">
            Verification status
          </h2>

          <p className="text-xs text-slate-500">
            Your image will be verified securely before registration.
          </p>
        </div>
      </div>

      <ol className="grid gap-2 sm:grid-cols-4">
        {steps.map((step, index) => {
          const Icon = step.icon;

          const completed =
            currentIndex >= 0 &&
            index < currentIndex;

          const active =
            currentIndex >= 0 &&
            index === currentIndex;

          return (
            <li
              key={step.id}
              className="flex items-center gap-2 rounded-lg bg-slate-50 px-3 py-2"
            >
              <span
                className={[
                  "flex h-7 w-7 shrink-0 items-center justify-center rounded-full",
                  completed || active
                    ? "bg-blue-600 text-white"
                    : "bg-slate-200 text-slate-500",
                ].join(" ")}
              >
                {completed ? (
                  <Check size={15} />
                ) : active ? (
                  <Loader2
                    size={15}
                    className="animate-spin"
                  />
                ) : (
                  <Icon size={15} />
                )}
              </span>

              <span className="text-xs font-medium text-slate-600">
                {step.label}
              </span>
            </li>
          );
        })}
      </ol>
    </section>
  );
}
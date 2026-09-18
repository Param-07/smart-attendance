import {
  Check,
  ChevronDown,
  Lightbulb,
  LockKeyhole,
} from "lucide-react";
import { useState } from "react";

import Card from "@/shared/components/Card/Card";

import type { FaceRegistrationInstructionsProps } from "./FaceRegistrationInstructions.types";

const checklist = [
  "Look directly at the camera",
  "Keep your face clearly visible",
  "Use good lighting",
  "Make sure only you are in the frame",
  "Stay still during capture",
];

const captureTips = [
  {
    title: "Lighting",
    description:
      "Face a light source and avoid strong light directly behind you.",
  },
  {
    title: "Position",
    description:
      "Keep your head upright and position your face inside the camera guide.",
  },
  {
    title: "Face visibility",
    description:
      "Remove sunglasses, masks, or anything that covers your face.",
  },
  {
    title: "Background",
    description:
      "Use a simple background and make sure other people are not visible.",
  },
  {
    title: "Keep the phone steady",
    description:
      "Hold your phone steady while taking the registration photo.",
  },
];

export default function FaceRegistrationInstructions({
  disabled = false,
}: FaceRegistrationInstructionsProps) {
  const [showTips, setShowTips] = useState(false);

  return (
    <div
      className={`space-y-4 ${
        disabled ? "pointer-events-none opacity-60" : ""
      }`}
    >
      {/* Before you begin */}
      <Card className="p-4 sm:p-5">
        <div className="mb-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Before you begin
          </h2>

          <p className="mt-1 text-xs leading-5 text-slate-500">
            Follow these simple steps for a clear registration photo.
          </p>
        </div>

        <div className="space-y-2.5">
          {checklist.map((item) => (
            <div
              key={item}
              className="flex items-center gap-3"
            >
              <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-50 text-emerald-600">
                <Check
                  size={14}
                  strokeWidth={2.5}
                  aria-hidden="true"
                />
              </span>

              <span className="text-sm text-slate-700">
                {item}
              </span>
            </div>
          ))}
        </div>

        {/* Expandable tips */}
        <button
          type="button"
          onClick={() => setShowTips((current) => !current)}
          aria-expanded={showTips}
          className="mt-4 flex min-h-11 w-full items-center justify-between rounded-lg px-2 text-left text-sm font-medium text-blue-700 transition hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          <span className="flex items-center gap-2">
            <Lightbulb size={17} aria-hidden="true" />
            Capture tips
          </span>

          <ChevronDown
            size={18}
            aria-hidden="true"
            className={`transition-transform duration-200 ${
              showTips ? "rotate-180" : ""
            }`}
          />
        </button>

        {showTips && (
          <div className="mt-2 space-y-2 border-t border-slate-100 pt-3">
            {captureTips.map((tip) => (
              <div
                key={tip.title}
                className="rounded-lg bg-slate-50 px-3 py-2.5"
              >
                <p className="text-xs font-semibold text-slate-700">
                  {tip.title}
                </p>

                <p className="mt-0.5 text-xs leading-5 text-slate-500">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        )}
      </Card>

      {/* Why this matters */}
      <Card className="border-blue-100 bg-blue-50/60 p-4 sm:p-5">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-blue-700 shadow-sm">
            <Lightbulb
              size={18}
              aria-hidden="true"
            />
          </div>

          <div>
            <h2 className="text-sm font-semibold text-slate-900">
              Why does this matter?
            </h2>

            <p className="mt-1 text-xs leading-5 text-slate-600">
              A clear, front-facing photo helps the system create
              a reliable face profile for attendance verification.
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
}
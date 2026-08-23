import {
  Check,
  LoaderCircle,
} from "lucide-react";

interface VerificationProgressProps {
  requiresLiveness: boolean;
  requiresFace: boolean;
}

export default function VerificationProgress({
  requiresLiveness,
  requiresFace,
}: VerificationProgressProps) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="text-sm font-semibold text-slate-900">
        Verifying attendance
      </p>

      <p className="mt-1 text-xs text-slate-500">
        Please keep this screen open while we
        verify your attendance.
      </p>

      <div className="mt-4 space-y-3">
        {requiresLiveness && (
          <VerificationStep
            label="Liveness verification"
            description="Checking that the selfie is from a live person."
            loading
          />
        )}

        {requiresFace && (
          <VerificationStep
            label="Face verification"
            description="Matching your face with your registered profile."
            loading
          />
        )}
      </div>
    </div>
  );
}

interface VerificationStepProps {
  label: string;
  description: string;
  loading?: boolean;
}

function VerificationStep({
  label,
  description,
  loading = false,
}: VerificationStepProps) {
  return (
    <div className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-blue-600">
        {loading ? (
          <LoaderCircle
            size={18}
            className="animate-spin"
          />
        ) : (
          <Check size={18} />
        )}
      </div>

      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-900">
          {label}
        </p>

        <p className="mt-0.5 text-xs text-slate-500">
          {description}
        </p>
      </div>
    </div>
  );
}
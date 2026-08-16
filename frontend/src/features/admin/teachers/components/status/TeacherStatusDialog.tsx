import {
  AlertTriangle,
  UserCheck,
  UserX,
  X,
} from "lucide-react";

import type { TeacherStatusDialogProps } from "./TeacherStatusDialog.types";

export default function TeacherStatusDialog({
  teacher,
  isOpen,
  onClose,
  onConfirm,
  isSubmitting = false,
}: TeacherStatusDialogProps) {
  if (!isOpen) {
    return null;
  }

  const isActive =
    teacher.status === "ACTIVE";

  const actionLabel = isActive
    ? "Deactivate"
    : "Activate";

  const fullName = [
    teacher.firstName,
    teacher.middleName,
    teacher.lastName,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className="fixed inset-0 z-200 flex items-center justify-center bg-slate-900/40 p-4"
      role="presentation"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="teacher-status-dialog-title"
        className="
          w-full
          max-w-md
          overflow-hidden
          rounded-2xl
          border
          border-slate-200
          bg-white
          shadow-xl
        "
      >
        {/* Header */}

        <div className="flex items-start justify-between px-6 pt-6">
          <div className="flex items-center gap-3">
            <div
              className={
                isActive
                  ? "flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600"
                  : "flex h-10 w-10 items-center justify-center rounded-full bg-emerald-50 text-emerald-600"
              }
            >
              {isActive ? (
                <UserX size={20} />
              ) : (
                <UserCheck size={20} />
              )}
            </div>

            <div>
              <h2
                id="teacher-status-dialog-title"
                className="text-lg font-semibold text-slate-900"
              >
                {actionLabel} Teacher
              </h2>

              <p className="mt-0.5 text-sm text-slate-500">
                {teacher.employeeCode}
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            aria-label="Close dialog"
            className="
              flex
              h-8
              w-8
              items-center
              justify-center
              rounded-lg
              text-slate-400
              transition-colors
              hover:bg-slate-100
              hover:text-slate-700
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}

        <div className="px-6 py-6">
          <div className="flex gap-3 rounded-xl bg-slate-50 p-4">
            <AlertTriangle
              size={18}
              className="mt-0.5 shrink-0 text-slate-500"
            />

            <div>
              <p className="text-sm font-medium text-slate-800">
                {actionLabel}{" "}
                <span className="font-semibold">
                  {fullName}
                </span>
                ?
              </p>

              <p className="mt-1.5 text-sm leading-5 text-slate-500">
                {isActive
                  ? "The teacher will no longer be able to use the attendance system until their account is activated again."
                  : "The teacher will be able to use the attendance system again after activation."}
              </p>
            </div>
          </div>
        </div>

        {/* Actions */}

        <div className="flex justify-end gap-3 border-t border-slate-200 px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            disabled={isSubmitting}
            className="
              rounded-lg
              border
              border-slate-200
              bg-white
              px-4
              py-2.5
              text-sm
              font-medium
              text-slate-700
              transition-colors
              hover:bg-slate-50
              disabled:cursor-not-allowed
              disabled:opacity-50
            "
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={() => onConfirm(teacher)}
            disabled={isSubmitting}
            className={`
              rounded-lg
              px-4
              py-2.5
              text-sm
              font-medium
              text-white
              transition-colors
              disabled:cursor-not-allowed
              disabled:opacity-60
              ${
                isActive
                  ? "bg-red-600 hover:bg-red-700"
                  : "bg-emerald-600 hover:bg-emerald-700"
              }
            `}
          >
            {isSubmitting
              ? "Updating..."
              : actionLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
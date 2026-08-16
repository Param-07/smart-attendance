interface TeacherAdditionalFormProps {
  remarks: string;

  onRemarksChange: (
    value: string,
  ) => void;
}

export default function TeacherAdditionalForm({
  remarks,
  onRemarksChange,
}: TeacherAdditionalFormProps) {
  return (
    <section className="space-y-5">
      <div>
        <h2 className="text-base font-semibold text-slate-900">
          Additional Information
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          Add any optional remarks about the
          teacher.
        </p>
      </div>

      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="remarks"
          className="text-sm font-medium text-slate-700"
        >
          Remarks
        </label>

        <textarea
          id="remarks"
          value={remarks}
          onChange={(event) =>
            onRemarksChange(
              event.target.value,
            )
          }
          placeholder="Enter any relevant remarks..."
          rows={4}
          className="
            w-full
            resize-y
            rounded-lg
            border
            border-gray-300
            bg-white
            px-3
            py-2.5
            text-sm
            text-gray-900
            placeholder:text-gray-400
            transition-colors
            focus:border-blue-600
            focus:outline-none
            focus:ring-2
            focus:ring-blue-600/20
          "
        />
      </div>
    </section>
  );
}
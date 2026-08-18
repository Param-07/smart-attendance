import { useState } from "react";

import Card from "@/shared/components/Card";

import {
  CheckCircle2,
  Expand,
  LogOut,
  User,
} from "lucide-react";

import type { Attendance } from "../../Attendance.types";

interface AttendanceSelfieCardProps {
  attendance: Attendance;
}

function formatTime(
  value: string | null | undefined,
): string {
  if (!value) {
    return "—";
  }

  return new Date(value).toLocaleTimeString(
    "en-US",
    {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    },
  );
}

export default function AttendanceSelfieCard({
  attendance,
}: AttendanceSelfieCardProps) {

  const [
    selectedSelfie,
    setSelectedSelfie,
  ] = useState<"checkIn" | "checkOut">(
    "checkIn",
  );

  const hasCheckOutSelfie =
    Boolean(attendance.checkOutUrl);

  const showingCheckOut =
    selectedSelfie === "checkOut" &&
    hasCheckOutSelfie;

  const mainImage =
    showingCheckOut
      ? attendance.checkOutUrl
      : attendance.checkInUrl;

  const mainTime =
    showingCheckOut
      ? attendance.checkOutTime
      : attendance.checkInTime;

  const mainTitle =
    showingCheckOut
      ? "Check-out Selfie"
      : "Check-in Selfie";


  const alternateImage =
    showingCheckOut
      ? attendance.checkInUrl
      : attendance.checkOutUrl;

  const alternateTitle =
    showingCheckOut
      ? "Check-in Selfie"
      : "Check-out Selfie";


  const alternateTime =
    showingCheckOut
      ? attendance.checkInTime
      : attendance.checkOutTime;


  const handleSwitch = () => {
    if (!alternateImage) {
      return;
    }

    setSelectedSelfie(
      showingCheckOut
        ? "checkIn"
        : "checkOut",
    );
  };


  return (
    <Card
      className="
        overflow-hidden
        rounded-2xl
        border
        border-border
        bg-surface
        shadow-sm
      "
    >

      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          border-b
          border-border
          bg-surface
          p-4
        "
      >

        <h2
          className="
            text-lg
            font-semibold
            text-slate-900
          "
        >
          {mainTitle}
        </h2>

        <button
          type="button"
          className="
            rounded-full
            p-2
            text-slate-400
            transition-colors
            hover:bg-slate-100
            hover:text-slate-700
          "
          title="Expand Image"
        >
          <Expand size={17} />
        </button>

      </div>


      {/* Main image */}

      <div
        className="
          relative
          aspect-4/5
          w-full
          overflow-hidden
          bg-slate-100
        "
      >

        {mainImage ? (
          <img
            src={mainImage}
            alt={mainTitle}
            className="
              h-full
              w-full
              object-cover
            "
          />
        ) : (
          <div
            className="
              absolute
              inset-0
              flex
              flex-col
              items-center
              justify-center
              px-6
              text-center
            "
          >
            <User
              size={40}
              className="text-slate-300"
            />

            <p
              className="
                mt-3
                text-sm
                text-slate-500
              "
            >
              {showingCheckOut
                ? "No check-out selfie captured"
                : "No check-in selfie captured"}
            </p>
          </div>
        )}


        {/* Verification badge */}

        <div
          className="
            absolute
            bottom-0
            left-0
            right-0
            bg-linear-to-t
            from-black/70
            to-transparent
            p-4
          "
        >

          <div
            className="
              inline-flex
              items-center
              gap-2
              rounded-full
              border
              border-white/20
              bg-black/30
              px-3
              py-1.5
              text-xs
              font-medium
              text-white
              backdrop-blur-sm
            "
          >

            <CheckCircle2 size={14} />

            {mainTime
              ? `Verified at ${formatTime(
                  mainTime,
                )}`
              : "Not verified"}

          </div>

        </div>

      </div>


      {/* Alternate selfie */}

      <button
        type="button"
        disabled={!alternateImage}
        onClick={handleSwitch}
        className="
          flex
          w-full
          items-center
          gap-3
          border-t
          border-border
          bg-slate-50
          p-4
          text-left
          transition-colors
          hover:bg-slate-100
          disabled:cursor-default
          disabled:hover:bg-slate-50
        "
      >

        <div
          className="
            flex
            h-12
            w-12
            shrink-0
            items-center
            justify-center
            overflow-hidden
            rounded-lg
            border
            border-border
            bg-white
          "
        >

          {alternateImage ? (
            <img
              src={alternateImage}
              alt={alternateTitle}
              className="
                h-full
                w-full
                object-cover
              "
            />
          ) : (
            <LogOut
              size={19}
              className="text-slate-400"
            />
          )}

        </div>

        <div>

          <p
            className="
              text-xs
              font-medium
              text-slate-500
            "
          >
            {alternateTitle}
          </p>

          <p
            className="
              mt-0.5
              text-sm
              text-slate-700
            "
          >
            {alternateImage
              ? "Click to view"
              : alternateTime
                ? "Not captured (manual correction)"
                : "Pending check-out"}
          </p>

        </div>

      </button>

    </Card>
  );
}
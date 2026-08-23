import { useState } from "react";

import { useCheckIn } from "../hooks/useCheckIn";

import LocationCapture from "./LocationCapture";
import SelfieCapture from "./SelfieCapture";

import type { LocationData, CheckInFlowProps, CheckInState } from "./flow.types";
import VerificationProgress from "./VerificationProgress";


export default function CheckInFlow({
    configuration,
    onSuccess,
    onError,
    onCancel,
}: CheckInFlowProps) {
    const CheckInMutation = useCheckIn();

    const [location, setLocation] = useState<LocationData | null>(null);
    const [selfie, setSelfie] = useState<File | null>(null);
    const [checkInState, setCheckInstate] = useState<CheckInState>("IDLE")

    const requireGps = configuration.require_check_in_gps;
    const requireSelfie = configuration.require_check_in_face;
    const requireLiveness = configuration.require_liveness;

    const handleLocation = (
        value: LocationData,
    ) => {
        setLocation(value);
    }

    const handleSelfie = (
        value: File
    ) => {
        setSelfie(value);
    }

    const handleCheckIn = () => {
        setCheckInstate("VERIFYING")
        CheckInMutation.mutate(
            {
                payload: {
                    latitude: location?.latitude.toString() ?? null,
                    longitude: location?.longitude.toString() ?? null,
                    accuracy: location?.accuracy.toString() ?? null,
                },
                selfie,
            },
            {
                onSuccess: () => {
                    setCheckInstate("SUCCESS")
                    onSuccess?.()
                },

                onError: () => {
                    setCheckInstate("ERROR")
                    onError?.()
                }
            },
        );
    };

    const canSubmit = (!requireGps || location !== null) &&
                      (!requireSelfie || selfie !== null) &&
                      !CheckInMutation.isPending;
    
    return (
        <div className="space-y-4">
            {/* Flow Header */}

            <section>
                <p className="text-sm font-medium txt-slate-500">
                    Check in
                </p>

                <h2 className="mt-1 text-xl font-bold text-slate-900">
                    Verify your attendance
                </h2>

                <p className="mt-1 text-sm text-slate-500">
                    Complete the required verification steps
                    before checking in.
                </p>
            </section>

            {/* GPS */}

            {requireGps && (
                <LocationCapture
                    onLocation={handleLocation}
                />
            )}

            {requireSelfie && (
                <SelfieCapture
                    onCapture={handleSelfie}
                />
            )}

            {/* Current Location */}

            {location && (
                <div className="rounded-2xl border border-green-100 bg-green-50 p-4">
                    <p className="text-sm font-medium text-green-500">
                        Location Verified
                    </p>

                    <p className="mt-1 text-xs text-green-700">
                        Accuracy: {" "}
                        {Math.round(location.accuracy)}m
                    </p>
                </div>
            )}

            {requireSelfie && (
                <div className="rounded-2xl border border-slate-200 bg-white p-5">
                    <p className="text-sm font-medium text-slate-900">
                        Face verification
                    </p>

                    <p className="mt-1 text-sm text-slate-500">
                        Camera verification will be completed here.
                    </p>
                </div>
            )}

            {checkInState === "VERIFYING" && (
                <VerificationProgress
                    requiresLiveness={requireLiveness}
                    requiresFace={requireSelfie}
                />
            )}
            {/* Errors */}

            {CheckInMutation.isError && (
                <div className="rounded-xl bg-red-50 p-3">
                    <p className="text-sm text-red-600">
                        Unable to check in. Please try again.
                    </p>
                </div>
            )}

            {/* Actions */}

            <div className="space-y-3">
                <button
                    type="button"
                    onClick={handleCheckIn}
                    disabled={!canSubmit}
                    className="
                        w-full
                        rounded-2xl
                        bg-blue-600
                        px-5
                        py-4
                        text-base
                        font-semibold
                        text-white
                        shadow-sm
                        transition
                        hover:bg-blue-700
                        active:scale-[0.99]
                        disabled:cursor-not-allowed
                        disabled:bg-slate-300
                    "
                >
                    {CheckInMutation.isPending
                        ?"Checking in ..."
                        :"Confirm Check In"}
                </button>

                <button
                    type="button"
                    onClick={onCancel}
                    disabled={CheckInMutation.isPending}
                    className="
                        w-full
                        rounded-2xl
                        px-5
                        py-3
                        text-sm
                        font-medium
                        text-slate-600
                        hover:bg-slate-100
                    "    
                >
                    Cancel
                </button>
            </div>
        </div>
    );
}
import { useCallback, useState } from "react";

import type { LocationData, LocationCaptureProps } from "./flow.types";

export default function LocationCapture({
    onLocation,
}: LocationCaptureProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const getLocation = useCallback(() => {
        if(!navigator.geolocation){
            setError(
                "Location services are not supported by this browser."
            );
            return;
        }

        setLoading(true);
        setError(null);

        navigator.geolocation.getCurrentPosition(
            (position) => {
                const location : LocationData = {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    accuracy: position.coords.accuracy,
                };

                onLocation(location);
                setLoading(false);
            },
            (error) => {
                setLoading(false);

                switch(error.code){
                    case error.PERMISSION_DENIED:
                        setError(
                            "Location permission is required to mark attendance."
                        );
                        break;

                    case error.POSITION_UNAVAILABLE:
                        setError(
                            "Your current location could not be determined."
                        );
                        break;

                    case error.TIMEOUT:
                        setError(
                            "Location request timed out. Please try again."
                        );
                        break;

                    default:
                        setError(
                            "Unable to get your location."
                        );
                }
            },
            {
                enableHighAccuracy: true,
                timeout: 10000,
                maximumAge: 0,
            },
        );
    }, [onLocation]);

    return (
        <div className="space-y-4">
            <div className="rounded-2xl border border-slate-200 bg-white p-5">
                <p className="text-sm font-medium text-slate-900">
                    Location required
                </p>

                <p className="mt-1 text-sm text-slate-500">
                    We need your current location to verify that
                    you are at the school.
                </p>

                {error && (
                    <div className="mt-4 rounded-xl bg-red-50 p-3">
                        <p className="text-sm text-red-600">
                            {error}
                        </p>
                    </div>
                )}

                <button
                    type="button"
                    onClick={getLocation}
                    disabled={loading}
                    className="
                        mt-4
                        w-full
                        rounded-xl
                        bg-slate-900
                        px-4
                        py-3
                        text-sm
                        font-semibold
                        text-white
                        transition
                        hover:bg-slate-800
                        disabled:cursor-not-allowed
                        disable:opacity-50
                    ">
                        {loading
                        ?"Getting Location"
                        :"Use my location"}
                    </button>
            </div>
        </div>
    );
}
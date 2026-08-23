import { 
    useEffect,
    useCallback,
    useRef,
    useState
} from "react";

import type { SelfieCaptureProps, CameraState } from "./flow.types";

export default function SelfieCapture({
    onCapture,
    onCancel,
}: SelfieCaptureProps) {
    const videoRef = useRef<HTMLVideoElement | null>(null);
    const streamRef = useRef<MediaStream | null>(null);
    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const mountedRef = useRef(false);
    const startingRef = useRef(false);

    const [cameraState, setCameraState] = useState<CameraState>("idle");
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const [error, setError] = useState<string | null>(null);

    const stopCamera = useCallback(() => {
        if(streamRef.current){
            streamRef.current
                .getTracks()
                .forEach((track) =>{
                    track.stop();
                });

            streamRef.current = null;
        }

        if(videoRef.current){
            videoRef.current.srcObject = null;
        }
    }, []);

    const startCamera = useCallback(async () => {
        if(!mountedRef.current) return;
        if(startingRef.current) return;
        
        setCameraState("requesting");
        setError(null);

        try{
            if(!navigator.mediaDevices?.getUserMedia){
                throw new Error(
                    "camera access is not supported by this browser."
                );
            }

            stopCamera();

            const stream = await navigator.mediaDevices.getUserMedia({
                video: {
                    facingMode: {
                        ideal: "user"
                    },
                    width: {
                        ideal: 720
                    },
                    height: {
                        ideal: 720
                    },
                },
                audio: false,
            });

            //Component may get unmounted while waiting for permissions

            if (!mountedRef.current) {
                stream
                    .getTracks()
                    .forEach((track) => track.stop());

                return;
            }

            streamRef.current = stream;

            const video = videoRef.current;

            if(!video){
                stream
                    .getTracks()
                    .forEach((track) => {
                        track.stop()
                    });
                
                streamRef.current = null;

                throw new Error(
                    "Unable to start the camera."
                )
            }

            video.srcObject = stream;

            await new Promise<void>((resolve) => {
                if(video.readyState >= HTMLMediaElement.HAVE_METADATA){
                    resolve();
                    return;
                }

                video.onloadedmetadata = () => {
                    resolve();
                };
            });

            //  Camera could have been stopped while waiting for metadata
            if(!mountedRef.current ||
                streamRef.current !== stream)
            {
                return;
            }

            try{
                await video.play();
            }
            catch(playError){
                if(!mountedRef.current) return;

                console.error(
                    "Unable to start camera playback:",
                    playError
                )

                throw playError;
            }

            if(mountedRef.current) setCameraState("ready");
        }
        catch(err){
            console.error(
                "unable to access camera:",
                err
            );

            setCameraState("error");
            if(err instanceof DOMException &&
                err.name === "NotAllowedError")
            {
                setError(
                    "Camera permission was denied. Please allow camera access and try again."
                );
            }
            else if(
                err instanceof DOMException &&
                err.name === "NotFoundError")
            {
                setError(
                    "No camera was found on this device."
                );
            }
            else
            {
                setError(
                    err instanceof Error
                    ? err.message
                    : "Unable to access the camera"
                );
            }
        }
    }, [stopCamera]);

    useEffect(() =>{
        mountedRef.current = true;
        startCamera();

        return () => {
            mountedRef.current = false;
            startingRef.current = false;

            stopCamera();

            if(previewUrl){
                URL.revokeObjectURL(previewUrl);
            }
        };
    }, []);

    const captureSelfie = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;

        if(!video || !canvas) {
            return;
        }

        if(
            video.videoWidth === 0 ||
            video.videoHeight === 0
        ){
            setError(
                "Camera is not ready yet. Please try again.",
            );

            return;
        }

        const size = Math.min(
            video.videoWidth, 
            video.videoHeight
        )

        const offsetX = (video.videoWidth - size) /2;
        const offsetY = (video.videoHeight - size) /2;

        canvas.width = size;
        canvas.height = size;
        
        const context = canvas.getContext("2d");
        
        if (!context) {
            setError(
                "Unable to capture the selfie.",
            );

            return;
        }

        context.drawImage(
            video,
            offsetX,
            offsetY,
            size,
            size,
            0,
            0,
            size,
            size
        );

        canvas.toBlob((blob) => {
                if(!blob){
                    setError(
                        "Unable to create selfie"
                    );

                    return;
                }

                const file = new File(
                    [blob],
                    `attendance-selfie-${Date.now()}.jpg`,
                    {
                        type: "image/jpeg",
                    },
                );

                const url = URL.createObjectURL(blob);

                setPreviewUrl(url);
                setCameraState("captured");

                stopCamera();
                onCapture(file)
            },
            "image/jpeg",
            0.9
        );
    };

    const retake = async () => {
        if(previewUrl) {
            URL.revokeObjectURL(previewUrl);
        }

        setPreviewUrl(null);
        setError(null);

        await startCamera();
    };

    return (
        <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}

        <div className="border-b border-slate-100 px-5 py-4">
            <p className="text-sm font-semibold text-slate-900">
            Take a selfie
            </p>

            <p className="mt-1 text-xs text-slate-500">
            Position your face inside the frame.
            </p>
        </div>

        {/* Camera */}

        <div className="p-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-slate-950">
            {cameraState !== "captured" && (
                <>
                <video
                    ref={videoRef}
                    muted
                    playsInline
                    autoPlay
                    className="
                    h-full
                    w-full
                    object-cover
                    scale-x-[-1]
                    "
                />

                {/* Face guide */}

                {cameraState === "ready" && (
                    <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
                    <div className="h-[62%] w-[52%] rounded-[50%] border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.25)]" />
                    </div>
                )}

                {/* Loading */}

                {cameraState === "requesting" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 text-white">
                    <div className="h-8 w-8 animate-spin rounded-full border-2 border-white/30 border-t-white" />

                    <p className="mt-3 text-sm">
                        Starting camera...
                    </p>
                    </div>
                )}

                {/* Camera error */}

                {cameraState === "error" && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-950 px-6 text-center text-white">
                    <p className="text-sm font-medium">
                        Camera unavailable
                    </p>

                    {error && (
                        <p className="mt-2 text-xs text-slate-300">
                        {error}
                        </p>
                    )}

                    <button
                        type="button"
                        onClick={startCamera}
                        className="
                        mt-5
                        rounded-xl
                        bg-white
                        px-4
                        py-2.5
                        text-sm
                        font-semibold
                        text-slate-900
                        "
                    >
                        Try again
                    </button>
                    </div>
                )}
                </>
            )}

            {/* Captured preview */}

            {cameraState === "captured" &&
                previewUrl && (
                <img
                    src={previewUrl}
                    alt="Captured selfie"
                    className="
                    h-full
                    w-full
                    object-cover
                    scale-x-[-1]
                    "
                />
                )}
            </div>

            {/* Error */}

            {error &&
            cameraState !== "error" && (
                <div className="mt-3 rounded-xl bg-red-50 p-3">
                <p className="text-xs text-red-600">
                    {error}
                </p>
                </div>
            )}

            {/* Actions */}

            <div className="mt-4">
            {cameraState === "ready" && (
                <button
                type="button"
                onClick={captureSelfie}
                className="
                    flex
                    w-full
                    items-center
                    justify-center
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
                "
                >
                Capture Selfie
                </button>
            )}

            {cameraState === "captured" && (
                <div className="space-y-3">
                <button
                    type="button"
                    onClick={retake}
                    className="
                    w-full
                    rounded-2xl
                    bg-slate-900
                    px-5
                    py-4
                    text-base
                    font-semibold
                    text-white
                    transition
                    hover:bg-slate-800
                    "
                >
                    Retake Selfie
                </button>
                </div>
            )}

            {onCancel && (
                <button
                type="button"
                onClick={onCancel}
                className="
                    mt-3
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
            )}
            </div>
        </div>

        {/* Hidden canvas */}

        <canvas
            ref={canvasRef}
            className="hidden"
        />
        </section>
    );
}
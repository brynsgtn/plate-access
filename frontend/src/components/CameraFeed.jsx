import { useEffect, useRef, useState } from "react";
import { useUserStore } from "../stores/useUserStore";

function CameraFeed({ title, defaultURL }) {
    const videoRef = useRef(null);
    const [isCameraOn, setIsCameraOn] = useState(true);
    const [cameraURL, setCameraURL] = useState(defaultURL);
    const [isFeedError, setIsFeedError] = useState(false);
    const [useLocalCamera, setUseLocalCamera] = useState(true);
    const [videoStats, setVideoStats] = useState({ width: 0, height: 0, fps: 0 });

    const { user } = useUserStore();

    useEffect(() => {
        let localStream;

        if (!isCameraOn) {
            if (videoRef.current && videoRef.current.srcObject) {
                videoRef.current.srcObject.getTracks().forEach(track => track.stop());
                videoRef.current.srcObject = null;
            }
            return;
        }

        if (useLocalCamera) {
            navigator.mediaDevices.getUserMedia({ video: true, audio: false })
                .then(stream => {
                    localStream = stream;
                    if (videoRef.current) {
                        videoRef.current.srcObject = stream;

                        // get resolution & FPS
                        videoRef.current.onloadedmetadata = () => {
                            const track = stream.getVideoTracks()[0];
                            const settings = track.getSettings();
                            setVideoStats({
                                width: settings.width || 0,
                                height: settings.height || 0,
                                fps: settings.frameRate || 0,
                            });
                        };
                    }
                })
                .catch(err => {
                    console.error("Camera error:", err);
                    setIsFeedError(true);
                });

            return () => {
                if (localStream) {
                    localStream.getTracks().forEach(track => track.stop());
                }
            };
        } else {
            if (videoRef.current) {
                videoRef.current.srcObject = null;
                videoRef.current.src = cameraURL;
                videoRef.current.load(); // auto-render new URL
            }
        }
    }, [isCameraOn, useLocalCamera, cameraURL]);

    return (
        <div className="bg-base-200 p-4 rounded-lg">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h3 className="font-semibold text-base-content">{title}</h3>
                {user.role === "itAdmin" && (
                    <label className="flex items-center gap-2 cursor-pointer">
                        <span className="text-xs text-base-content/70">
                            {isCameraOn ? "On" : "Off"}
                        </span>
                        <input
                            type="checkbox"
                            className="toggle toggle-success"
                            checked={isCameraOn}
                            onChange={() => {
                                setIsCameraOn(!isCameraOn);
                                setIsFeedError(false);
                            }}
                        />
                    </label>
                )}
            </div>

            {/* Camera Details */}
            <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-base-content/70">
                    {videoStats.width && videoStats.height
                        ? `${videoStats.width}x${videoStats.height} • ${videoStats.fps} FPS`
                        : "1920x1080 • 30 FPS"}
                </p>
                <span
                    className={`text-xs font-medium flex items-center gap-1 ${
                        isCameraOn && !isFeedError ? "text-green-600" : "text-red-500"
                    }`}
                >
                    <div
                        className={`w-2 h-2 rounded-full animate-pulse ${
                            isCameraOn && !isFeedError ? "bg-green-500" : "bg-red-500"
                        }`}
                    ></div>
                    {isCameraOn
                        ? isFeedError
                            ? "NOT WORKING"
                            : "ONLINE"
                        : "OFFLINE"}
                </span>
            </div>

            {/* Camera URL / Source Selector */}
            {user.role === "itAdmin" && (
                <div className="mt-3 flex flex-col gap-2">
                    {/* Toggle Local Camera */}
                    <label className="flex items-center gap-2">
                        <input
                            type="checkbox"
                            className="toggle toggle-sm"
                            checked={useLocalCamera}
                            onChange={() => {
                                setUseLocalCamera(!useLocalCamera);
                                setIsFeedError(false);
                            }}
                        />
                        <span className="text-xs">Use Local Camera</span>
                    </label>

                    {/* Auto-update video as URL changes */}
                    {!useLocalCamera && (
                        <input
                            type="text"
                            value={cameraURL}
                            onChange={(e) => setCameraURL(e.target.value)}
                            placeholder="http://localhost:5000/video-feed"
                            className="input input-bordered w-full text-sm"
                        />
                    )}
                </div>
            )}

            {/* Video Feed */}
            <div className="rounded-lg mt-3">
                <div className="w-full aspect-video rounded-lg flex items-center justify-center overflow-hidden">
                    {isCameraOn ? (
                        !isFeedError ? (
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                controls
                                className="w-full h-full object-cover rounded-lg"
                                onError={() => setIsFeedError(true)}
                            />
                        ) : (
                            <div className="w-full h-full bg-yellow-200 dark:bg-yellow-700 flex items-center justify-center">
                                <span className="text-yellow-800 dark:text-yellow-200">
                                    Camera Not Working
                                </span>
                            </div>
                        )
                    ) : (
                        <div className="w-full h-full bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                            <span className="text-gray-600 dark:text-gray-300">Camera Offline</span>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default CameraFeed;

import Header from "../../components/Header";
import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import backButton from "../../assets/button-back.svg";
import { analyzeImage } from "../../assets/services/analyzeImage";
import { initializeCamera, stopMediaStream } from "../../utils/cameraUtils";
import { IoCameraOutline } from "react-icons/io5";
import "./SelfiePage.css";

type CameraStatus = "idle" | "starting" | "ready" | "captured";


export default function SelfiePage() {
  const navigate = useNavigate();

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [cameraStatus, setCameraStatus] =
    useState<CameraStatus>("starting");

  const [previewUrl, setPreviewUrl] = useState("");
  const [base64Image, setBase64Image] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const stopCamera = () => {
    stopMediaStream(streamRef.current);

    streamRef.current = null;

    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  };


  const startCamera = async () => {
    try {
      setErrorMessage("");
      setCameraStatus("starting");
      setPreviewUrl("");
      setBase64Image("");

      stopCamera();

      const stream = await initializeCamera();

      streamRef.current = stream;

      const video = videoRef.current;

      if (!video) {
        stopMediaStream(stream);
        streamRef.current = null;
        return;
      }

      video.srcObject = stream;
      await video.play();

      setCameraStatus("ready");
    } catch (error: unknown) {
      console.error("Camera startup failed:", error);

      setCameraStatus("idle");
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Camera access was unavailable.",
      );
    }
  };

  const takePicture = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;

    if (!video || !canvas || cameraStatus !== "ready") {
      return;
    }

    const width = video.videoWidth;
    const height = video.videoHeight;

    if (!width || !height) {
      setErrorMessage("The camera is still loading.");
      return;
    }

    canvas.width = width;
    canvas.height = height;

    const context = canvas.getContext("2d");

    if (!context) {
      setErrorMessage("Unable to capture your image.");
      return;
    }

    context.save();

    // Mirror the saved selfie to match the preview.
    context.translate(width, 0);
    context.scale(-1, 1);
    context.drawImage(video, 0, 0, width, height);

    context.restore();

    const dataUrl = canvas.toDataURL("image/jpeg", 0.9);

    setPreviewUrl(dataUrl);
    setBase64Image(dataUrl.split(",")[1] ?? dataUrl);
    setCameraStatus("captured");

    stopCamera();
  };

  const retakePicture = () => {
    void startCamera();
  };

  const handleUsePicture = async () => {
    if (!base64Image) {
      setErrorMessage("Take a picture before proceeding.");
      return;
    }

    try {
      setErrorMessage("");
      setIsSubmitting(true);

      const returnedAnalysisData = await analyzeImage(base64Image);

      stopCamera();

      navigate("/demographics", {
        state: {
          analysisData: returnedAnalysisData,
        },
      });
    } catch (error: unknown) {
      console.error("Image analysis failed:", error);
      setErrorMessage(
        error instanceof Error
          ? error.message
          : "Unable to analyze the image. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    const video = videoRef.current;

    let isCancelled = false;
    let currentStream: MediaStream | null = null;

    const attachCameraStream = async () => {
      try {
        const stream = await initializeCamera();

        if (isCancelled) {
          stopMediaStream(stream);
          return;
        }

        currentStream = stream;
        streamRef.current = stream;

        if (!video) {
          stopMediaStream(stream);
          return;
        }

        video.srcObject = stream;
        await video.play();

        if (!isCancelled) {
          setCameraStatus("ready");
        }
      } catch (error: unknown) {
        if (isCancelled) {
          return;
        }

        console.error("Camera startup failed:", error);

        setCameraStatus("idle");
        setErrorMessage(
          error instanceof Error
            ? error.message
            : "Camera access was unavailable.",
        );
      }
    };

    void attachCameraStream();

    return () => {
      isCancelled = true;

      stopMediaStream(currentStream);

      if (streamRef.current === currentStream) {
        streamRef.current = null;
      }

      if (video) {
        video.srcObject = null;
      }
    };
  }, []);


  useEffect(() => {
    return () => {
      stopCamera();

      if (previewUrl.startsWith("blob:")) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);

  return (
    <div className="selfie-page">
      <div className="selfie-page__header-overlay">
        <Header />
      </div>

      <main className="selfie-page__content">
        <section className="selfie-camera">
          <div className="selfie-camera__media">
            {previewUrl ? (
              <img
                className="selfie-camera__preview"
                src={previewUrl}
                alt="Captured selfie"
              />
            ) : (
              <video
                ref={videoRef}
                className="selfie-camera__video"
                autoPlay
                playsInline
                muted
              />
            )}

            {isSubmitting && (
              <div className="selfie-camera__overlay">
                <div className="spinner"></div>
                <p className="selfie-camera__analyzing-phase">Analyzing photo <br />...</p>
              </div>
            )}

            {cameraStatus === "starting" && !previewUrl && (
              <div className="selfie-camera__setup">
                <div className="selfie-camera__shutter" />
                <p>SETTING UP CAMERA...</p>
              </div>
            )}

            {cameraStatus === "ready" && !previewUrl && (
              <button
                type="button"
                className="selfie-camera__capture"
                onClick={takePicture}
              >
                <span className='selfie-camera__take-picture'>TAKE PICTURE</span>
                <span className="selfie-camera__capture-icon">
                  <IoCameraOutline className="selfie-camera__camera" />
                </span>
              </button>
            )}

            {cameraStatus === "captured" && previewUrl && (
              <p className="selfie-camera__success">
                GREAT SHOT!
              </p>
            )}

            <div className="selfie-camera__tips">
              <p className='header'>TO GET BETTER RESULTS MAKE SURE TO HAVE</p>

              <div className='details'>
                <span>◇ NEUTRAL EXPRESSION</span>
                <span>◇ FRONTAL POSE</span>
                <span>◇ ADEQUATE LIGHTING</span>
              </div>
            </div>
          </div>

          {previewUrl && cameraStatus === "captured" && (
            <div className="selfie-page__picture-actions">
              <button
                type="button"
                className="selfie-page__retake"
                onClick={retakePicture}
              >
                Retake
              </button>

              <button
                type="button"
                className="selfie-page__use-picture"
                onClick={handleUsePicture}
                disabled={isSubmitting}
              >
                Use This Photo
              </button>
            </div>
          )}
        </section>

        <canvas
          ref={canvasRef}
          className="selfie-page__canvas"
          aria-hidden="true"
        />

        {errorMessage && (
          <p className="selfie-page__error" role="alert">
            {errorMessage}
          </p>
        )}

        <footer className="selfie-page__actions">
          <button
            type="button"
            className="selfie-page__back"
            onClick={() => {
              stopCamera();
              navigate(-1);
            }}
          >
            <img src={backButton} alt="Back" />
          </button>
        </footer>
      </main>
    </div>
  );
};

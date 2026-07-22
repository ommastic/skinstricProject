export const initializeCamera = async () => {
  if (!navigator.mediaDevices?.getUserMedia) {
    throw new Error("Camera access is not supported by this browser.");
  }

  return navigator.mediaDevices.getUserMedia({
    video: {
      facingMode: "user",
      width: { ideal: 1280 },
      height: { ideal: 720 },
    },
    audio: false,
  });
};

export const stopMediaStream = (
  stream: MediaStream | null,): void => {
  stream?.getTracks().forEach((track) => {
    track.stop();
  });
}


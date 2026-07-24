import Header from "../../components/Header";
import { analyzeImage, type AnalysisData } from "../../assets/services/analyzeImage";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import backButton from '../../assets/button-back.svg';
import cameraIcon from '../../assets/camera-icon.svg';
import galleryIcon from '../../assets/gallery.svg';
import { BsThreeDots } from "react-icons/bs";
import { convertImageFileToBase64 } from "../../utils/imageToBase64";
import './UploadImagePage.css';


export default function UploadImage() {

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState('');
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMesage] = useState('');
  const [showSuccessAlert, setShowSuccessAlert] = useState(false);
  const [showCameraPermission, setShowCameraPermission] = useState(false);

  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl);
      }
    };
  }, [previewUrl]);


  const openFilePicker = () => {
    fileInputRef.current?.click();
  };


  const handleImageChange = async (event: ChangeEvent<HTMLInputElement>) => {

    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setErrorMessage('');
    setSuccessMesage('');
    setShowSuccessAlert(false);
    setAnalysisData(null);

    const allowedImageTypes = [
      'image/png',
      'image/jpeg',
      'image/webp'
    ];

    if (!allowedImageTypes.includes(file.type)) {
      setErrorMessage('Please select a PNG, JPEG, or WebP image.');
      event.target.value = '';
      return;
    }

    const maximumSize = 10 * 1024 * 1024;

    if (file.size > maximumSize) {
      setErrorMessage('The image must be smaller than 10MB.');
      event.target.value = '';
      return;
    }

    const localPreview = URL.createObjectURL(file);


    setPreviewUrl(localPreview);

    try {
      setIsUploading(true);
      setErrorMessage('');
      setSuccessMesage('');
      setShowSuccessAlert(false);
      setAnalysisData(null);

      const base64Image = await convertImageFileToBase64(file);

      const returnedAnalysisData = await analyzeImage(base64Image);

      setAnalysisData(returnedAnalysisData);
      setSuccessMesage(
        "Success: Your image was analyzed"
      );
      setShowSuccessAlert(true);

    } catch (error: unknown) {
      console.error('Image upload failed: ', error);

      setErrorMessage(
        error instanceof Error ? error.message : "Unable to upload the image."
      );
      setShowSuccessAlert(false);

    } finally {
      setIsUploading(false);
    }
  };

  const allowCameraAccess = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });

      //Stop this temporary permission-check stream.
      stream.getTracks().forEach((track) => track.stop());

      setShowCameraPermission(false);
      navigate('/camera');
    } catch (error) {
      console.error("Camera access failed: ", error);

      setErrorMessage(
        "Camera access was denied. Please allow camera access in your browser settings."
      );
      setShowCameraPermission(false);
    }
  };

  const denyCameraAccess = () => {
    setShowCameraPermission(false);
  };

  const navigateToAnalyzedData = () => {
    navigate('/results', { state: { analysisData } });
  };

  return (
    <div className='upload__image--page'>
      <Header />

      <main className="upload__image--wrapper">
        <p className="upload__image--heading">TO START ANALYSIS</p>
        {isUploading ? (
          <section className="analysis__loading">
            <div className="analysis__diamonds" aria-hidden='true'>
              <span className="analysis__diamond analysis__diamond--one" />
              <span className="analysis__diamond analysis__diamond--two" />
              <span className="analysis__diamond analysis__diamond--three" />
            </div>

            <div className="analysis__loading--context">
            <p className="analysis__loading--text">
              Preparing your Analysis
              <br />
              <BsThreeDots className="analysis__loading--dots"  aria-hidden='true'/>
            </p>
            </div>
          </section>
        ) : (
          <>
            <section className="image__options">
              <button type="button" className="image__option image__option--camera" onClick={() => setShowCameraPermission(true)}>

                <span className="image__diamonds" aria-hidden='true'>
                  <span className="image__diamond image__diamond--one" />
                  <span className="image__diamond image__diamond--two" />
                  <span className="image__diamond image__diamond--three" />
                </span>

                <span className="image__icon--wrapper">
                  <img src={cameraIcon} alt="" aria-hidden="true" />
                </span>

                <div className="connector connector--camera">
                  <span className="connector__line" />
                  <span className="connector__dot" />
                </div>
                <span className="image__option--label">ALLOW A.I.
                  <br />
                  TO SCAN YOUR FACE
                </span>
              </button>

              <button type='button' className="image__option image__option--gallery" onClick={openFilePicker} disabled={isUploading}>

                <span className="image__diamonds" aria-hidden='true'>
                  <span className="image__diamond image__diamond--one" />
                  <span className="image__diamond image__diamond--two" />
                  <span className="image__diamond image__diamond--three" />
                </span>

                <span className="image__icon--wrapper">
                  <img src={galleryIcon} alt="" aria-hidden='true' />
                </span>

                <div className="connector connector--gallery">
                  <span className="connector__line" />
                  <span className="connector__dot" />
                </div>
                <span className="image__option--label">ALLOW A.I.
                  <br />
                  ACCESS GALLERY
                </span>
              </button>

              <input type="file" ref={fileInputRef} className="image__upload--input" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} />

            </section>

            {errorMessage && (
              <p className="image__upload--error">{errorMessage}</p>
            )}

            {successMessage && (
              <p className="image__upload--success">{successMessage}</p>
            )}

            <button type='button' className="image__upload--back" onClick={() => navigate('/intro')}>
              <img src={backButton} alt="" aria-hidden='true' />
            </button>

            {showCameraPermission && (
              <div className="camera__permission--overlay">
                <section className="camera__permission--modal" role='dialog' aria-modal='true' aria-labelledby='camera-permission-title'>
                  <h2 id='camera-permission-title' className="camera__permission--title">
                    ALLOW A.I TO ACCESS YOUR CAMERA
                  </h2>

                  <div className='camera__permission--actions'>
                    <button type="button" className="camera__permission--deny" onClick={denyCameraAccess}>
                      DENY
                    </button>
                    <button type="button" className="camera__permission--allow" onClick={allowCameraAccess}>
                      ALLOW
                    </button>
                  </div>
                </section>
              </div>
            )}
          </>
        )}

        <div className="image__upload--preview-wrap">
          <p className="image__upload--preview-title">Preview</p>
          <div className="image__upload--preview">
            {previewUrl && (
              <img className="image__upload--preview-image" src={previewUrl} alt="Selected preview" />
            )}
          </div>
        </div>

        {showSuccessAlert && analysisData && (
          <div
            className="analysis__success-alert-overlay"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="analysis-success-title"
          >
            <div className="analysis__success-alert">
              <p id="analysis-success-title" className="analysis__success-alert-title">
                Image analyzed succesfully
              </p>

              <button
                type="button"
                className="analysis__success-alert-ok"
                onClick={navigateToAnalyzedData}
              >
                OK
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
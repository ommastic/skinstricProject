
import Header from "../../components/Header";
import axios from "axios";
import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { useNavigate } from "react-router-dom";
import backButton from '../../assets/button-back.svg';
import cameraIcon from '../../assets/camera-icon.svg';
import galleryIcon from '../../assets/gallery.svg';
import proceedButton from '../../assets/button-proceed.svg';
import './UploadImage.css';


const API_URL = "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo";

type AnalysisScores = Record<string, number>;

type PhaseTwoResponse = {
  message: string;
  data: {
    race: AnalysisScores;
    age: AnalysisScores;
    gender?: AnalysisScores;
  };
};

const convertImageFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();


    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error("Unable to convert image."));
        return;
      }

      const base64 = reader.result.split(",")[1];

      if (!base64) {
        reject(new Error("Invalid base64 image."));
        return;
      }

      resolve(base64);
    };

    reader.onerror = () => {
      reject(new Error("Unable to read the selected image."));
    };
    reader.readAsDataURL(file);
  });
};

export default function UploadImage() {

  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [previewUrl, setPreviewUrl] = useState('');
  const [analysisData, setAnalysisData] = useState<PhaseTwoResponse['data'] | null>(null);

  const [isUploading, setIsUploading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMesage] = useState('');

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

    const allowedImageTypes = [
      'image/png',
      'image/jpeg',
      'image/webp'
    ];

    if (!file) {
      return;
    }

    if (!allowedImageTypes.includes(file.type)) {
      setErrorMessage('Please select a PNG, JPEG, or WebP image.');
      event.target.value = '';
      return;
    }

    const maximumSize = 10 * 1024 * 1024;

    if (file.size > maximumSize) {
      setErrorMessage('The image must be smaller than 10MB.');
      return;
    }

    const localPreview = URL.createObjectURL(file);


    setPreviewUrl((previousURL) => {
      if (previousURL) {
        URL.revokeObjectURL(previousURL);
      }
      return localPreview;
    });

    try {
      setIsUploading(true);
      setErrorMessage('');
      setSuccessMesage('');
      setAnalysisData(null);

      const base64Image = await convertImageFileToBase64(file);

      const response = await axios.post<PhaseTwoResponse>(API_URL, {
        image: base64Image,
      });

      setSuccessMesage(response.data.message);
      setAnalysisData(response.data.data);
    } catch (error: unknown) {
      console.log('Image upload failed: ', error);

      if (axios.isAxiosError(error)) {
        const serverMessage = typeof error.response?.data?.message === 'string' && error.response.data.message;

        setErrorMessage(
          serverMessage ?? 'The server could not process this image.'
        );
      } else {
        setErrorMessage(
          error instanceof Error ? error.message : "Unable to upload the image."
        );
      }
    } finally {
      setIsUploading(false);
    }
  };

  const navigateToAnalysizedData = () => {
    navigate('/results', { state: { analysisData } });
  };

  return (
    <div className='upload__image--page'>
      <Header />

      <main className="upload__image--wrapper">
        <p className="upload__image--heading">TO START ANALYSIS</p>

        <section className="image__options">
          <button type="button" className="image__option image__option--camera" onClick={() => navigate('/camera')}>

            <span className="image__diamonds" aria-hidden='true'>
              <span className="image__diamond image__diamond--one" />
              <span className="image__diamond image__diamond--two" />
              <span className="image__diamond image__diamond--three" />
            </span>

            <img src={cameraIcon} alt="" />
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

            <img src={galleryIcon} alt="" aria-hidden='true'/>
            <span className="image__option--label">ALLOW A.I.
              <br />
              ACCESS GALLERY
            </span>
          </button>

          <input type="file" ref={fileInputRef} className="image__upload--input" accept="image/png,image/jpeg,image/webp" onChange={handleImageChange} />

        </section>

        {isUploading && (
          <p className="image__upload--status">Analyzing your image...</p>
        )}

        {errorMessage && (
          <p className="image__upload--error">{errorMessage}</p>
        )}

        {successMessage && (
          <p className="image__upload--success">{successMessage}</p>
        )}

        {previewUrl && (
          <img className="image__upload--preview" src={previewUrl} alt="" />
        )}

        <button type='button' className="image__upload--back" onClick={() => navigate(-1)}>
          <img src={backButton} alt="" aria-hidden='true' />
        </button>

        {analysisData && (
          <button type='button' className="image__upload--proceed" onClick={navigateToAnalysizedData}>
            <img src={proceedButton} alt="" />
          </button>
        )}
      </main>
    </div>
  );
}
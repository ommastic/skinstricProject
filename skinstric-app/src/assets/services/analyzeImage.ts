import axios from "axios";

const API_URL = "https://us-central1-api-skinstric-ai.cloudfunctions.net/skinstricPhaseTwo";

export const ANALYSIS_STORAGE_KEY = 'skinstric.phaseTwoAnalysis';

export type AnalysisScores = Record<string, number>;

export type AnalysisData = {
  message: string;
  data: {
    race: AnalysisScores;
    age: AnalysisScores;
    gender?: AnalysisScores;
  };
};

type AnalysisApiResponse = {
  message: string;
  data: AnalysisData;
};

export const analyzeImage = async (
  base64Image: string): Promise<AnalysisData> => {

  if (!base64Image.trim()) {
    throw new Error("An image is required");
  }

  try {
    const response = await axios.post<AnalysisApiResponse>(
      API_URL, {
      image: base64Image
    },
    );

    sessionStorage.setItem(
      ANALYSIS_STORAGE_KEY, JSON.stringify(response.data.data)
    );
    return response.data.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      const serverMessage = error.response?.data?.message;

      if (typeof serverMessage === "string") {
        throw new Error(serverMessage, {
          cause: error,
        });
      }

      throw new Error(
        "The server could not process this message", {
        cause: error,
      }
      );
    }
    throw error;
  }

}


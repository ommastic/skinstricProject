const removeDataUrlPrefix = (
  dataUrl: string): string => {
  return dataUrl.includes(",") ? dataUrl.split(",")[1] : dataUrl;
};

export const convertImageFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== 'string') {
        reject(new Error("Unable to convert image."));
        return;
      }

      resolve(removeDataUrlPrefix(reader.result));
    };

    reader.onerror = () => {
      reject(new Error("Unable to read the selected image."));
    };
    reader.readAsDataURL(file);
  });
};
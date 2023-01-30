const convertBase64 = (file: File) => {
  return new Promise<ArrayBuffer | string | null>((resolve, reject) => {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);

    fileReader.onload = () => {
      resolve(fileReader.result);
    };

    fileReader.onerror = (error) => {
      reject(error);
    };
  });
};

export type ResolvedImage = {
  fileName: string;
  base64: ArrayBuffer | string | null;
};

const uploadImage = (image: File, limitSizeMB: number) => {
  return new Promise<ResolvedImage>((resolve, reject) => {
    const maxAllowedSize = limitSizeMB * 1024 * 1024;
    if (image.size > maxAllowedSize)
      reject(`Maximum allowed size is: ${limitSizeMB}MB`);

    convertBase64(image)
      .then((base64) =>
        resolve({
          fileName: image.name,
          base64,
        })
      )
      .catch((error) => reject(error));
  });
};

export default uploadImage;

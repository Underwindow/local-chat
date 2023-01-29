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

const uploadImage = (event: React.ChangeEvent<HTMLInputElement>) => {
  return new Promise<ResolvedImage>((resolve, reject) => {
    const files = event.target.files;
    if (files !== null) {
      const file = files[0];

      convertBase64(file)
        .then((base64) =>
          resolve({
            fileName: file.name,
            base64,
          })
        )
        .catch((error) => reject(error));
    } else reject('No files attached');
  });
};

export default uploadImage;

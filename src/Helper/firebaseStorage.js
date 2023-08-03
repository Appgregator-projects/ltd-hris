import { storage } from "../configs/firebase";
import {
  ref,
  uploadString,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

export const Upload = async (title, type, image, selectedCompanies) => {
  console.log(title, "in upload image.js");
  const path = `${selectedCompanies}/${type}/${title}`;
  const storageRef = ref(storage, path);

  return new Promise((resolve, reject) => {
    uploadString(storageRef, image, "data_url")
      .then((snapshot) => {
        console.log("Uploaded a data_url string!", snapshot);
        getDownloadURL(snapshot.ref).then((downloadURL) => {
          resolve({
            path: path,
            url: downloadURL,
          });
          console.log("Uploaded a data_url string!", downloadURL);
        });
      })
      .catch((error) => reject(error.message));
  });
};

export const UploadWithBytes = async (title, type, file, selectedCompanies) => {
  console.log(title, "in upload image.js");

  const path = `${selectedCompanies}/${type}/${title}`;
  const storageRef = ref(storage, path);

  uploadBytes(storageRef, file).then((snapshot) => {
    console.log("Uploaded a blob or file!");
    return path;
  });
};

// ** React Imports
import { useState, Fragment } from "react";

// ** Reactstrap Imports
import {
     Card,
     CardHeader,
     CardTitle,
     CardBody,
     Button,
     ListGroup,
     ListGroupItem,
     Progress,
} from "reactstrap";

// ** Third Party Imports
import { useDropzone } from "react-dropzone";
import { FileText, X, DownloadCloud } from "react-feather";
import { useLocation, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import { auth } from "../../../configs/firebase";
import { Upload } from "../../../Helper/firebaseStorage";


const FileUploaderMultiple = ({ setAttachment, fileName, attachment }) => {
     const location = useLocation();
     const pathname = location.pathname.includes("tickets")
          ? fileName
          : location.pathname.split("/")[2];
     const { id } = useParams();

     // ** State
     const [files, setFiles] = useState([]);
     const [loading, setLoading] = useState(false);
     const [defProps, setDefProps] = useState("");
     const [dataTask, setDataTask] = useState([]);
     const [byteProgress, setByteProgress] = useState(0);

     const { getRootProps, getInputProps } = useDropzone({
          onDrop: (acceptedFiles) => {
               setFiles([...files, ...acceptedFiles.map((file) => Object.assign(file))]);
          },
     });

     const renderFilePreview = (file) => {
          if (file.type.startsWith("image")) {
               return (
                    <img
                         className="rounded"
                         alt={file.name}
                         src={URL.createObjectURL(file)}
                         height="28"
                         width="28"
                    />
               );
          } else {
               return <FileText size="28" />;
          }
     };

     const handleRemoveFile = (file) => {
          const uploadedFiles = files;
          const filtered = uploadedFiles.filter((i) => i.name !== file.name);
          setFiles([...filtered]);
     };

     const renderFileSize = (size) => {
          if (Math.round(size / 100) / 10 > 1000) {
               return `${(Math.round(size / 100) / 10000).toFixed(1)} mb`;
          } else {
               return `${(Math.round(size / 100) / 10).toFixed(1)} kb`;
          }
     };

     const fileList = files.map((file, index) => (
          <ListGroupItem
               key={`${file.name}-${index}`}
               className="d-flex align-items-center justify-content-between"
          >
               <div className="file-details d-flex align-items-center">
                    <div className="file-preview me-1">{renderFilePreview(file)}</div>
                    <div>
                         <p className="file-name mb-0">{file.name}</p>
                         <p className="file-size mb-0">{renderFileSize(file.size)}</p>
                    </div>
               </div>
               <Button
                    color="danger"
                    outline
                    size="sm"
                    className="btn-icon"
                    onClick={() => handleRemoveFile(file)}
               >
                    <X size={14} />
               </Button>
          </ListGroupItem>
     ));

     const handleRemoveAllFiles = () => {
          setFiles([]);
     };

     const uploadFile = (fileName, file, id) => {
          return new Promise((resolve, reject) => {
               let reader = new FileReader();
               reader.readAsDataURL(file);
               reader.onprogress = (event) => {
                    if (event.lengthComputable) {
                         const percentLoaded = Math.round((event.loaded / event.total) * 100);
                         setByteProgress(percentLoaded);
                    }
               };
               reader.onload = async () => {
                    const baseURL = reader.result;
                    try {
                         let result;
                         if (location.pathname.includes("tickets")) {
                              result = await Upload(fileName, "1", baseURL, `${pathname}`);
                         } else {
                              result = await Upload(
                                   fileName,
                                   "1",
                                   baseURL,
                                   `${pathname}/id/${id}`
                              );
                         }
                         resolve(result);
                    } catch (error) {
                         reject(error);
                    }
               };
          });
     };

     const handleUploadFiles = async () => {
          setLoading(true);

          const name =
               defProps.length !== 0 ? defProps.filter((e) => e.label === "Name") : "";
          const fileNames = name
               ? `${name[0]?.value?.value}-${new Date()}`
               : `${auth.currentUser.uid}-${fileName}-${new Date()}`;
          try {
               const uploadPromises = files.map((file, index) =>
                    uploadFile(
                         `${auth.currentUser.uid}-${fileName}-[${index + 1}]-${new Date()}`,
                         file,
                         id
                    )
               );
               const results = await Promise.all(uploadPromises);
               setAttachment(results);
               if (attachment) {
                    attachment = results;
               }
               if (results.length > 0) {
                    setLoading(false);
                    toast.success("file has been uploded");
               }

               return results;
          } catch (error) {
               throw error
          } finally {
               // handleData(parseInt(id));
          }
     };

     return (
          <Card>
               <CardBody>
                    <div {...getRootProps({ className: "dropzone" })}>
                         <input {...getInputProps()} accept="image/*" capture />
                         <div className="d-flex align-items-center justify-content-center flex-column">
                              <DownloadCloud size={64} />
                              <h5 style={{ textAlign: "center" }}>
                                   Drop Files here or click to upload
                              </h5>
                              <p className="text-secondary" style={{ textAlign: "center" }}>
                                   Drop files here or click{" "}
                                   <a href="/" onClick={(e) => e.preventDefault()}>
                                        browse
                                   </a>{" "}
                                   thorough your machine
                              </p>
                         </div>
                    </div>

                    {byteProgress !== 0 && loading ? (
                         <div className="demo-vertical-spacing mt-2">
                              <span>Loading Progress… {byteProgress.toFixed()}%</span>
                              <Progress value={`${byteProgress}`} />
                         </div>
                    ) : (
                         <></>
                    )}
                    {files.length ? (
                         <Fragment>
                              <ListGroup className="my-2">{fileList}</ListGroup>
                              <div className="d-flex justify-content-end">
                                   <Button
                                        className="me-1"
                                        color="danger"
                                        outline
                                        onClick={handleRemoveAllFiles}
                                   >
                                        Remove All
                                   </Button>
                                   <Button color="primary" onClick={handleUploadFiles}>
                                        Upload Files
                                   </Button>
                              </div>
                         </Fragment>
                    ) : null}
               </CardBody>
          </Card>
     );
};

export default FileUploaderMultiple;

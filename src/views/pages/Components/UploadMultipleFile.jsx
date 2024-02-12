import { useEffect, useState } from "react";
// ** Reactstrap Imports
import {

     Button,
     Card,
     CardBody,

     Form,

     Label,
     ListGroup,
     ListGroupItem,

} from "reactstrap";


import {
     DownloadCloud,

     FileText,

     X,
} from "react-feather";

import { useDropzone } from "react-dropzone";
import { Fragment } from "react";
import { useDispatch } from 'react-redux'
import { getImage } from '../LMS/store/courses'

// ** Styles
import "@styles/react/libs/file-uploader/file-uploader.scss";

const UploadMultipleFile = () => {

     const [files, setFiles] = useState([]);

     const dispatch = useDispatch()

     const { getRootProps, getInputProps } = useDropzone({
          accept: {
               "image/*": [".png", ".jpg", ".jpeg", ".gif"],
               "video/*": [".mp4", ".mkv", ".avi"],
               "application/pdf": [],
               "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [],
               "application/vnd.ms-powerpoint": [],
               "application/vnd.openxmlformats-officedocument.presentationml.presentation": [],
               "application/msword": [],
               "application/vnd.openxmlformats-officedocument.wordprocessingml.document": []
          },
          onDrop: (acceptedFiles) => {
               setFiles([
                    ...files,
                    ...acceptedFiles.map((file) => Object.assign(file)),
               ]);
               dispatch(getImage([...files, ...acceptedFiles.map(file => Object.assign(file))]))
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
                    <div className="file-preview me-1">
                         {renderFilePreview(file)}
                    </div>
                    <div>
                         <p className="file-name mb-0">{file.name}</p>
                         <p className="file-size mb-0">
                              {renderFileSize(file.size)}
                         </p>
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



     return (
          <Form>
               <Label>Upload Image</Label>
               <Card>
                    <CardBody>
                         <div
                              {...getRootProps({
                                   className:
                                        "dropzone",
                              })}
                         >
                              <input
                                   {...getInputProps()}
                              />
                              <div className="d-flex align-items-center justify-content-center flex-column">
                                   <DownloadCloud
                                        size={64}
                                   />
                                   <h5>
                                        Drop Files here
                                        or click to
                                        upload
                                   </h5>
                                   <p className="text-secondary">
                                        Drop files here
                                        or click{" "}
                                        <a
                                             href="/"
                                             onClick={(
                                                  e
                                             ) =>
                                                  e.preventDefault()
                                             }
                                        >
                                             browse
                                        </a>{" "}
                                        thorough your
                                        machine
                                   </p>
                              </div>
                         </div>
                         {files.length ? (
                              <Fragment>
                                   <ListGroup className="my-2">
                                        {fileList}
                                   </ListGroup>
                                   <div className="d-flex justify-content-end">
                                        <Button
                                             className="me-1"
                                             color="danger"
                                             outline
                                             onClick={
                                                  handleRemoveAllFiles
                                             }
                                        >
                                             Remove All
                                        </Button>
                                        {/* <Button color="primary">
                                             Upload
                                             Files
                                        </Button> */}
                                   </div>
                              </Fragment>
                         ) : null}
                    </CardBody>
               </Card>
          </Form>
     )
}

export default UploadMultipleFile
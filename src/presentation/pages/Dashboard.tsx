import {
  Box,
  Button,
  ButtonGroup,
  Card,
  Divider,
  Typography,
} from "@mui/material";
import React, { useEffect, useState, useRef } from "react";
import { useLocation } from "react-router-dom";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import DriveFolderUploadIcon from "@mui/icons-material/DriveFolderUpload";
import { authToken } from "../../constants";
import axios from "axios";
import { endpoints } from "../../domain/endpoints";
import { url } from "../../baseUrl";
import loading from "../images/loading.gif";
import Toast from "../components/SweetAlert";
import DrawRect from "../components/DrawRect";

const Dashboard = () => {
  const location = useLocation();
  const [selectedImage, setSelectedImage] = useState<any>();
  const [selectedImageFolder, setSelectedImageFolder] = useState<any>([]);
  const [imageInfo, setImageInfo] = useState<any>([]);
  const [isResponse, setIsResponse] = useState<boolean>(false);
  const [output, setOutput] = useState<any>();
  const [mess, setMess] = useState<boolean>(false);

  const ref = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (ref.current !== null) {
      ref.current.setAttribute("directory", "");
      ref.current.setAttribute("webkitdirectory", "");
    }
  }, [ref]);
  const [resImage, setResImage] = useState<any>([]);
  const [coordinates, setCoordinates] = useState<any>([]);

  const onImageChange = (e: any) => {
    setImageInfo(e.target.files[0]);
    setSelectedImage(URL.createObjectURL(e.target.files[0]));
  };

  const onImageChangeFolder = (e: any) => {
    var imageArry: any[] = [];
    const tempArray = imageArry.concat(e.target.files);
    for (let i = 0; i < e.target.files.length; i++) {
      setImageInfo((imageInfo: any) => [...imageInfo, e.target.files[i]]);
      setSelectedImageFolder((selectedImageFolder: any) => [
        ...selectedImageFolder,
        URL.createObjectURL(tempArray[0][i]),
      ]);
    }
  };
  console.log(selectedImageFolder, "selected");
  const handleUpload = () => {
    // Global start
    setIsResponse(true);
    var bodyFormData = new FormData();
    bodyFormData.append("email", location.state.email);

    const config = {
      headers: {
        Authorization: authToken,
      },
    };
    // Global end

    if (mess) {
      console.log(resImage, selectedImageFolder[0]);
      let outPutImg: any;
      if (selectedImageFolder[0]!==undefined) {
        let imgarr: any = [];
        selectedImageFolder.forEach((ele: RequestInfo | URL, idx: any) => {
          fetch(ele)
            .then((r) => r.blob())
            .then((blb) => {
              outPutImg = new File([blb], ele.toString().split("/")[3], {
                type: "image/jpg",
              });
              console.log(outPutImg);
              imgarr.push(outPutImg);
              if (idx === selectedImageFolder.length - 1) {
                console.log(idx, imgarr, "98765879279873");
                imgarr.forEach((element: string | Blob) => {
                  bodyFormData.append("imgs", element);
                });

                bodyFormData.append("coords", JSON.stringify(coordinates));
                axios
                  .post(url + endpoints.FINAL_SUBMISSION, bodyFormData, config)
                  .then((res) => {
                    if (res.data.status === 200) {
                      setIsResponse(false);
                      Toast.fire({
                        icon: "success",
                        title: res.data.message,
                      });
                      // window.location.reload();
                    } else {
                      Toast.fire({
                        icon: "error",
                        title: res.data.message,
                      });
                    }
                  });
              }
            });
        });
      } 
      else {

        fetch(coordinates[0].src)
          .then((r) => r.blob())
          .then((blb) => {
            outPutImg = new File([blb], coordinates[0].src.split("/")[3], { type: "image/jpg" });
            console.log(outPutImg);
            bodyFormData.append("imgs", outPutImg);
            bodyFormData.append("coords", JSON.stringify(coordinates));
            axios
              .post(url + endpoints.FINAL_SUBMISSION, bodyFormData, config)
              .then((res) => {
                if (res.data.status === 200) {
                  setIsResponse(false);
                  Toast.fire({
                    icon: "success",
                    title: res.data.message,
                  });
                  // window.location.reload();
                } else {
                  Toast.fire({
                    icon: "error",
                    title: res.data.message,
                  });
                }
              });
          });
      }
    } else {
      if (imageInfo[0]) {
        for (let i = 0; i < imageInfo.length; i++) {
          bodyFormData.append("imgs", imageInfo[i]);
        }
      } else {
        bodyFormData.append("imgs", imageInfo);
      }
      axios
        .post(url + endpoints.UPLOAD_IMAGE, bodyFormData, config)
        .then((res) => {
          if (res.data.status === 200) {
            setIsResponse(false);
            setOutput(res.data.data);
            Toast.fire({
              icon: "success",
              title: "Image uploaded successfully",
            });
          } else {
            Toast.fire({
              icon: "error",
              title: "Something went wrong",
            });
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  const handleFeedBack = (e: any) => {
    if (e.target.id === "yes") {
      window.location.reload();
      Toast.fire({
        icon: "success",
        title: "Thanks for using the tool",
      });
    } else {
      setOutput(false);
      setMess(true);
    }
  };

  var coordsarr: any = [];
  const getCoordinates = (coordinate: any, checked: any) => {
    setCoordinates([
      ...coordinates,
      {
        x: coordinate.x,
        y: coordinate.y,
        width: coordinate.width,
        height: coordinate.height,
        key: coordinate.key,
        src: coordinate.image,
      },
    ]);
    setResImage(coordinates.image);

    coordsarr.push(coordinates);
  };
  console.log(resImage, "dra");
  console.log(coordinates);
  return (
    <Box>
      <Card sx={{ textAlign: "right", padding: 2 }}>
        Logged in as : <b> {location.state.email}</b>
      </Card>

      <Card
        elevation={0}
        sx={{
          position: "absolute",
          top: "30%",
          left: "50%",
          transform: "translate(-50%, -30%)",
          width: "80%",
        }}
      >
        <Typography textAlign={"center"} m={2} color="#555">
          Choose any of the option below{" "}
        </Typography>
        <ButtonGroup
          fullWidth
          color="secondary"
          size="large"
          variant="outlined"
        >
          <Button startIcon={<UploadFileIcon />} component="label">
            Upload file
            <input
              onChange={(e) => onImageChange(e)}
              hidden
              accept="image/*"
              type="file"
            />
          </Button>
          <Button component="label" startIcon={<DriveFolderUploadIcon />}>
            Upload folder
            <input
              onChange={(e) => onImageChangeFolder(e)}
              ref={ref}
              hidden
              accept="image/*"
              type="file"
            />
          </Button>
        </ButtonGroup>
      </Card>
      {isResponse && (
        <div
          style={{
            position: "fixed",
            width: "40%",
            left: "50%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            textAlign: "center",
            backgroundColor: "#fff",
            borderRadius: "10px",
            zIndex: 10,
          }}
        >
          <img src={loading} width="40%" alt="loading" />
        </div>
      )}
      {selectedImage ? (
        <Card
          elevation={0}
          sx={{
            padding: 5,
            position: "absolute",
            top: "50%",
            left: "50%",
            width: "80%",
            textAlign: "center",
            transform: "translateX(-50%)",
          }}
        >
          {mess ? (
            <DrawRect
              imageSrc={selectedImage}
              getCoordinates={getCoordinates}
            />
          ) : (
            <img
              style={{
                border: "solid 1px #000",
                padding: 5,
                borderRadius: "10px",
              }}
              src={selectedImage}
              width="60%"
              alt="image"
              draggable="false"
            />
          )}

          {mess && (
            <>
              <Typography sx={{ color: "#666", fontWeight: "bold", margin: 2 }}>
                Do it manually : Move your cursor on the image and click on the
                4 end corners of the number plate
              </Typography>
            </>
          )}

          <br />

          <div
            style={{
              display: "flex",
              position: "relative",
              width: "60%",
              margin: 5,
              left: "50%",
              transform: "translateX(-50%)",
            }}
          >
            <Typography width="50%" fontSize={13}>
              Name : <b> {imageInfo.name} </b>
            </Typography>
            <Typography width="50%" fontSize={13}>
              Size : <b> {imageInfo.size} kb </b>
            </Typography>
          </div>

          <Button color="secondary" variant="contained" onClick={handleUpload}>
            Upload
          </Button>
          <Button
            color="secondary"
            variant="outlined"
            onClick={() => {
              window.location.reload();
            }}
            sx={{ margin: 2 }}
          >
            Remove
          </Button>

          {output && (
            <>
              <Divider />
              <Typography sx={{ fontSize: 25, fontWeight: "bold", margin: 3 }}>
                Output image:
              </Typography>

              <img
                style={{
                  border: "solid 1px #000",
                  padding: 5,
                  borderRadius: "10px",
                }}
                src={`data:image/*;base64,${output}`}
                width="60%"
                alt="output_image"
              />

              <Typography>Are you satisfied with the output ?</Typography>
              <Button
                color="secondary"
                variant="contained"
                id="yes"
                onClick={handleFeedBack}
              >
                Yes
              </Button>
              <Button
                sx={{ margin: 2 }}
                color="secondary"
                id="no"
                variant="outlined"
                onClick={handleFeedBack}
              >
                No
              </Button>
            </>
          )}
        </Card>
      ) : (
        imageInfo.length > 1 && (
          <Card
            elevation={0}
            sx={{
              padding: 5,
              position: "absolute",
              top: "50%",
              left: "50%",
              width: "80%",
              textAlign: "center",
              transform: "translateX(-50%)",
            }}
          >
            {selectedImageFolder.map((src: any, key: number) => {
              return mess ? (
                <DrawRect imageSrc={src} getCoordinates={getCoordinates} />
              ) : (
                <img
                  key={key}
                  style={{
                    border: "solid 1px #000",
                    padding: 5,
                    borderRadius: "10px",
                  }}
                  src={src}
                  width="60%"
                  alt="image"
                  draggable="false"
                />
              );
            })}

            <br />

            <div
              style={{
                display: "flex",
                position: "relative",
                width: "60%",
                margin: 5,
                left: "50%",
                transform: "translateX(-50%)",
              }}
            >
              {imageInfo.lenght === 1 && (
                <>
                  <Typography width="50%" fontSize={13}>
                    Name : <b> {imageInfo.name} </b>
                  </Typography>
                  <Typography width="50%" fontSize={13}>
                    Size : <b> {imageInfo.size} kb </b>
                  </Typography>
                </>
              )}
            </div>

            <Button
              color="secondary"
              variant="contained"
              onClick={handleUpload}
            >
              Upload
            </Button>

            <Button
              color="secondary"
              variant="outlined"
              onClick={() => {
                window.location.reload();
              }}
              sx={{ margin: 2 }}
            >
              Remove
            </Button>

            {output && (
              <>
                <Divider />
                <Typography
                  sx={{ fontSize: 25, fontWeight: "bold", margin: 3 }}
                >
                  Output image:
                </Typography>

                {output.map((src: any, key: number) => {
                  return (
                    <img
                      key={key}
                      style={{
                        border: "solid 1px #000",
                        padding: 5,
                        borderRadius: "10px",
                        marginBottom: 15,
                      }}
                      src={`data:image/*;base64,${src}`}
                      width="60%"
                      alt="output_image"
                    />
                  );
                })}
                <Typography>Are you satisfied with the output ?</Typography>
                <Button
                  color="secondary"
                  variant="contained"
                  id="yes"
                  onClick={handleFeedBack}
                >
                  Yes
                </Button>
                <Button
                  sx={{ margin: 2 }}
                  color="secondary"
                  id="no"
                  variant="outlined"
                  onClick={handleFeedBack}
                >
                  No
                </Button>
              </>
            )}
          </Card>
        )
      )}
    </Box>
  );
};

export default Dashboard;

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
import Swal from "sweetalert2";
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
const [pointsArray, setPointsArray] = useState<any>([]);
  const [coordinates, setCoordinates] = useState<any>({
    x: 0,
    y: 0,
  });

  const markCoordinates = (
    e: React.MouseEvent<HTMLImageElement, MouseEvent>
  ) => {
    setCoordinates({
      ...coordinates,
      x: e.nativeEvent.offsetX,
      y: e.nativeEvent.offsetY,
    });
  };
  const pushCoordinates = (e: any) => {
    var markedPoints = { x: coordinates.x, y: coordinates.y };
    pointsArray.push(markedPoints);
  };
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
      bodyFormData.append("imgs", imageInfo);
      bodyFormData.append("coords", JSON.stringify(pointsArray));
      axios
        .post(url + endpoints.FINAL_SUBMISSION, bodyFormData, config)
        .then((res) => {
          console.log(bodyFormData, "payload");
          if (res.data.status === 200) {
            console.log(res, "res");
            setIsResponse(false);
            Toast.fire({
              icon: "success",
              title: res.data.message,
            });
            window.location.reload()
          } else {
            Toast.fire({
              icon: "error",
              title: res.data.message,
            });
          }
        });
    } else {
      if (imageInfo.length) {
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
            // console.log(output)
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
      const Toast = Swal.mixin({
        toast: true,
        position: "top-end",
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
          toast.addEventListener("mouseenter", Swal.stopTimer);
          toast.addEventListener("mouseleave", Swal.resumeTimer);
        },
      });

      Toast.fire({
        icon: "success",
        title: "Thanks for using the tool",
      });
    } else {
      setOutput(false);
      setMess(true);
    }
  };
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
              hidden
              ref={ref}
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
          <img
            style={{
              border: "solid 1px #000",
              padding: 5,
              borderRadius: "10px",
            }}
            src={selectedImage}
            width="60%"
            alt="image"
            id="screenshot"
            onMouseMove={(e) => markCoordinates(e)}
            onClick={(e) => mess && pushCoordinates(e)}
            draggable="false"
          />
          {mess && (
            <>
              {pointsArray.map((points: any, key: number) => {
                return (
                  <>
                    <h3 key={key}>
                      x-coordinate [ {[key + 1]} ]: {points.x} <br />{" "}
                      y-coordinate [ {[key + 1]} ]: {points.y}
                    </h3>
                    <Divider />
                  </>
                );
              })}
              <Typography sx={{ color: "#666", fontWeight: "bold", margin: 2 }}>
                Do it manually : Move your cursor on the image and click on the
                4 end corners of the number plate
              </Typography>

              <div
                style={{
                  width: "400px",
                  height: "60px",
                  margin: "auto",
                  backgroundColor: "orange",
                  position: "relative",
                }}
              >
                Number Plate
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    backgroundColor: "black",
                    padding: "3px 10px 3px 10px",
                    borderRadius: "20px",
                    color: "#fff",
                  }}
                >
                  1
                </span>
                <span
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    backgroundColor: "black",
                    padding: "3px 10px 3px 10px",
                    borderRadius: "20px",
                    color: "#fff",
                  }}
                >
                  2
                </span>
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    backgroundColor: "black",
                    padding: "3px 10px 3px 10px",
                    borderRadius: "20px",
                    color: "#fff",
                  }}
                >
                  3
                </span>
                <span
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    backgroundColor: "black",
                    padding: "3px 10px 3px 10px",
                    borderRadius: "20px",
                    color: "#fff",
                  }}
                >
                  4
                </span>
              </div>
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
              window.location.reload()
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
      ) : imageInfo.length > 1 && (
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
            return (
              <img
                key={key}
                style={{
                  border: "solid 1px #000",
                  padding: 5,
                  borderRadius: "10px",
                  marginBottom: 15,
                }}
                src={src}
                width="60%"
                alt="image"
                id="image"
                onMouseMove={(e) => markCoordinates(e)}
                onClick={(e) => mess && pushCoordinates(e)}
                draggable="false"
              />
            );
          })}
          
          {mess && (
            <>
              {pointsArray.map((points: any, key: number) => {
                return (
                  <>
                    <h6 key={key}>
                      x-coordinate [ {[key + 1]} ]: {points.x} <br />{" "}
                      y-coordinate [ {[key + 1]} ]: {points.y}
                    </h6>
                    <Divider />
                  </>
                );
              })}
              <Typography sx={{ color: "#666", fontWeight: "bold", margin: 2 }}>
                Do it manually : Move your cursor on the image and click on the
                4 end corners of the number plate
              </Typography>

              <div
                style={{
                  width: "400px",
                  height: "60px",
                  margin: "auto",
                  backgroundColor: "orange",
                  position: "relative",
                }}
              >
                Number Plate
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    top: 0,
                    backgroundColor: "black",
                    padding: "3px 10px 3px 10px",
                    borderRadius: "20px",
                    color: "#fff",
                  }}
                >
                  1
                </span>
                <span
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    backgroundColor: "black",
                    padding: "3px 10px 3px 10px",
                    borderRadius: "20px",
                    color: "#fff",
                  }}
                >
                  2
                </span>
                <span
                  style={{
                    position: "absolute",
                    left: 0,
                    bottom: 0,
                    backgroundColor: "black",
                    padding: "3px 10px 3px 10px",
                    borderRadius: "20px",
                    color: "#fff",
                  }}
                >
                  3
                </span>
                <span
                  style={{
                    position: "absolute",
                    right: 0,
                    bottom: 0,
                    backgroundColor: "black",
                    padding: "3px 10px 3px 10px",
                    borderRadius: "20px",
                    color: "#fff",
                  }}
                >
                  4
                </span>
              </div>
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
            {imageInfo.lenght === 1 && 
            <>
              <Typography  width="50%" fontSize={13}>
                Name : <b> {imageInfo.name} </b>
              </Typography>
              <Typography width="50%" fontSize={13}>
                Size : <b> {imageInfo.size} kb </b>
              </Typography>
            </>}

          </div>

          <Button color="secondary" variant="contained" onClick={handleUpload}>
            Upload
          </Button>

          <Button
            color="secondary"
            variant="outlined"
            onClick={() => {
              // setSelectedImage(null);
              // setSelectedImageFolder(null);
              // setIsResponse(false);
              // setPointsArray([]);
              // setMess(false);
              window.location.reload()
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
      )}
    </Box>
  );
};

export default Dashboard;

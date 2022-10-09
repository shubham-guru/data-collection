import React, { useState } from "react";
import axios from "axios";
import { Button, Card, Divider, TextField, Typography } from "@mui/material";
import { url } from "../../baseUrl";
import { endpoints } from "../../domain/endpoints";
import { authToken } from "../../constants";
import { useNavigate } from "react-router-dom";
import { SignupData } from "../../domain/models/signupModel";
import Toast from "../components/SweetAlert";
import { pageRoutes } from "../../routes";

const Signup = () => {
  const navigation = useNavigate();
  const [userData, setUserData] = useState({
    email: "testuser@gmail.com",
    password: "testuser",
  });

  const handleClick = () => {
    if (userData.email.trim() === "" || userData.password.trim() === "") {
      alert("Please fill all the details !");
    } else {
      const config = {
        headers: {
          Authorization: authToken,
        },
      };
      var data = {
        email: userData.email,
        password: userData.password,
      };
      axios
        .post(url + endpoints.REGISTER, data, config)
        .then((res) => {
          if (res.data.status === 200) {
            Toast.fire({
              icon: "success",
              title: "Account has been successfully created",
            });
            navigation(pageRoutes.LOGIN);
          } else {
            Toast.fire({
              icon: "error",
              title: res.data.message,
            });
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
  };

  return (
    <Card
      sx={{
        width: "50%",
        position: "absolute",
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
        padding: 7,
        textAlign: "center",
      }}
    >
      <Typography sx={{ fontSize: 20, textAlign: "center", margin: 1 }}>
        Signup
      </Typography>
      <Divider sx={{ margin: 5 }} />
      <TextField
        value={userData.email}
        fullWidth
        autoComplete="off"
        variant="outlined"
        type="email"
        label="Email-id"
        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
      />
      <br />
      <br />
      <TextField
        value={userData.password}
        fullWidth
        autoComplete="off"
        variant="outlined"
        type="password"
        label="Password"
        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
      />
      <br />
      <br />
      <Button
        color="warning"
        sx={{ marginLeft: 2, backgroundColor: "orange" }}
        variant="contained"
        onClick={handleClick}
      >
        Sign up
      </Button>
    </Card>
  );
};

export default Signup;

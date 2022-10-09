import React, { useState } from "react";
import axios from "axios";
import {  TextField, Typography } from "@mui/material";
import { url } from "../../baseUrl";
import { endpoints } from "../../domain/endpoints";
import { authToken } from "../../constants";
import { useNavigate } from "react-router-dom";
import { pageRoutes } from "../../routes";
import Toast from "../components/SweetAlert";

const Login = () => {
  const navigation = useNavigate();

  const [userData, setUserData] = useState({
    email: "",
    password: "",
  });

  const handleClick = (e:any) => {
    e.preventDefault();
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
        .post(url + endpoints.LOGIN, data, config)
        .then((res) => {
          if (res.data.status === 200) {
            Toast.fire({
              icon: "success",
              title: "Logged in successfully",
            });
            navigation(pageRoutes.DASHBOARD, { state: { email: data.email } });
          } else {
            Toast.fire({
              icon: "error",
              title: "Wrong Credentials",
            });
          }
        })
        .catch((err) => {
          alert(err);
        });
    }
  };
  return (
    <>
      <form>
        <div className="login">
          <Typography
            textAlign={"center"}
            sx={{ fontSize: 20, marginBottom: 4 }}
          >
            Login
          </Typography>
          <TextField
            autoComplete="off"
            onChange={(e) =>
              setUserData({ ...userData, email: e.target.value })
            }
            sx={{ marginBottom: 2 }}
            fullWidth
            type="email"
            label="Email"
          />
          <TextField
            autoComplete="off"
            onChange={(e) =>
              setUserData({ ...userData, password: e.target.value })
            }
            fullWidth
            type="password"
            label="Password"
          />
          <button style={{ borderRadius: "50px" }} onClick={handleClick}>
            Login
          </button>

          <Typography sx={{color: '#888', fontSize: 12, marginTop: 3}} textAlign="center">Don't have an account ? 
          <Typography onClick={()=>navigation(pageRoutes.SIGNUP)} sx={{fontSize: 14, cursor: 'pointer', textDecoration: 'underline'}}>Create an account</Typography>
        </Typography>
        </div>
      </form>
    </>
  );
};

export default Login;

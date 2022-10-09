import React, { useState } from "react";
import axios from "axios";
import { TextField, Typography } from "@mui/material";
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
    email: "",
    password: "",
  });

  const handleClick = (e:any) => {
    e.preventDefault()
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
    <>
    <form>
      <div className="login">
        <Typography
          textAlign={"center"}
          sx={{ fontSize: 20, marginBottom: 4 }}
        >
          Sign up
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
          Sign up
        </button>

        <Typography sx={{color: '#888', fontSize: 12, marginTop: 3}} textAlign="center">Already have an account ? 
          <Typography onClick={()=>navigation(pageRoutes.LOGIN)} sx={{fontSize: 14, cursor: 'pointer', textDecoration: 'underline'}}>LOGIN</Typography>
        </Typography>
      </div>
    </form>
  </>
  );
};

export default Signup;

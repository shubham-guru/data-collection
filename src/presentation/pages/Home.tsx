import { Card, Typography, Button } from "@mui/material";
import home from "../images/home.jpg";
import React from "react";
import { useNavigate } from "react-router-dom";
import { pageRoutes } from "../../routes";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Card elevation={0} sx={{ display: "flex", alignItems: "center" }}>
        <div style={{ width: "50%" }}>
          <img src={home} alt="home" width="100%" />
        </div>

        <div style={{ width: "50%", textAlign: "right", marginRight: "30px" }}>
          <Typography
            component={"h1"}
            sx={{ fontSize: 35, fontWeight: "bold" }}
          >
            BEST DATA COLLECTION APP
          </Typography>
          <Typography sx={{ fontSize: 13, color: "#888" }}>
            Signup or login to continue
          </Typography>

          <div
            style={{
              display: "flex",
              margin: "10px",
              justifyContent: "flex-end",
            }}
          >
            <div>
              <Button
                variant="outlined"
                onClick={() => navigate(pageRoutes.LOGIN)}
                size="small"
                color='warning'
                sx={{ marginLeft: 2, borderColor: 'orange', color: 'orange' }}
              >
                Login
              </Button>
            </div>
            <div>
              <Button
                variant="contained"
                onClick={() => navigate(pageRoutes.SIGNUP)}
                size="small"
                color='warning'
                sx={{ marginLeft: 2, backgroundColor: 'orange' }}
              >
                Signup
              </Button>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Home;

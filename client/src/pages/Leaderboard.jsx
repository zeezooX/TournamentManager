import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  List,
  ListSubheader,
  ListItemText,
  ListItem,
  Avatar,
  Stack,
  Divider,
  Fab,
  Tooltip,
} from "@mui/material";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";

const Leaderboard = () => {
  const navigate = useNavigate();
  const [standings, setStandings] = useState([]);

  useEffect(() => {
    axios
      .get(`/retrieve`)
      .then((res) => {
        console.log("RESPONSE RECEIVED: ", res);
        const teams = res.data.teams;
        const leaderboard = res.data.leaderboard;
        const standings = [];
        for (let i = 0; i < teams.length; i++) {
          standings.push({
            name: teams[i],
            score: leaderboard[i],
          });
        }
        standings.sort((a, b) => b.score - a.score);
        setStandings(standings);
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
        navigate("/create");
      });
  }, []);

  return (
    <div
      style={{
        height: "97.5vh",
        backgroundImage: "url('/assets/background.png')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundAttachment: "fixed",
      }}
    >
      <Stack spacing={2} alignItems="center">
        <img
          src={"/assets/logo.png"}
          style={{ width: "560px", cursor: "pointer" }}
          alt=""
          onClick={() => {
            navigate("/create");
          }}
        />
        <List
          sx={{
            width: "100%",
            maxWidth: 360,
            bgcolor: "background.paper",
            border: "1px solid #bdbdbd",
            borderRadius: 3,
            py: 1.5,
          }}
          subheader={
            <ListSubheader style={{ fontSize: "32px" }}>
              <FormatListNumberedIcon sx={{ width: 36, height: 36, mb: -1 }} />{" "}
              Leaderboard
            </ListSubheader>
          }
        >
          <Divider />
          <List sx={{overflow: "auto",
            maxHeight: "65vh",}}>
          {standings.map((x, i) => {
            let avatarColor = null;
            if (i === 0) {
              avatarColor = "#fdbd10";
            } else if (i === 1) {
              avatarColor = "#d0d0d0";
            } else if (i === 2) {
              avatarColor = "#a77044";
            }
            return (
              <ListItem disablePadding key={`standing-${i}`}>
                <Avatar
                  sx={{ width: 48, height: 48, bgcolor: avatarColor, mx: 2 }}
                >
                  {i < 3 ? (
                    <WorkspacePremiumOutlinedIcon
                      sx={{ width: 32, height: 32 }}
                    />
                  ) : (
                    i + 1
                  )}
                </Avatar>
                <ListItemText
                  primaryTypographyProps={{ fontSize: "20px" }}
                  secondaryTypographyProps={{ fontSize: "18px" }}
                  primary={x.name}
                  secondary={"Score: " + x.score.toFixed(1)}
                />
              </ListItem>
            );
          })}
          </List>
        </List>
      </Stack>
      <Tooltip title="Return to Main Page">
        <Fab
          color="cyan"
          sx={{ position: "absolute", bottom: 16, right: 16 }}
          onClick={() => navigate("/main")}
        >
          <ExitToAppIcon />
        </Fab>
      </Tooltip>
    </div>
  );
};

export default Leaderboard;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { Stack, Fab, Tooltip, Typography, Paper, Chip } from "@mui/material";
import FormatListNumberedIcon from "@mui/icons-material/FormatListNumbered";
import WorkspacePremiumOutlinedIcon from "@mui/icons-material/WorkspacePremiumOutlined";

const Standings = () => {
  const navigate = useNavigate();
  const [places, setPlaces] = useState([]);
  const [teams, setTeams] = useState([]);

  useEffect(() => {
    axios
      .get(`/retrieve`)
      .then((res) => {
        console.log("RESPONSE RECEIVED: ", res);
        if (res.data.matches.some((match) => !match.done)) {
          navigate("/main");
        }
        setTeams(res.data.teams);
        setPlaces(res.data.matches.slice(-1)[0].teams);
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
        <Stack direction="row" spacing={2}>
          {["1st Place", "2nd Place"].map((x, i) => (
            <Paper variant="elevation" elevation={6} sx={{ padding: 2 }} key={`place-${i}`}>
              <Chip
                label={
                  <Typography variant="h2" textAlign="center">
                    <WorkspacePremiumOutlinedIcon
                      sx={{ width: 48, height: 48 }}
                    />{" "}
                    {x}{" "}
                    <WorkspacePremiumOutlinedIcon
                      sx={{ width: 48, height: 48 }}
                    />
                  </Typography>
                }
                color="orange"
                sx={{ fontSize: "24px", py: 5 }}
              />
              <Typography variant="h3" textAlign="center" sx={{ mt: 2 }}>
                {teams[places[i]]}
              </Typography>
            </Paper>
          ))}
        </Stack>
      </Stack>
      <Tooltip title="Full Leaderboard">
        <Fab
          color="cyan"
          sx={{ position: "absolute", bottom: 16, right: 16 }}
          onClick={() => navigate("/leaderboard")}
        >
          <FormatListNumberedIcon />
        </Fab>
      </Tooltip>
    </div>
  );
};

export default Standings;

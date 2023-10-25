import { useEffect, useState } from "react";
import { Stack, TextField, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Create = () => {
  const [isOngoing, setIsOngoing] = useState(false);
  const [teams, setTeams] = useState([]);
  const [error, setError] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/retrieve`)
      .then((res) => {
        console.log("RESPONSE RECEIVED: ", res);
        setIsOngoing(true);
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
        setIsOngoing(false);
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
        <TextField
          color="cyan"
          error={error}
          helperText={error && "Please enter at least 4 teams"}
          id="team-names"
          label="Team Names"
          placeholder="Each name per line"
          multiline
          variant="filled"
          style={{ width: "480px" }}
          onChange={(e) => {
            setError(false);
            setTeams(
              e.target.value
                .split("\n")
                .map((team) => team.trim())
                .filter((team) => team !== "")
            );
          }}
        />
        <Stack spacing={2} direction="row" justifyContent="space-between">
          <Button
            variant="contained"
            color="magenta"
            onClick={() => {
              if (teams.length < 4) {
                setError(true);
              } else {
                axios
                  .post(`/create`, { teams: teams })
                  .then((res) => {
                    console.log("RESPONSE RECEIVED: ", res);
                    navigate("/main");
                  })
                  .catch((err) => {
                    console.log("AXIOS ERROR: ", err);
                  });
              }
            }}
          >
            Create New Tournament
          </Button>
          {isOngoing && (
            <Button
              variant="outlined"
              color="magenta"
              onClick={() => {
                navigate("/main");
              }}
            >
              Open Ongoing Tournament
            </Button>
          )}
        </Stack>
      </Stack>
    </div>
  );
};

export default Create;

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Stack,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Fade,
  Button,
  Paper,
  Typography,
  Divider,
  Chip,
  ListSubheader,
} from "@mui/material";
import FeaturedPlayListOutlinedIcon from "@mui/icons-material/FeaturedPlayListOutlined";

const Draw = () => {
  const navigate = useNavigate();
  const [groups, setGroups] = useState([[], []]);
  const [names, setNames] = useState([]);
  const [done, setDone] = useState([]);

  useEffect(() => {
    axios
      .get(`/retrieve`)
      .then((res) => {
        console.log("RESPONSE RECEIVED: ", res);
        setGroups(res.data.groups);
        setNames(res.data.teams);
        setDone(Array(res.data.teams.length).fill(false));
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
        navigate("/create");
      });
  }, []);

  return (
    <Stack spacing={2} alignItems="center">
      <img
        src={"/assets/logo.png"}
        style={{ width: "560px", cursor: "pointer" }}
        alt=""
        onClick={() => {
          navigate("/create");
        }}
      />
      <Grid container spacing={2}>
      <Grid item xs={0.5} />
        <Grid item xs={3}>
          <Paper variant="outlined">
            <List
              sx={{
                bgcolor: "background.paper",
              }}
              subheader={
                <ListSubheader style={{ fontSize: "36px", textAlign:"center" }}>
                  <FeaturedPlayListOutlinedIcon
                    sx={{ width: 42, height: 42, mb: -1 }}
                  />{" "}
                  Group A
                  <Divider />
                </ListSubheader>
              }
            >
              {groups[0].map((y) => {
                return (
                  <ListItem disablePadding key={`team-${y}`}>
                    <Fade in={done[y]}>
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: "32px",
                          textAlign: "center",
                        }}
                        primary={names[y]}
                      />
                    </Fade>
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={0.5} />
        <Grid item xs={4}>
          <Stack direction="column" spacing={2}>
            {(done.some((x) => !x) && (
              <List>
                {names.map((x, i) => (
                  <ListItem disablePadding key={`team-${i}`}>
                    <Fade in={!done[i]}>
                      <ListItemButton
                        onClick={() => {
                          setDone(done.map((x, j) => (j === i ? true : x)));
                        }}
                      >
                        <ListItemText
                          primaryTypographyProps={{
                            fontSize: "32px",
                            textAlign: "center",
                          }}
                          primary={x}
                        />
                      </ListItemButton>
                    </Fade>
                  </ListItem>
                ))}
              </List>
            )) ||
              (!done.some((x) => !x) && (
                <Fade in={true}>
                  <Stack direction="column" spacing={1}>
                    <Paper
                      variant="elevation"
                      elevation={6}
                      sx={{ padding: 1, width: "50%", alignSelf: "center" }}
                    >
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Chip
                          label="Semi-Final 1"
                          color="orange"
                          sx={{ fontSize: "20px" }}
                        />
                      </div>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ mt: 1, textAlign: "center" }}
                      >
                        1st Place of Group A
                      </Typography>
                      <Divider>
                        <Typography variant="h6">VS</Typography>
                      </Divider>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ mt: 1, textAlign: "center" }}
                      >
                        2nd Place of Group B
                      </Typography>
                    </Paper>
                    <Paper
                      variant="elevation"
                      elevation={6}
                      sx={{ padding: 1, width: "75%", alignSelf: "center" }}
                    >
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Chip
                          label="Grand Final"
                          color="orange"
                          sx={{ fontSize: "20px" }}
                        />
                      </div>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ mt: 1, textAlign: "center" }}
                      >
                        Winner of Semi-Final 1
                      </Typography>
                      <Divider>
                        <Typography variant="h6">VS</Typography>
                      </Divider>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ mt: 1, textAlign: "center" }}
                      >
                        Winner of Semi-Final 2
                      </Typography>
                    </Paper>
                    <Paper
                      variant="elevation"
                      elevation={6}
                      sx={{ padding: 1, width: "50%", alignSelf: "center" }}
                    >
                      <div
                        style={{ display: "flex", justifyContent: "center" }}
                      >
                        <Chip
                          label="Semi-Final 2"
                          color="orange"
                          sx={{ fontSize: "20px" }}
                        />
                      </div>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ mt: 1, textAlign: "center" }}
                      >
                        1st Place of Group B
                      </Typography>
                      <Divider>
                        <Typography variant="h6">VS</Typography>
                      </Divider>
                      <Typography
                        variant="h5"
                        gutterBottom
                        sx={{ mt: 1, textAlign: "center" }}
                      >
                        2nd Place of Group A
                      </Typography>
                    </Paper>
                    <Button
                      variant="outlined"
                      color="cyan"
                      onClick={() => {
                        navigate("/main");
                      }}
                      sx={{ width: "50%", alignSelf: "center" }}
                    >
                      Proceed to Tournament
                    </Button>
                  </Stack>
                </Fade>
              ))}
          </Stack>
        </Grid>
        <Grid item xs={0.5} />
        <Grid item xs={3}>
          <Paper variant="outlined">
            <List
              sx={{
                bgcolor: "background.paper",
              }}
              subheader={
                <ListSubheader style={{ fontSize: "36px", textAlign:"center" }}>
                  <FeaturedPlayListOutlinedIcon
                    sx={{ width: 42, height: 42, mb: -1 }}
                  />{" "}
                  Group B
                  <Divider />
                </ListSubheader>
              }
            >
              {groups[1].map((y) => {
                return (
                  <ListItem disablePadding key={`team-${y}`}>
                    <Fade in={done[y]}>
                      <ListItemText
                        primaryTypographyProps={{
                          fontSize: "32px",
                          textAlign: "center",
                        }}
                        primary={names[y]}
                      />
                    </Fade>
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={0.5} />
      </Grid>
    </Stack>
  );
};

export default Draw;

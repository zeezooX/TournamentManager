import { useEffect, useState, Fragment } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Grid,
  Paper,
  List,
  ListSubheader,
  Stack,
  ListItem,
  ListItemButton,
  ListItemText,
  Divider,
  Avatar,
  Typography,
  ButtonGroup,
  Button,
  Chip,
  Fab,
  Collapse,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import SportsKabaddiIcon from "@mui/icons-material/SportsKabaddi";
import FeaturedPlayListOutlinedIcon from "@mui/icons-material/FeaturedPlayListOutlined";
import AddIcon from "@mui/icons-material/Add";
import RemoveIcon from "@mui/icons-material/Remove";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";

const Main = () => {
  const navigate = useNavigate();
  const [upcomingMatches, setUpcomingMatches] = useState([]);
  const [ongoingMatch, setOngoingMatch] = useState({
    teams: [],
    score: [],
    bestOf: 0,
  });
  const [groups, setGroups] = useState([[], []]);
  const [names, setNames] = useState([]);
  const [endState, setEndState] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const handleRetrieveMatches = (res) => {
    if (!res.data.matches.some((match) => !match.done)) {
      navigate("/standings");
    }
    const tempGroups = [[], []];
    for (let i = 0; i < 2; i++) {
      res.data.groups[i].forEach((j) => {
        tempGroups[i].push({
          name: res.data.teams[j],
          score: res.data.leaderboard[j],
        });
      });
    }
    tempGroups[0].sort((a, b) => b.score - a.score);
    tempGroups[1].sort((a, b) => b.score - a.score);
    setGroups(tempGroups);
    setNames(res.data.teams);
    const matches = res.data.matches.map((match, i) => {
      const noOfMatches =
        (tempGroups[0].length * (tempGroups[0].length - 1)) / 2 +
        (tempGroups[1].length * (tempGroups[1].length - 1)) / 2;
      const getType = (index) => {
        if (index < noOfMatches) {
          return "Group Stage";
        } else if (index < noOfMatches + 2) {
          return "Semi-Final";
        } else if (index < noOfMatches + 3) {
          return "Third Place";
        } else {
          return "Grand Final";
        }
      };
      return {
        id: i,
        type: getType(i),
        teams: match.teams,
        score: match.score,
        done: match.done,
        bestOf: match.bestOf,
        remainingTime: match.remainingTime,
        isRunning: match.isRunning,
      };
    });
    setUpcomingMatches(matches.filter((match) => !match.done));
    setOngoingMatch(matches[res.data.currentMatch]);
  };

  useEffect(() => {
    axios
      .get(`/retrieve`)
      .then((res) => {
        console.log("RESPONSE RECEIVED: ", res);
        handleRetrieveMatches(res);
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
        navigate("/create");
      });
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      if (ongoingMatch.isRunning && ongoingMatch.remainingTime > 0) {
        setOngoingMatch({
          ...ongoingMatch,
          remainingTime: ongoingMatch.remainingTime - 1,
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [ongoingMatch]);

  const handleMatchClick = (e, match) => {
    e.preventDefault();
    setOngoingMatch(match);
    axios
      .post(`/play`, null, {
        params: {
          matchID: match.id,
        },
      })
      .then((res) => {
        console.log("RESPONSE RECEIVED: ", res);
        handleRetrieveMatches(res);
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  };

  const handleMatchUpdate = (e, score, isRunning = ongoingMatch.isRunning) => {
    e.preventDefault();
    axios
      .post(`/update`, null, {
        params: {
          score0: score[0],
          score1: score[1],
          isRunning: isRunning,
        },
      })
      .then((res) => {
        console.log("RESPONSE RECEIVED: ", res);
        handleRetrieveMatches(res);
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
      });
  };

  return (
    <Grid container spacing={2}>
      <Grid item xs={3}>
        <Paper variant="outlined">
          <List
            sx={{
              width: "100%",
              bgcolor: "background.paper",
              position: "relative",
              overflow: "auto",
              maxHeight: "95vh",
              "& ul": { padding: 0 },
            }}
            subheader={
              <ListSubheader style={{ fontSize: "32px" }}>
                <SportsKabaddiIcon sx={{ width: 36, height: 36, mb: -1 }} />{" "}
                Upcoming Matches
                <Divider />
              </ListSubheader>
            }
          >
            {upcomingMatches.map((x, i) => (
              <div key={`match-${i}`}>
                <ListItemButton
                  onClick={(e) => handleMatchClick(e, x)}
                  sx={x.id === ongoingMatch.id && { bgcolor: "cyan.main" }}
                >
                  <ListItemText
                    primaryTypographyProps={{
                      fontSize: "20px",
                      textAlign: "center",
                      style: {
                        color: x.id === ongoingMatch.id ? "white" : "black",
                      },
                    }}
                    primary=<Fragment>
                      {names[x.teams[0]]} <br />
                      vs
                      <br /> {names[x.teams[1]]}
                    </Fragment>
                  />
                  <Divider />
                </ListItemButton>
                {i !== upcomingMatches.length - 1 && <Divider />}
              </div>
            ))}
          </List>
        </Paper>
      </Grid>
      <Grid item xs={6}>
        <Stack direction="column" spacing={2}>
          <img
            src={"/assets/logo.png"}
            style={{ cursor: "pointer", width: "100%", alignSelf: "center" }}
            alt=""
            onClick={() => {
              navigate("/create");
            }}
          />
          <Paper variant="elevation" elevation={6} sx={{ padding: 2 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <div
                  align="center"
                  onClick={(e) => {
                    handleMatchUpdate(
                      e,
                      ongoingMatch.score,
                      !ongoingMatch.isRunning
                    );
                  }}
                >
                  <Chip
                    label={`
                    ${
                      Math.floor(ongoingMatch.remainingTime / 60) < 10
                        ? "0" + Math.floor(ongoingMatch.remainingTime / 60)
                        : Math.floor(ongoingMatch.remainingTime / 60)
                    }
                     : 
                    ${
                      ongoingMatch.remainingTime % 60 < 10
                        ? "0" + (ongoingMatch.remainingTime % 60)
                        : ongoingMatch.remainingTime % 60
                    }`}
                    color={ongoingMatch.isRunning ? "cyan" : "orange"}
                    sx={{ fontSize: "56px", padding: 4 }}
                  />
                </div>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="h3" align="center">
                  {names[ongoingMatch.teams[0]]}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="h3" align="center">
                  vs
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="h3" align="center">
                  {names[ongoingMatch.teams[1]]}
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="h1" align="center">
                  {ongoingMatch.score[0]}
                </Typography>
              </Grid>
              <Grid item xs={2}>
                <Typography variant="h1" align="center">
                  -
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Typography variant="h1" align="center">
                  {ongoingMatch.score[1]}
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <div align="center">
                  <FormControlLabel
                    control={<Checkbox color="orange" />}
                    label="Line Followed"
                  />
                </div>
              </Grid>
              <Grid item xs={2}></Grid>
              <Grid item xs={5}>
                <div align="center">
                  <FormControlLabel
                    control={<Checkbox color="orange" />}
                    label="Line Followed"
                  />
                </div>
              </Grid>
            </Grid>
          </Paper>
          <Grid container spacing={2} sx={{ pr: 4 }}>
            <Grid item xs={4} textAlign="left">
              <Collapse in={isVisible}>
                <ButtonGroup variant="outlined" color="orange">
                <Button
                    onClick={(e) =>
                      handleMatchUpdate(e, [
                        ongoingMatch.score[0] - 5,
                        ongoingMatch.score[1],
                      ])
                    }
                  >
                    <RemoveIcon />
                    5
                  </Button>
                  <Button
                    onClick={(e) =>
                      handleMatchUpdate(e, [
                        ongoingMatch.score[0] - 1,
                        ongoingMatch.score[1],
                      ])
                    }
                  >
                    <RemoveIcon />
                  </Button>
                  <Button
                    onClick={(e) =>
                      handleMatchUpdate(e, [
                        ongoingMatch.score[0] + 1,
                        ongoingMatch.score[1],
                      ])
                    }
                  >
                    <AddIcon />
                  </Button>
                  <Button
                    onClick={(e) =>
                      handleMatchUpdate(e, [
                        ongoingMatch.score[0] + 10,
                        ongoingMatch.score[1],
                      ])
                    }
                  >
                    <AddIcon />
                    10
                  </Button>
                </ButtonGroup>
              </Collapse>
            </Grid>
            <Grid item xs={4} textAlign="center">
              <Collapse in={isVisible}>
                {endState === false ? (
                  <Button
                    variant="outlined"
                    color="cyan"
                    onClick={() => {
                      setEndState(true);
                      setTimeout(() => {
                        setEndState(false);
                      }, 2000);
                    }}
                  >
                    End Match
                  </Button>
                ) : (
                  <Button
                    variant="contained"
                    color="cyan"
                    onClick={() => {
                      axios
                        .post(`/end`)
                        .then((res) => {
                          console.log("RESPONSE RECEIVED: ", res);
                          handleRetrieveMatches(res);
                        })
                        .catch((err) => {
                          console.log("AXIOS ERROR: ", err);
                        });
                      setEndState(false);
                    }}
                  >
                    End Match
                  </Button>
                )}
              </Collapse>
            </Grid>
            <Grid item xs={4} textAlign="right">
              <Collapse in={isVisible}>
                <ButtonGroup variant="outlined" color="orange">
                <Button
                    onClick={(e) =>
                      handleMatchUpdate(e, [
                        ongoingMatch.score[0],
                        ongoingMatch.score[1] - 5,
                      ])
                    }
                  >
                    <RemoveIcon />
                    5
                  </Button>
                  <Button
                    onClick={(e) =>
                      handleMatchUpdate(e, [
                        ongoingMatch.score[0],
                        ongoingMatch.score[1] - 1,
                      ])
                    }
                  >
                    <RemoveIcon />
                  </Button>
                  <Button
                    onClick={(e) =>
                      handleMatchUpdate(e, [
                        ongoingMatch.score[0],
                        ongoingMatch.score[1] + 1,
                      ])
                    }
                  >
                    <AddIcon />
                  </Button>
                  <Button
                    onClick={(e) =>
                      handleMatchUpdate(e, [
                        ongoingMatch.score[0],
                        ongoingMatch.score[1] + 10,
                      ])
                    }
                  >
                    <AddIcon />
                    10
                  </Button>
                </ButtonGroup>
              </Collapse>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Collapse in={isVisible}>
                <Button
                  variant="contained"
                  color="orange"
                  onClick={() => {
                    navigate("/leaderboard");
                  }}
                >
                  Leaderboard
                </Button>
              </Collapse>
            </Grid>
            <Grid item xs={12} textAlign="center">
              <Fab
                color="cyan"
                onClick={() => {
                  setIsVisible(!isVisible);
                }}
              >
                {isVisible ? <ArrowUpwardIcon /> : <ArrowDownwardIcon />}
              </Fab>
            </Grid>
          </Grid>
        </Stack>
      </Grid>
      <Grid item xs={3}>
        <Stack
          direction="column"
          divider={<Divider orientation="horizontal" flexItem />}
          spacing={2}
        >
          <Paper key={`paper-${0}`} variant="outlined">
            <List
              sx={{
                width: "100%",
                bgcolor: "background.paper",
                position: "relative",
                overflow: "auto",
                // height: "45vh",
                // maxHeight: "45vh",
                "& ul": { padding: 0 },
              }}
              subheader={
                <ListSubheader style={{ fontSize: "32px" }}>
                  <FeaturedPlayListOutlinedIcon
                    sx={{ width: 36, height: 36, mb: -1 }}
                  />{" "}
                  Standings
                  <Divider />
                </ListSubheader>
              }
            >
              {groups[0].map((y, j) => {
                return (
                  <ListItem key={`item-${j}`} disablePadding>
                    <Avatar
                      sx={{
                        width: 48,
                        height: 48,
                        bgcolor: j < 2 ? "cyan.main" : null,
                        mx: 2,
                      }}
                    >
                      {j + 1}
                    </Avatar>
                    <ListItemText
                      primaryTypographyProps={{ fontSize: "20px" }}
                      secondaryTypographyProps={{ fontSize: "18px" }}
                      primary={y.name}
                      secondary={"Score: " + y.score.toFixed(1)}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Paper>
        </Stack>
      </Grid>
    </Grid>
  );
};

export default Main;

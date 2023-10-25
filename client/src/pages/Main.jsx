import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Main = () => {
  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`/retrieve`)
      .then((res) => {
        console.log("RESPONSE RECEIVED: ", res);
        if (!res.data.matches.some((match) => !match.done)) {
          navigate("/leaderboard");
        }
      })
      .catch((err) => {
        console.log("AXIOS ERROR: ", err);
        navigate("/create");
      });
  }, []);

  return (
    <div>
      <h1>Main</h1>
    </div>
  );
};

export default Main;

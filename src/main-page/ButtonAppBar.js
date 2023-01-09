import * as React from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import ChromeReaderModeIcon from "@mui/icons-material/ChromeReaderMode";
import AddTaskIcon from "@mui/icons-material/AddTask";
import { useNavigate } from "react-router-dom";
import SelfImprovementIcon from "@mui/icons-material/SelfImprovement";

const ButtonAppBar = () => {
  const history = useNavigate();
  const [addShlokaIconFlag, setAddShlokaIconFlag] = React.useState(null);
  const [testShlokaIconFlag, setTestShlokaIconFlag] = React.useState(null);

  const updateIcon = () => {
    if (addShlokaIconFlag != null) {
      setAddShlokaIconFlag(!addShlokaIconFlag);
    } else {
      setAddShlokaIconFlag(true);
    }
  };

  React.useEffect(() => {
    if (addShlokaIconFlag != null)
      if (addShlokaIconFlag) {
        history(`/addToList`);
      } else {
        history(`/`);
      }
  }, [addShlokaIconFlag]);

  const updateJapaIcon = () => {
    if (testShlokaIconFlag != null) {
      setTestShlokaIconFlag(!testShlokaIconFlag);
    } else {
      setTestShlokaIconFlag(true);
    }
  };

  React.useEffect(() => {
    if (testShlokaIconFlag != null)
      if (testShlokaIconFlag) {
        history(`/test`);
      } else {
        history(`/`);
      }
  }, [testShlokaIconFlag]);

  return (
    <Box sx={{ flexGrow: 0 }}>
      <AppBar position="static" color="transparent">
        <Toolbar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 0 }} onClick={updateIcon} disabled={testShlokaIconFlag}>
            {addShlokaIconFlag ? (
              <SelfImprovementIcon sx={{ fontSize: 50 }} color={testShlokaIconFlag ? "disabled" : "success"} />
            ) : (
              <AddTaskIcon sx={{ fontSize: 50 }} color={testShlokaIconFlag ? "disabled" : "success"} />
            )}
          </IconButton>
          <Typography align="center" variant="h4" component="div" sx={{ flexGrow: 1 }}>
            <b>JapaShloka</b>
          </Typography>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 0 }} onClick={updateJapaIcon} disabled={addShlokaIconFlag}>
            {testShlokaIconFlag ? (
              <SelfImprovementIcon sx={{ fontSize: 50 }} color={addShlokaIconFlag ? "disabled" : "success"} />
            ) : (
              <ChromeReaderModeIcon sx={{ fontSize: 50 }} color={addShlokaIconFlag ? "disabled" : "success"} />
            )}
          </IconButton>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default ButtonAppBar;

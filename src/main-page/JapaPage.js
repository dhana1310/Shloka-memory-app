import { Avatar, IconButton, Paper, Stack } from "@mui/material";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import { green } from "@mui/material/colors";
import CachedIcon from "@mui/icons-material/Cached";
import { useEffect, useState } from "react";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VibrationIcon from "@mui/icons-material/Vibration";
import { Vibration } from "react-native";

const JapaPage = () => {
  const oneNotEight = 108;
  const [permanent108Count, setPermanent108Count] = useState(0);
  const [permanentRounds, setPermanentRounds] = useState(0);

  const [temporary108Count, setTemporary108Count] = useState(0);
  const [temporaryRounds, setTemporaryRounds] = useState(0);
  var [volumeFlag, setVolumeFlag] = useState(false);
  var [vibrationIconFlag, setVibrationIconFlag] = useState(true);

  useEffect(() => {
    if (localStorage.getItem("savedJapaData") !== null) {
      var savedJapaData = JSON.parse(localStorage.getItem("savedJapaData"));
      setPermanent108Count(savedJapaData.permanent108Count);
      setPermanentRounds(savedJapaData.permanentRounds);
      setTemporary108Count(savedJapaData.temporary108Count);
      setTemporaryRounds(savedJapaData.temporaryRounds);
    }
  }, []);

  const plusButtonHandle = () => {
    var dbTemporary108Count = temporary108Count;
    var dbPermanent108Count = permanent108Count;
    var dbTemporaryRounds = temporaryRounds;
    var dbPermanentRounds = permanentRounds;

    var localtemporary108Count = temporary108Count;
    if (localtemporary108Count < oneNotEight) {
      if (vibrationIconFlag) {
        Vibration.vibrate(80);
      }
      if (volumeFlag) {
        const beepAudio = new Audio("beep-08b.mp3");
        beepAudio.volume = 1.0;
        beepAudio.play();
      }
      dbTemporary108Count = localtemporary108Count + 1;
      dbPermanent108Count = permanent108Count + 1;
      setTemporary108Count(dbTemporary108Count);
      setPermanent108Count(dbPermanent108Count);
    }
    if (localtemporary108Count + 1 === oneNotEight) {
      if (vibrationIconFlag) {
        Vibration.vibrate(1000);
      }
      if (volumeFlag) {
        const audio = new Audio("Conch Shell.mp3");
        audio.volume = 1.0;
        audio.play();
      }
      dbTemporary108Count = 0;
      setTemporary108Count(dbTemporary108Count);

      dbTemporaryRounds = temporaryRounds + 1;
      dbPermanentRounds = permanentRounds + 1;
      setTemporaryRounds(dbTemporaryRounds);
      setPermanentRounds(dbPermanentRounds);
    }
    localStorage.setItem("savedJapaData", saveJapaDateObject(dbPermanent108Count, dbPermanentRounds, dbTemporary108Count, dbTemporaryRounds));
  };

  const minusButtonHandle = () => {
    if (temporary108Count > 0) {
      localStorage.setItem("savedJapaData", saveJapaDateObject(permanent108Count - 1, permanentRounds, temporary108Count - 1, temporaryRounds));
      setTemporary108Count(temporary108Count - 1);
      setPermanent108Count(permanent108Count - 1);
    }
  };

  const refreshTemporaryData = () => {
    localStorage.setItem("savedJapaData", saveJapaDateObject(permanent108Count - temporary108Count, permanentRounds, 0, 0));
    setPermanent108Count(permanent108Count - temporary108Count);
    setTemporary108Count(0);
    setTemporaryRounds(0);
  };

  function volumeButton() {
    setVolumeFlag(!volumeFlag);
  }

  function vibrationButton() {
    setVibrationIconFlag(!vibrationIconFlag);
  }

  const refreshPermanentData = () => {
    localStorage.setItem("savedJapaData", saveJapaDateObject(0, 0, 0, 0));
    setPermanent108Count(0);
    setPermanentRounds(0);
    setTemporary108Count(0);
    setTemporaryRounds(0);
  };

  function saveJapaDateObject(p108Count, pRounds, t108Count, tRounds) {
    return JSON.stringify({ permanent108Count: p108Count, permanentRounds: pRounds, temporary108Count: t108Count, temporaryRounds: tRounds });
  }

  return (
    <div>
      <Paper
        id="showFullShloka"
        sx={{
          // display: "flex",
          justifyContent: "center",
          //   flexWrap: "wrap",
          // listStyle: "none",
          p: 0,
          m: 0,
        }}
        elevation={16}
        // component="p"
      >
        <Stack direction="row" spacing={4} alignItems="center" justifyContent="center" mt={3}>
          <Avatar sx={[{ bgcolor: green[500] }, { width: 70, height: 70 }, { fontSize: 35 }]}>{permanentRounds}</Avatar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 0 }} onClick={refreshPermanentData}>
            <CachedIcon sx={{ fontSize: 60 }} />
          </IconButton>
          <Avatar sx={[{ bgcolor: green[500] }, { width: 70, height: 70 }, { fontSize: 35 }]}>{permanent108Count}</Avatar>
        </Stack>
        <br />
        <Stack direction="row" spacing={4} alignItems="center" justifyContent="center" mt={0}>
          <Avatar sx={[{ bgcolor: green[500] }, { width: 60, height: 60 }, { fontSize: 25 }]}>{temporaryRounds}</Avatar>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 0 }} onClick={refreshTemporaryData}>
            <CachedIcon sx={{ fontSize: 40 }} />
          </IconButton>
          <Avatar sx={[{ bgcolor: green[500] }, { width: 60, height: 60 }, { fontSize: 25 }]}>{temporary108Count}</Avatar>
        </Stack>
        <Stack direction="column" spacing={0} alignItems="center" justifyContent="center" mt={0}>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 0, mt: 0, mb: 0 }} onClick={minusButtonHandle} disabled={temporary108Count === 0}>
            <RemoveCircleIcon sx={{ fontSize: 100 }} color={temporary108Count === 0 ? "disabled" : "success"} />
          </IconButton>
          <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 0, mt: -3 }} onClick={plusButtonHandle}>
            <AddCircleIcon sx={{ fontSize: 250 }} color="success" />
          </IconButton>
        </Stack>
        <IconButton size="large" edge="start" color="inherit" sx={{ mt: 2, mb: 1, mr: 4 }} onClick={volumeButton}>
          <VolumeUpIcon color={volumeFlag ? "inherit" : "disabled"} sx={{ fontSize: 50 }} />
        </IconButton>
        <IconButton size="large" edge="start" color="inherit" sx={{ mt: 2, mb: 1, ml: 4 }} onClick={vibrationButton}>
          <VibrationIcon sx={{ fontSize: 50 }} color={vibrationIconFlag ? "inherit" : "disabled"} />
        </IconButton>
      </Paper>
    </div>
  );
};

export default JapaPage;

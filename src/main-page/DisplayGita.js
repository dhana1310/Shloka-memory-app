import { Box, Button, Card, FormControl, IconButton, InputLabel, LinearProgress, MenuItem, Paper, Select, Switch, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { defaultUiState, errorCode, getDefaultBooksList, getDefaultTimeLineName, getDefaultTimeList, populateToast } from "./Constants";
import parseResponse from "./ParseResponse";
import useFetchMemorisedShlokas from "./useFetchMemorisedShlokas";
import { alpha, styled } from "@mui/material/styles";
import { green } from "@mui/material/colors";
import ShowToast from "./ShowToast";
import { useNavigate } from "react-router-dom";
import { TextDecrease, TextIncrease } from "@mui/icons-material";

const DisplayGita = () => {
  const memorisedShlokas = useFetchMemorisedShlokas();

  const [allShlokasLinesFromText, setAllShlokasLinesFromText] = useState(["loading..."]);
  const [displayOneShloka, setDisplayOneShloka] = useState([]);
  const [originalResponse, setOriginalResponse] = useState({});
  const [savedDisplayUiState, setSavedDisplayUiState] = useState(defaultUiState);
  var defaultShlokas = Array.from(new Set(parseResponse(originalResponse, savedDisplayUiState)[0]));
  const [allShlokaNumbers, setAllShlokaNumbers] = useState(defaultShlokas);
  const [deselectedShlokaNumbers, setDeselectedShlokaNumbers] = useState([]);
  const [timeLineList, setTimeLineList] = useState(getDefaultTimeList);
  // const [randomNumber, setRandomNumber] = useState(0);
  const [displayRandomShlokaNumber, setDisplayRandomShlokaNumber] = useState("");
  const [displayShlokaFlag, setDisplayShlokaFlag] = useState(false);
  const [displayShlokaNumberButtonFlag, setDisplayShlokaNumberButtonFlag] = useState(true);
  const [randomFlow, setRandomFlow] = useState(false);
  const [shlokaFontSize, setShlokaFontSize] = useState(25);
  const [selectBooks, setSelectBooks] = useState([]);
  const [progressTotalSize, setProgressTotalSize] = useState(10000);
  const [progressCurrentSize, setProgressCurrentSize] = useState(0);
  const [showToast, setShowToast] = useState(populateToast(false, "success", "Success", "Your data is saved.", "20%"));

  useEffect(() => {
    var displayUiStateObject = savedDisplayUiState;
    var localSelectBooks = selectBooks.length > 0 ? selectBooks : getDefaultBooksList();
    var localDisplayRandomShlokaNumber = displayRandomShlokaNumber;
    var localDisplayShlokaNumberButtonFlag = displayShlokaNumberButtonFlag;
    var localAllSelectedShlokasFromResponse = [];
    var localAllDeselectedShlokasFromResponse = [];
    var localProgressCurrentSize = progressCurrentSize;
    var localProgressTotalSize = progressTotalSize;
    var localRandomFlow = randomFlow;
    if (localStorage.getItem("savedDisplayUiState") !== null) {
      displayUiStateObject = JSON.parse(localStorage.getItem("savedDisplayUiState"));
      console.log(JSON.stringify(savedDisplayUiState));
      setShlokaFontSize(displayUiStateObject.shlokaFontSize ? displayUiStateObject.shlokaFontSize : 25);
      localSelectBooks.forEach((book) => {
        book.isSelected = displayUiStateObject.currentSelectedBooks.includes(book.bookShortCode);
      });
      if (displayUiStateObject.displayRandomShlokaNumber) {
        localDisplayRandomShlokaNumber = displayUiStateObject.displayRandomShlokaNumber;
      }

      if (displayUiStateObject.allShlokaNumbers) {
        localAllSelectedShlokasFromResponse = displayUiStateObject.allShlokaNumbers;
      }
      if (displayUiStateObject.deselectedShlokaNumbers) {
        localAllDeselectedShlokasFromResponse = displayUiStateObject.deselectedShlokaNumbers;
      }
      if (displayUiStateObject.progressCurrentSize) {
        localProgressCurrentSize = displayUiStateObject.progressCurrentSize;
      }
      if (displayUiStateObject.progressTotalSize) {
        localProgressTotalSize = displayUiStateObject.progressTotalSize;
      }
      localRandomFlow = displayUiStateObject.randomFlow;
      setSavedDisplayUiState(displayUiStateObject);
    }

    if (memorisedShlokas.error === errorCode) {
      localDisplayShlokaNumberButtonFlag = false;
      setShowToast(populateToast(true, "error", "Error", errorCode, "100%"));
    } else {
      // setDisplayShlokaNumberButtonFlag(true);
    }
    if (localAllSelectedShlokasFromResponse.length === 0) {
      const [allSelectedShlokasFromResponse, allDeselectedShlokasFromResponse] = parseResponse(memorisedShlokas, displayUiStateObject);
      localAllSelectedShlokasFromResponse = Array.from(new Set(allSelectedShlokasFromResponse));
      localAllDeselectedShlokasFromResponse = Array.from(new Set(allDeselectedShlokasFromResponse));
    }
    saveAllShlokaNumbers(
      localAllSelectedShlokasFromResponse,
      localAllDeselectedShlokasFromResponse,
      localDisplayRandomShlokaNumber,
      localDisplayShlokaNumberButtonFlag,
      localProgressCurrentSize,
      localProgressTotalSize,
      localRandomFlow,
      localSelectBooks
    );
    // setProgressTotalSize(localProgressTotalSize);
    setOriginalResponse(memorisedShlokas);
  }, [memorisedShlokas]);

  // useEffect(() => {
  //   setProgressTotalSize(allShlokaNumbers.length > 0 ? allShlokaNumbers.length : 100);
  // }, [allShlokaNumbers]);

  const onTimeLineChange = (event) => {
    const name = event.target.value;
    var displayUiStateObject = getDefaultTimeLineName(name);
    const [allSelectedShlokasFromResponse, allDeselectedShlokasFromResponse] = parseResponse(memorisedShlokas, displayUiStateObject);
    saveDisplayUiState(displayUiStateObject, selectBooks, Array.from(new Set(allSelectedShlokasFromResponse)), Array.from(new Set(allDeselectedShlokasFromResponse)));
    resetTheUiComponent(displayUiStateObject);
  };

  function saveAllShlokaNumbers(
    allShlokaNumbers,
    deselectedShlokaNumbers,
    displayRandomShlokaNumber,
    displayShlokaNumberButtonFlag,
    progressCurrentSize,
    progressTotalSize,
    randomFlow,
    localSelectBooks
  ) {
    savedDisplayUiState.deselectedShlokaNumbers = deselectedShlokaNumbers;
    savedDisplayUiState.allShlokaNumbers = allShlokaNumbers;
    savedDisplayUiState.displayRandomShlokaNumber = displayRandomShlokaNumber;
    savedDisplayUiState.displayShlokaNumberButtonFlag = displayShlokaNumberButtonFlag;
    savedDisplayUiState.progressCurrentSize = progressCurrentSize;
    savedDisplayUiState.progressTotalSize = progressTotalSize;
    savedDisplayUiState.randomFlow = randomFlow;
    var currentSelectedBooks = [];
    localSelectBooks.forEach((selectBook, index) => {
      if (selectBook.isSelected) {
        currentSelectedBooks.push(selectBook.bookShortCode);
      }
    });
    savedDisplayUiState.currentSelectedBooks = currentSelectedBooks;

    console.log("Here 2 => " + progressCurrentSize + "/" + progressTotalSize);

    setSelectBooks([...localSelectBooks]);
    setRandomFlow(randomFlow);
    setProgressCurrentSize(progressCurrentSize <= progressTotalSize ? progressCurrentSize : 0);
    setProgressTotalSize(progressTotalSize === 10000 ? allShlokaNumbers.length : progressTotalSize);
    setDisplayShlokaNumberButtonFlag(displayShlokaNumberButtonFlag);
    setDisplayRandomShlokaNumber(displayRandomShlokaNumber);
    setAllShlokaNumbers(allShlokaNumbers);
    setDeselectedShlokaNumbers(deselectedShlokaNumbers);
    populateShlokaTextToDisplay(displayRandomShlokaNumber);
    console.log(JSON.stringify(savedDisplayUiState));
    localStorage.setItem("savedDisplayUiState", JSON.stringify(savedDisplayUiState));
  }

  function saveDisplayUiState(displayUiStateObject, selectBooks, allShlokaNumbers, deselectedShlokaNumbers) {
    var currentSelectedBooks = [];
    selectBooks.forEach((selectBook, index) => {
      if (selectBook.isSelected) {
        currentSelectedBooks.push(selectBook.bookShortCode);
      }
    });
    displayUiStateObject.currentSelectedBooks = currentSelectedBooks;
    displayUiStateObject.randomFlow = randomFlow;
    displayUiStateObject.deselectedShlokaNumbers = deselectedShlokaNumbers;
    displayUiStateObject.allShlokaNumbers = allShlokaNumbers;
    setAllShlokaNumbers(allShlokaNumbers);
    setDeselectedShlokaNumbers(deselectedShlokaNumbers);
    setSavedDisplayUiState(displayUiStateObject);
    localStorage.setItem("savedDisplayUiState", JSON.stringify(displayUiStateObject));
  }

  function resetTheUiComponent(timeLineName) {
    var localDefaultShlokas = Array.from(new Set(parseResponse(originalResponse, timeLineName)[0]));
    deselectedShlokaNumbers.forEach((deselectedShlokaNumber) => {
      if (localDefaultShlokas.includes(deselectedShlokaNumber)) {
        localDefaultShlokas.splice(localDefaultShlokas.indexOf(deselectedShlokaNumber), 1);
      }
    });
    saveAllShlokaNumbers(localDefaultShlokas, deselectedShlokaNumbers, displayRandomShlokaNumber, true, 0, progressTotalSize, randomFlow, selectBooks);
    setDisplayRandomShlokaNumber("");
    setDisplayShlokaFlag(false);
  }

  const viewRandomShloka = () => {
    if (allShlokaNumbers.length === 0) {
      setShowToast(populateToast(true, "info", "Info", "All shlokas done, refreshing", "100%"));
      resetTheUiComponent(savedDisplayUiState);
    } else {
      const index = randomFlow ? Math.floor(Math.random() * allShlokaNumbers.length) : 0;
      // setRandomNumber(ran);
      var nextShloka = allShlokaNumbers[index];
      // setDisplayRandomShlokaNumber(nextShloka);
      populateShlokaTextToDisplay(nextShloka);
      deselectedShlokaNumbers.push(nextShloka);
      allShlokaNumbers.splice(index, 1);
      saveAllShlokaNumbers(allShlokaNumbers, deselectedShlokaNumbers, nextShloka, true, progressCurrentSize + 1, progressTotalSize, randomFlow, selectBooks);
    }
    setDisplayShlokaFlag(false);
    setDisplayOneShloka([]);
  };

  function populateShlokaTextToDisplay(nextShloka) {
    var fileToLoad = "";
    if (nextShloka.startsWith("BG ")) {
      fileToLoad = "/" + nextShloka.substring(0, 2) + "/" + nextShloka.split(".")[0].substring(3) + ".txt";
    } else if (nextShloka.startsWith("SB ")) {
      fileToLoad = "/" + nextShloka.substring(0, 2) + "/" + nextShloka.split(".")[0].substring(3) + "/" + nextShloka.split(".")[1] + ".txt";
    } else if (nextShloka.startsWith("CC ")) {
      fileToLoad = "/" + nextShloka.substring(0, 2) + "/" + nextShloka.split(".")[0].substring(3).split(" ")[0] + "/" + nextShloka.split(".")[0].split(" ")[2] + ".txt";
    }

    fetch(fileToLoad)
      .then((r) => r.text())
      .then((text) => {
        const splitLines = text.split("\n");
        setAllShlokasLinesFromText(Array.from(splitLines.map((line) => line + "\n")));
      });
  }

  const handleDisplayButton = () => {
    displayOneShloka.splice(0, displayOneShloka.length);
    var temp = false;
    var onlyShlokaNumber = "";
    var displayMulitpleShlokaNumbers = "";
    if (displayRandomShlokaNumber.startsWith("BG")) {
      displayMulitpleShlokaNumbers = displayRandomShlokaNumber.split(".")[0] + ".";
      onlyShlokaNumber = displayRandomShlokaNumber.toLowerCase().split(".")[1];
    } else if (displayRandomShlokaNumber.startsWith("SB")) {
      displayMulitpleShlokaNumbers = displayRandomShlokaNumber.split(".")[0] + "." + displayRandomShlokaNumber.split(".")[1] + ".";
      onlyShlokaNumber = displayRandomShlokaNumber.toLowerCase().split(".")[2];
    } else if (displayRandomShlokaNumber.startsWith("CC")) {
      displayMulitpleShlokaNumbers = displayRandomShlokaNumber.split(".")[0] + ".";
      onlyShlokaNumber = displayRandomShlokaNumber.toLowerCase().split(".")[1];
    }
    for (let k = 0; k < allShlokasLinesFromText.length; k++) {
      var multipleCheck = false;

      if (allShlokasLinesFromText[k].trim().toLowerCase().startsWith("texts ")) {
        var multipleShlokas = allShlokasLinesFromText[k].trim().toLowerCase().substring(6).split("-");
        if (parseInt(multipleShlokas[0]) <= parseInt(onlyShlokaNumber) && parseInt(onlyShlokaNumber) <= parseInt(multipleShlokas[1])) {
          multipleCheck = true;
          displayMulitpleShlokaNumbers = displayMulitpleShlokaNumbers + allShlokasLinesFromText[k].trim().toLowerCase().substring(6);
        }
      }

      var check =
        allShlokasLinesFromText[k]
          .trim()
          .toLowerCase()
          .startsWith("text " + onlyShlokaNumber) ||
        allShlokasLinesFromText[k]
          .trim()
          .toLowerCase()
          .startsWith("texts " + onlyShlokaNumber);
      if (check || multipleCheck) {
        temp = true;
        displayOneShloka.push(multipleCheck ? displayMulitpleShlokaNumbers : displayRandomShlokaNumber);
        continue;
      } else if (temp && !allShlokasLinesFromText[k].toLowerCase().startsWith("text")) {
        displayOneShloka.push(allShlokasLinesFromText[k]);
      }
      if (temp && allShlokasLinesFromText[k].toLowerCase().startsWith("text")) {
        break;
      }
    }
    setDisplayOneShloka([...displayOneShloka]);
    setDisplayShlokaFlag(!displayShlokaFlag);
  };

  const ParaDisplay = ({ line }) => {
    if (
      line.toLowerCase().startsWith("synonyms") ||
      line.toLowerCase().startsWith("translation") ||
      line.toLowerCase().startsWith("bg") ||
      line.toLowerCase().startsWith("sb") ||
      line.toLowerCase().startsWith("cc")
    ) {
      return <p style={{ color: "#1b5e20", fontWeight: "bold", fontSize: (shlokaFontSize + 10).toString() + "px" }}>{line}</p>;
    }
    return <p style={{ fontWeight: "bold", fontSize: shlokaFontSize.toString() + "px" }}>{line}</p>;
  };

  const shuffleShlokaNumbers = (allShlokaNumbers, bookShortCode, deselectedShlokaNumbers) => {
    allShlokaNumbers.forEach((shlokaNumber) => {
      if (shlokaNumber.startsWith(bookShortCode)) {
        deselectedShlokaNumbers.push(shlokaNumber);
      }
    });
    deselectedShlokaNumbers.forEach((deselectedShlokaNumber) => {
      if (allShlokaNumbers.includes(deselectedShlokaNumber)) {
        allShlokaNumbers.splice(allShlokaNumbers.indexOf(deselectedShlokaNumber), 1);
      }
    });
  };

  const onBookSelection = (event) => {
    selectBooks.forEach((book) => {
      if (book.bookShortCode === event.target.id) {
        book.isSelected = !book.isSelected;
      }
    });
    saveDisplayUiState(savedDisplayUiState, selectBooks);
    setSelectBooks([...selectBooks]);

    var localAllShlokaNumbers = allShlokaNumbers;
    var localDeselectedShlokaNumbers = deselectedShlokaNumbers;
    if (!event.target.checked) {
      shuffleShlokaNumbers(localAllShlokaNumbers, event.target.id, localDeselectedShlokaNumbers);
    } else {
      shuffleShlokaNumbers(localDeselectedShlokaNumbers, event.target.id, localAllShlokaNumbers);
    }
    console.log("all shloka = " + localAllShlokaNumbers);
    console.log("all deshloka = " + localDeselectedShlokaNumbers);
    var totalProgressSize = localAllShlokaNumbers.length > 0 ? localAllShlokaNumbers.length : 100;
    saveAllShlokaNumbers(
      localAllShlokaNumbers,
      localDeselectedShlokaNumbers,
      displayRandomShlokaNumber,
      localAllShlokaNumbers.length > 0,
      0,
      totalProgressSize,
      randomFlow,
      selectBooks
    );
    // setProgressTotalSize(localAllShlokaNumbers.length > 0 ? localAllShlokaNumbers.length : 100);
  };

  const randomFlowClick = () => {
    var localSavedDisplayUiState = savedDisplayUiState;
    localSavedDisplayUiState.randomFlow = !randomFlow;
    setRandomFlow(!randomFlow);
    console.log(JSON.stringify(localSavedDisplayUiState));
    setSavedDisplayUiState(localSavedDisplayUiState);
    localStorage.setItem("savedDisplayUiState", JSON.stringify(localSavedDisplayUiState));
  };

  const increaseFontSize = () => {
    var localShlokaFontSize = shlokaFontSize + 1;
    if (localShlokaFontSize <= 35) {
      saveFontSize(localShlokaFontSize);
    }
  };

  const decreaseFontSize = () => {
    var localShlokaFontSize = shlokaFontSize - 1;
    if (localShlokaFontSize >= 10) {
      saveFontSize(localShlokaFontSize);
    }
  };

  function saveFontSize(localShlokaFontSize) {
    setShlokaFontSize(localShlokaFontSize);
    var localSavedDisplayUiState = savedDisplayUiState;
    localSavedDisplayUiState.shlokaFontSize = localShlokaFontSize;
    setSavedDisplayUiState(localSavedDisplayUiState);
    localStorage.setItem("savedDisplayUiState", JSON.stringify(localSavedDisplayUiState));
  }

  const GreenSwitch = styled(Switch)(({ theme }) => ({
    "& .MuiSwitch-switchBase.Mui-checked": {
      color: green[900],
      "&:hover": {
        backgroundColor: alpha(green[900], theme.palette.action.hoverOpacity),
      },
    },
    "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
      backgroundColor: green[900],
    },
  }));

  return (
    <div style={{ marginTop: "20px" }}>
      {selectBooks.map((selectBook, index) => (
        <div key={selectBook.bookShortCode}>
          <label style={{ fontWeight: "bold", fontSize: "20px" }}>
            <GreenSwitch type="checkbox" id={selectBook.bookShortCode} checked={selectBook.isSelected} name={selectBook.bookName} onChange={onBookSelection} />
            {selectBook.bookName}
          </label>
          <br />
        </div>
      ))}
      <br />
      <FormControl sx={{ m: 1, minWidth: "40%" }}>
        <InputLabel id="timeline">Timeline</InputLabel>
        <Select labelId="timeline" id="timeline-id" label="Timeline" value={getDefaultTimeLineName(savedDisplayUiState.timeLineName).timeLineName} onChange={onTimeLineChange}>
          {timeLineList.map((c) => (
            <MenuItem key={c.timeLineName} value={c.timeLineName} data-key={c.timeLineName}>
              {c.timeLineName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <div key="randomFlow">
        <label style={{ fontWeight: "bold", fontSize: "20px" }}>
          <GreenSwitch type="checkbox" id="randomFlow" checked={randomFlow} onChange={randomFlowClick} />
          Random
        </label>
        <br />
      </div>
      <br />
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <Box sx={{ width: "100%", mr: 1 }}>
          <LinearProgress variant="determinate" value={(progressCurrentSize * 100) / progressTotalSize} />
        </Box>
        <Box sx={{ minWidth: 35 }}>
          <Typography variant="body2" color="text.secondary">
            <b>{`${Math.round((progressCurrentSize * 100) / progressTotalSize)}%`}</b>
          </Typography>
        </Box>
      </Box>
      <br />
      <Button variant="contained" color="success" onClick={viewRandomShloka} disabled={!displayShlokaNumberButtonFlag}>
        View shloka number
      </Button>
      <br />
      {displayRandomShlokaNumber ? (
        <Card
          sx={{
            // display: "flex",
            justifyContent: "center",
            // flexWrap: "wrap",
            // listStyle: "none",
            p: 1,
            mt: 4,
            mr: 4,
            ml: 4,
            mb: 2,
          }}
          elevation={10}
          component="p"
        >
          <label style={{ fontWeight: "bold", fontSize: "40px" }}>{displayRandomShlokaNumber}</label>
        </Card>
      ) : (
        ""
      )}
      <br />
      <a style={{ textDecoration: "none" }} href={displayShlokaFlag ? "#showFullShloka" : window.scrollTo(0, 0)}>
        <Button
          sx={{
            // display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            // listStyle: "none",
            p: 1,
            mt: 0,
            mr: 1,
            ml: 1,
            mb: 1,
          }}
          variant="contained"
          color="success"
          onClick={handleDisplayButton}
          disabled={!displayRandomShlokaNumber}
        >
          {displayShlokaFlag ? "Hide the shloka" : "Display full shloka"}
        </Button>
      </a>
      <br />
      {displayShlokaFlag ? (
        <Paper
          id="showFullShloka"
          sx={{
            // display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            // listStyle: "none",
            p: 1,
            mt: 3,
            mr: 1,
            ml: 1,
            mb: 3,
          }}
          elevation={10}
          // component="p"
        >
          <div style={{ flexDirection: "row" }}>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ ml: 1, float: "left" }} onClick={decreaseFontSize}>
              <TextDecrease sx={{ fontSize: 30 }} />
            </IconButton>
            <IconButton size="large" edge="start" color="inherit" aria-label="menu" sx={{ mr: 1, float: "right" }} onClick={increaseFontSize}>
              <TextIncrease sx={{ fontSize: 30 }} />
            </IconButton>
          </div>
          <br />
          <br />
          {displayOneShloka.map((line) => (
            <ParaDisplay key={Math.random()} line={line} />
          ))}
        </Paper>
      ) : (
        ""
      )}

      {<ShowToast showToast={showToast}></ShowToast>}
    </div>
  );
};

export default DisplayGita;

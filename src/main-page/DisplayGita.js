import { Box, Button, Card, FormControl, IconButton, InputLabel, LinearProgress, MenuItem, Paper, Select, Typography } from "@mui/material";
import { useState, useEffect } from "react";
import { defaultUiState, errorCode, getDefaultBooksList, getDefaultTimeLineName, getDefaultTimeList, populateToast } from "./Constants";
import parseResponse from "./ParseResponse";
import useFetchMemorisedShlokas from "./useFetchMemorisedShlokas";
import ShowToast from "./ShowToast";
import { useNavigate } from "react-router-dom";
import { TextDecrease, TextIncrease } from "@mui/icons-material";
import GreenSwitch from "./GreenSwitch";

const DisplayGita = () => {
  const memorisedShlokas = useFetchMemorisedShlokas();

  const [allShlokasLinesFromText, setAllShlokasLinesFromText] = useState(["loading..."]);
  const [displayOneShlokaText, setDisplayOneShlokaText] = useState([]);
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
  const [flowType, setFlowType] = useState(true);
  const [shlokaFontSize, setShlokaFontSize] = useState(25);
  const [selectBooks, setSelectBooks] = useState([]);
  const [progressTotalSize, setProgressTotalSize] = useState(100);
  const [progressCurrentSize, setProgressCurrentSize] = useState(0);
  const [showToast, setShowToast] = useState(populateToast(false, "success", "Success", "Your data is saved.", "20%"));

  useEffect(() => {
    var displayUiStateObject = savedDisplayUiState;
    var localSelectBooks = selectBooks.length > 0 ? selectBooks : getDefaultBooksList();
    if (localStorage.getItem("savedDisplayUiState") !== null) {
      displayUiStateObject = JSON.parse(localStorage.getItem("savedDisplayUiState"));
      setShlokaFontSize(displayUiStateObject.shlokaFontSize ? displayUiStateObject.shlokaFontSize : 25);
      localSelectBooks.forEach((book) => {
        book.isSelected = displayUiStateObject.currentSelectedBooks.includes(book.bookShortCode);
      });
      setFlowType(displayUiStateObject.flowType);
      setSavedDisplayUiState(displayUiStateObject);
    }
    setSelectBooks([...localSelectBooks]);

    if (memorisedShlokas.error === errorCode) {
      setDisplayShlokaNumberButtonFlag(false);
      setShowToast(populateToast(true, "error", "Error", errorCode, "100%"));
    } else {
      setDisplayShlokaNumberButtonFlag(true);
    }
    const [allSelectedShlokasFromResponse, allDeselectedShlokasFromResponse] = parseResponse(memorisedShlokas, displayUiStateObject);
    setAllShlokaNumbers(Array.from(new Set(allSelectedShlokasFromResponse)));
    setDeselectedShlokaNumbers(Array.from(new Set(allDeselectedShlokasFromResponse)));
    setOriginalResponse(memorisedShlokas);
    setProgressTotalSize(allShlokaNumbers.length > 0 ? allShlokaNumbers.length : 100);
  }, [memorisedShlokas]);

  useEffect(() => {
    setProgressTotalSize(allShlokaNumbers.length > 0 ? allShlokaNumbers.length : 100);
  }, [allShlokaNumbers]);

  const onTimeLineChange = (event) => {
    const name = event.target.value;
    var displayUiStateObject = getDefaultTimeLineName(name);
    saveDisplayUiState(displayUiStateObject, selectBooks);
    const [allSelectedShlokasFromResponse, allDeselectedShlokasFromResponse] = parseResponse(memorisedShlokas, displayUiStateObject);
    setAllShlokaNumbers(Array.from(new Set(allSelectedShlokasFromResponse)));
    setDeselectedShlokaNumbers(Array.from(new Set(allDeselectedShlokasFromResponse)));
    resetTheUiComponent(displayUiStateObject);
  };

  function saveDisplayUiState(displayUiStateObject, selectBooks) {
    var currentSelectedBooks = [];
    selectBooks.forEach((selectBook, index) => {
      if (selectBook.isSelected) {
        currentSelectedBooks.push(selectBook.bookShortCode);
      }
    });
    displayUiStateObject.currentSelectedBooks = currentSelectedBooks;
    displayUiStateObject.flowType = flowType;
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
    setAllShlokaNumbers(localDefaultShlokas);
    setProgressCurrentSize(0);
    setProgressTotalSize(localDefaultShlokas.length);
    setDisplayRandomShlokaNumber("");
    setDisplayShlokaNumberButtonFlag(localDefaultShlokas.length > 0);
    setDisplayShlokaFlag(false);
  }

  const viewRandomShloka = () => {
    if (allShlokaNumbers.length === 0) {
      setShowToast(populateToast(true, "info", "Info", "All shlokas done, refreshing", "100%"));
      resetTheUiComponent(savedDisplayUiState);
    } else {
      const index = flowType ? Math.floor(Math.random() * allShlokaNumbers.length) : 0;
      // setRandomNumber(ran);
      var nextShloka = allShlokaNumbers[index];
      setDisplayRandomShlokaNumber(nextShloka);

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
      setProgressCurrentSize(progressCurrentSize + 1);
      allShlokaNumbers.splice(index, 1);
      setAllShlokaNumbers(allShlokaNumbers);
    }
    setDisplayShlokaFlag(false);
    setDisplayOneShlokaText([]);
  };

  const handleDisplayButton = () => {
    displayOneShlokaText.splice(0, displayOneShlokaText.length);
    setDisplayOneShlokaText(displayOneShlokaText);
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
        displayOneShlokaText.push(multipleCheck ? displayMulitpleShlokaNumbers : displayRandomShlokaNumber);
        continue;
      } else if (temp && !allShlokasLinesFromText[k].toLowerCase().startsWith("text")) {
        displayOneShlokaText.push(allShlokasLinesFromText[k]);
      }
      if (temp && allShlokasLinesFromText[k].toLowerCase().startsWith("text")) {
        break;
      }
    }
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
    // console.log(event.target.id + "=" + event.target.checked);
    if (!event.target.checked) {
      shuffleShlokaNumbers(localAllShlokaNumbers, event.target.id, localDeselectedShlokaNumbers);
    } else {
      shuffleShlokaNumbers(localDeselectedShlokaNumbers, event.target.id, localAllShlokaNumbers);
    }
    setAllShlokaNumbers(localAllShlokaNumbers);
    setDeselectedShlokaNumbers(localDeselectedShlokaNumbers);
    setDisplayShlokaNumberButtonFlag(localAllShlokaNumbers.length > 0);
    setProgressTotalSize(localAllShlokaNumbers.length > 0 ? localAllShlokaNumbers.length : 100);
    setProgressCurrentSize(0);
  };

  const flowTypeClick = () => {
    var localSavedDisplayUiState = savedDisplayUiState;
    localSavedDisplayUiState.flowType = !flowType;
    setFlowType(!flowType);
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
      <div key="flowType">
        <label style={{ fontWeight: "bold", fontSize: "20px" }}>
          <GreenSwitch type="checkbox" id="flowType" checked={flowType} onChange={flowTypeClick} />
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
        View shloka
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
          {displayShlokaFlag ? "Hide the shloka" : "Display the shloka"}
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
          {displayOneShlokaText.map((line) => (
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

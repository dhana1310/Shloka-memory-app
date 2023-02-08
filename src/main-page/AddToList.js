import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";
import useFetchMemorisedShlokas from "./useFetchMemorisedShlokas";
import parseResponse from "./ParseResponse";
import { shlokaList, createSequenceList, defaultCurrentSelectedDetails, getDefaultBookName, populateToast, errorCode, defaultUiState } from "./Constants";
import ChipsArray from "./ChipsArray";
import { Button, Checkbox, FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import ShowToast from "./ShowToast";

const AddToList = () => {
  const memorisedShlokas = useFetchMemorisedShlokas();
  const [totalChaptersList, setTotalChaptersList] = useState([]);
  const [totalCantosList, setTotalCantosList] = useState([]);
  const [totalShlokaList, setTotalShlokaList] = useState([]);
  const [totalSelectedShlokaList, setTotalSelectedShlokaList] = useState([]);
  const [currentSelectedDetails, setCurrentSelectedDetails] = useState(defaultCurrentSelectedDetails);
  const [showToast, setShowToast] = useState(populateToast(false, "error", "Error", "Unable to fetch the existing shlokas!!", "100%"));
  const { shortCode } = useParams();
  const history = useNavigate();

  const populateChaptersDropDown = (shloka) => {
    var chapterDropDown = ["Select the chapter"];
    chapterDropDown.push(...createSequenceList(shloka.chaptersList.length));
    setTotalChaptersList(chapterDropDown);
  };

  useEffect(() => {
    if (memorisedShlokas.error === errorCode) {
      localStorage.setItem("savedShlokas", JSON.stringify(defaultCurrentSelectedDetails));
    }
    if (shortCode) {
      var shortCodeLocal = shortCode.toUpperCase();
      memorisedShlokas.onScreenCurrentBook = shortCodeLocal;
      populateTheDropDowns(shortCodeLocal);
    }
    setCurrentSelectedDetails(memorisedShlokas);
    setTotalSelectedShlokaList(Array.from(new Set(parseResponse(memorisedShlokas, defaultUiState)[0])));
  }, [memorisedShlokas]);

  const populateTheDropDowns = (shortCode) => {
    shlokaList.forEach((shloka) => {
      if (shortCode === shloka.bookShortCode) {
        var cantoDropDown = [];
        if (shortCode === "BG") {
          populateChaptersDropDown(shloka);
        } else if (shortCode === "SB") {
          cantoDropDown = ["Select the canto"];
          cantoDropDown.push(...createSequenceList(shloka.cantosList.length));
          setTotalCantosList(cantoDropDown);
        } else if (shortCode === "CC") {
          cantoDropDown = ["Select the lila"];
          cantoDropDown.push(...["Adi", "Madhya", "Antya"]);
          setTotalCantosList(cantoDropDown);
        }
      }
    });
  };

  const onBookChange = (event) => {
    setTotalChaptersList([]);
    setTotalShlokaList([]);
    setTotalCantosList([]);
    // const selectedIndex = event.target.options.selectedIndex;
    // const shortCode = event.target.options[selectedIndex].getAttribute("data-key");
    const shortCode = event.target.value;
    currentSelectedDetails.onScreenCurrentBook = shortCode;
    populateTheDropDowns(shortCode);
    setCurrentSelectedDetails(currentSelectedDetails);

    // history(`/addToList/${shortCode}`);
  };

  const onCantoChange = (event) => {
    setTotalChaptersList([]);
    setTotalShlokaList([]);
    // const selectedIndex = e.target.options.selectedIndex;
    // const cantoShortCode = e.target.options[selectedIndex].getAttribute("data-key");
    const cantoShortCode = event.target.value.toString();
    currentSelectedDetails.onScreenCurrentCanto = cantoShortCode;
    // console.log(currentSelectedDetails.onScreenCurrentBook + " -> " + cantoShortCode + " -> " + e.target.value);
    shlokaList
      .filter((selectedBook) => selectedBook.bookShortCode === currentSelectedDetails.onScreenCurrentBook)
      .forEach((selectedBook) => {
        selectedBook.cantosList
          .filter((canto) => canto.cantoNumber === cantoShortCode)
          .forEach((canto) => {
            var chapterDropDown = ["Select the chapter"];
            chapterDropDown.push(...createSequenceList(canto.chaptersList.length));
            setTotalChaptersList(chapterDropDown);

            currentSelectedDetails.allShlokasList
              .filter((shloka) => shloka.bookShortCode === currentSelectedDetails.onScreenCurrentBook)
              .forEach((shloka) => {
                if (shloka.cantosList.filter((canto) => canto.cantoNumber === cantoShortCode).length === 0) {
                  shloka.cantosList.push({ cantoNumber: cantoShortCode, chaptersList: [] });
                }
                shloka.cantosList.sort((a,b) => a.cantoNumber - b.cantoNumber);
              });

            setCurrentSelectedDetails(currentSelectedDetails);
          });
      });

    // history(`/addToList/${shortCode}`);
  };

  const onChapterChange = (event) => {
    setTotalShlokaList([]);
    // const selectedIndex = e.target.options.selectedIndex;
    // const shortCode = e.target.options[selectedIndex].getAttribute("data-key");
    currentSelectedDetails.onScreenCurrentChapterNumber = event.target.value.toString();
    shlokaList
      .filter((selectedBook) => selectedBook.bookShortCode === currentSelectedDetails.onScreenCurrentBook)
      .forEach((selectedBook) => {
        if (currentSelectedDetails.onScreenCurrentBook === "BG") {
          selectedBook.chaptersList
            .filter((chapter) => chapter.chapterNumber === currentSelectedDetails.onScreenCurrentChapterNumber)
            .forEach((chapter) => {
              setTotalShlokaList(chapter.allShlokaCount);
            });

          currentSelectedDetails.allShlokasList
            .filter((shloka) => shloka.bookShortCode === currentSelectedDetails.onScreenCurrentBook)
            .forEach((shloka) => {
              if (shloka.chaptersList.filter((chapter) => chapter.chapterNumber === currentSelectedDetails.onScreenCurrentChapterNumber).length === 0) {
                shloka.chaptersList.push({ chapterNumber: currentSelectedDetails.onScreenCurrentChapterNumber, selectedShlokas: [] });
              }
              shloka.chaptersList.sort((a,b) => a.chapterNumber - b.chapterNumber);
            });
        } else if (currentSelectedDetails.onScreenCurrentBook === "SB" || currentSelectedDetails.onScreenCurrentBook === "CC") {
          selectedBook.cantosList
            .filter((canto) => canto.cantoNumber === currentSelectedDetails.onScreenCurrentCanto)
            .forEach((canto) => {
              canto.chaptersList
                .filter((chapter) => chapter.chapterNumber === currentSelectedDetails.onScreenCurrentChapterNumber)
                .forEach((chapter) => {
                  setTotalShlokaList(chapter.allShlokaCount);
                });
            });

          currentSelectedDetails.allShlokasList
            .filter((shloka) => shloka.bookShortCode === currentSelectedDetails.onScreenCurrentBook)
            .forEach((shloka) => {
              shloka.cantosList
                .filter((canto) => canto.cantoNumber === currentSelectedDetails.onScreenCurrentCanto)
                .forEach((canto) => {
                  if (canto.chaptersList.filter((chapter) => chapter.chapterNumber === currentSelectedDetails.onScreenCurrentChapterNumber).length === 0) {
                    canto.chaptersList.push({ chapterNumber: currentSelectedDetails.onScreenCurrentChapterNumber, selectedShlokas: [] });
                  }
                  canto.chaptersList.sort((a,b) => a.chapterNumber - b.chapterNumber);
                });
            });
        }
        setCurrentSelectedDetails(currentSelectedDetails);
      });

    // history(`/addToList/${shortCode}`);
  };

  const addRemoveShlokas = (event, chapter, shlokaValue) => {
    if (!totalSelectedShlokaList.includes(shlokaValue)) {
      totalSelectedShlokaList.push(shlokaValue);
    } else {
      totalSelectedShlokaList.splice(totalSelectedShlokaList.indexOf(shlokaValue), 1);
    }
    var [isShlokaPresent, index] = hasShloka(chapter.selectedShlokas, event.target.id);
    if (event.target.checked && !isShlokaPresent) {
      var today = new Date();
      // today.setDate(today.getDate() - 9);
      chapter.selectedShlokas.push({ shlokaNumber: event.target.id, addedDate: today });
    } else if (!event.target.checked) {
      if (isShlokaPresent) {
        chapter.selectedShlokas.splice(index, 1);
      }
    }
    chapter.selectedShlokas.sort((a,b) => a.shlokaNumber - b.shlokaNumber);
  };

  const hasShloka = (selectedShlokas, id) => {
    var isPresent = false;
    var localIndex = 0;
    selectedShlokas.forEach((shloka, index) => {
      if (shloka.shlokaNumber === id) {
        isPresent = true;
        localIndex = index;
      }
    });
    return [isPresent, localIndex];
  };

  const shlokaNumberSelection = (event) => {
    var shlokaValue = currentSelectedDetails.onScreenCurrentBook + " ";
    if (currentSelectedDetails.onScreenCurrentBook === "BG") {
      currentSelectedDetails.allShlokasList
        .filter((shloka) => shloka.bookShortCode === currentSelectedDetails.onScreenCurrentBook)
        .forEach((shloka) => {
          shloka.chaptersList
            .filter((chapter) => chapter.chapterNumber === currentSelectedDetails.onScreenCurrentChapterNumber)
            .forEach((chapter) => {
              shlokaValue = shlokaValue + currentSelectedDetails.onScreenCurrentChapterNumber + "." + event.target.id;
              addRemoveShlokas(event, chapter, shlokaValue);
            });
        });
    } else if (currentSelectedDetails.onScreenCurrentBook === "SB" || currentSelectedDetails.onScreenCurrentBook === "CC") {
      currentSelectedDetails.allShlokasList
        .filter((shloka) => shloka.bookShortCode === currentSelectedDetails.onScreenCurrentBook)
        .forEach((shloka) => {
          shloka.cantosList
            .filter((canto) => canto.cantoNumber === currentSelectedDetails.onScreenCurrentCanto)
            .forEach((canto) => {
              canto.chaptersList
                .filter((chapter) => chapter.chapterNumber === currentSelectedDetails.onScreenCurrentChapterNumber)
                .forEach((chapter) => {
                  shlokaValue =
                    shlokaValue +
                    currentSelectedDetails.onScreenCurrentCanto +
                    (currentSelectedDetails.onScreenCurrentBook === "CC" ? " " : ".") +
                    currentSelectedDetails.onScreenCurrentChapterNumber +
                    "." +
                    event.target.id;
                  addRemoveShlokas(event, chapter, shlokaValue);
                });
            });
        });
    }
    setTotalSelectedShlokaList([...totalSelectedShlokaList]);

    setCurrentSelectedDetails(currentSelectedDetails);
  };

  const saveMemorisedShlokas = async () => {
    const rsp = await fetch("http://localhost:8080/api/v1/shlokas", {
      method: "POST",
      body: JSON.stringify(currentSelectedDetails),
      headers: {
        "Content-type": "application/json",
      },
    })
      .then((response) => {
        if (response.ok) {
          setShowToast(populateToast(true, "success", "Success", "Your data is saved!!", "100%"));
          return response.json();
        }
        throw new Error("Something went wrong");
      })
      .catch((error) => {
        console.error("Unable to save the data!!");
        setShowToast(populateToast(true, "error", "Error", "Unable to save the data!!", "100%"));
      });
  };

  const onSubmit = (event) => {
    event.preventDefault();
    currentSelectedDetails.error = null;
    localStorage.setItem("savedShlokas", JSON.stringify(currentSelectedDetails));
    setShowToast(populateToast(true, "success", "Success", "Your data is saved!!", "100%"));
    console.log(JSON.stringify(currentSelectedDetails));
    // saveMemorisedShlokas();
  };

  return (
    <div>
      <div className="row mt-3">
        <div className="col-md-14 mb-3">
          <div>
            <FormControl sx={{ m: 1, minWidth: "80%" }}>
              <InputLabel id="demo-simple-select-helper-label">Book</InputLabel>
              <Select labelId="demo-simple-select-helper-label" id="demo-simple-select-helper" defaultValue={getDefaultBookName(shortCode)} label="Book" onChange={onBookChange}>
                {shlokaList.map((c) => (
                  <MenuItem key={c.bookShortCode} value={c.bookShortCode} data-key={c.bookShortCode}>
                    {c.bookName}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </div>
          {totalCantosList.length > 0 && (
            <div>
              {currentSelectedDetails.onScreenCurrentBook === "SB" ? (
                <FormControl sx={{ m: 1, minWidth: "80%" }}>
                  <InputLabel id="canto-select">Canto</InputLabel>
                  <Select labelId="canto-select" id="canto-select-id" defaultValue={""} label="Canto" onChange={onCantoChange}>
                    {totalCantosList.map((c) => (
                      <MenuItem key={c} value={c} data-key={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <FormControl sx={{ m: 1, minWidth: "80%" }}>
                  <InputLabel id="lila-select">Lila</InputLabel>
                  <Select labelId="lila-select" id="lila-select-id" defaultValue={""} label="Lila" onChange={onCantoChange}>
                    {totalCantosList.map((c) => (
                      <MenuItem key={c} value={c} data-key={c}>
                        {c}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </div>
          )}
          {totalChaptersList.length > 0 && (
            <div>
              <FormControl sx={{ m: 1, minWidth: "80%" }}>
                <InputLabel id="chapter-select">Chapter</InputLabel>
                <Select labelId="chapter-select" id="chapter-select-id" defaultValue={""} label="chapter" onChange={onChapterChange}>
                  {totalChaptersList.map((c) => (
                    <MenuItem key={c} value={c} data-key={c}>
                      {c}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </div>
          )}
          <form>
            {totalShlokaList.map((shlokaNumber) => (
              <div key={`${currentSelectedDetails.onScreenCurrentChapterNumber}.` + shlokaNumber}>
                <label
                  style={{
                    // display: "inline-block",
                    float: "left",
                    marginLeft: "20px",
                  }}
                >
                  <Checkbox
                    type="checkbox"
                    // id={`${shlokaNumber}`}
                    id={`${shlokaNumber}`}
                    name="vehicle1"
                    checked={totalSelectedShlokaList.includes(
                      currentSelectedDetails.onScreenCurrentBook +
                        " " +
                        (currentSelectedDetails.onScreenCurrentBook === "BG"
                          ? ""
                          : currentSelectedDetails.onScreenCurrentBook === "CC"
                          ? currentSelectedDetails.onScreenCurrentCanto + " "
                          : currentSelectedDetails.onScreenCurrentCanto + ".") +
                        currentSelectedDetails.onScreenCurrentChapterNumber +
                        "." +
                        shlokaNumber
                    )}
                    onChange={shlokaNumberSelection}
                  />
                  {shlokaNumber}
                </label>
              </div>
            ))}
          </form>
          <br />
        </div>
      </div>
      <div className="row mt-3">
        {totalShlokaList.length > 0 ? (
          <Button variant="contained" color="success" className="btn btn-primary mt-2" onClick={onSubmit}>
            Submit
          </Button>
        ) : (
          ""
        )}
      </div>
      <div className="row mt-3">
        <ChipsArray totalSelectedShlokaList={totalSelectedShlokaList} />
      </div>
      {<ShowToast showToast={showToast}></ShowToast>}
    </div>
  );
};

export default AddToList;

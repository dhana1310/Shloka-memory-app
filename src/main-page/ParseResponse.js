const parseResponse = (response, savedDisplayUiState) => {
  var allSelectedShlokasFromResponse = [];
  var allDeselectedShlokasFromResponse = [];
  var fromDate = new Date();
  fromDate.setDate(fromDate.getDate() - savedDisplayUiState.numOfDays);
  if (response && response.allShlokasList) {
    response.allShlokasList
      .forEach((book) => {
        if(savedDisplayUiState.currentSelectedBooks.includes(book.bookShortCode)) {
          populateTheShlokaNumbers(book, fromDate, allSelectedShlokasFromResponse);
        } else {
          populateTheShlokaNumbers(book, fromDate, allDeselectedShlokasFromResponse);
        }
      });
  }
  return [allSelectedShlokasFromResponse, allDeselectedShlokasFromResponse];
};

const isShlokaFallingWithinTheRange = (fromDate, shlokaInsertedDate) => {
  var shlokaDate = new Date(shlokaInsertedDate);
  return shlokaDate > fromDate;
};

export default parseResponse;
function populateTheShlokaNumbers(book, fromDate, shlokasFromResponse) {
  if (book.chaptersList.length > 0) {
    book.chaptersList.forEach((chapter) => {
      chapter.selectedShlokas
        .filter((shloka) => isShlokaFallingWithinTheRange(fromDate, shloka.addedDate))
        .forEach((shloka) => {
          shlokasFromResponse.push(book.bookShortCode + " " + chapter.chapterNumber + "." + shloka.shlokaNumber);
        });
    });
  }
  if (book.cantosList.length > 0) {
    book.cantosList.forEach((canto) => {
      canto.chaptersList.forEach((chapter) => {
        chapter.selectedShlokas
          .filter((shloka) => isShlokaFallingWithinTheRange(fromDate, shloka.addedDate))
          .forEach((shloka) => {
            shlokasFromResponse.push(book.bookShortCode + " " + canto.cantoNumber + (book.bookShortCode === "CC" ? " " : ".") + chapter.chapterNumber + "." + shloka.shlokaNumber);
          });
      });
    });
  }
}


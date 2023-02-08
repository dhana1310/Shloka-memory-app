import { Alert, AlertTitle, Snackbar } from "@mui/material";
import { useState, useEffect } from "react";

const ShowToast = ({ showToast }) => {
  const [displayToast, setDisplayToast] = useState(showToast.show);

  useEffect(() => {
    setDisplayToast(showToast.show);
  }, [showToast]);

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setDisplayToast(false);
  };

  return (
    <Snackbar anchorOrigin={{ vertical: "top", horizontal: "right" }} open={displayToast} autoHideDuration={3000} severity={showToast.severity} onClose={handleClose} key={"topright"}>
      <Alert onClose={handleClose} variant="filled" severity={showToast.severity} sx={{ width: showToast.width }}>
        <AlertTitle>{showToast.title}</AlertTitle>
        <strong>{showToast.msg}</strong>
      </Alert>
    </Snackbar>
  );
};

export default ShowToast;

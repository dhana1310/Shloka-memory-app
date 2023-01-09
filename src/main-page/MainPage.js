import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MainPage = () => {
  const history = useNavigate();
  const buttonClick = () => {
    history(`/addToList`);
  };
  const onTestClick = () => {
    history(`/start`);
  };

  return (
    <div>
      <br />
      <Button variant="contained" color="success" onClick={buttonClick}>Add/Remove Shlokas to List</Button>
      <br />
      <br />
      <Button variant="contained" color="success" onClick={onTestClick}>Test random shloka</Button>
    </div>
  );
};

export default MainPage;

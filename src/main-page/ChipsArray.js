import * as React from "react";
import { styled } from "@mui/material/styles";
import Chip from "@mui/material/Chip";
import Paper from "@mui/material/Paper";

const ListItem = styled("li")(({ theme }) => ({
  margin: theme.spacing(0.5),
}));

const ChipsArray = ({ totalSelectedShlokaList }) => {
  const [chipData, setChipData] = React.useState(totalSelectedShlokaList);

  React.useEffect(() => {
    setChipData([...totalSelectedShlokaList]);
  }, [totalSelectedShlokaList]);

  //   const handleDelete = (chipToDelete) => () => {
  //     if (totalSelectedShlokaList.includes(chipToDelete)) {
  //       totalSelectedShlokaList.splice(totalSelectedShlokaList.indexOf(chipToDelete), 1);
  //     }
  //     setChipData([...totalSelectedShlokaList]);
  //   };

  return (
    <div>
      <label>
        <b>Existing/newly selected shlokas</b>
      </label>
      <Paper
        sx={{
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          listStyle: "none",
          p: 0.5,
          m: 3,
        }}
        component="ul"
      >
        {chipData.map((data) => {
          return (
            <ListItem key={data}>
              <Chip
                //   icon={icon}
                color={data.startsWith("BG") ? "primary" : data.startsWith("SB") ? "success" : "secondary"}
                label={data}
                //   onDelete={data.label === 'React' ? undefined : handleDelete(data)}
              />
            </ListItem>
          );
        })}
      </Paper>
    </div>
  );
};

export default ChipsArray;

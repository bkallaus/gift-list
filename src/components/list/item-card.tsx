import { Box, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ListCard = ({
  item,
  url,
  removeItem,
}: {
  item: string;
  url?: string;
  removeItem: (id: string) => void;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        border: "1px solid gray",
        borderRadius: "5px",
      }}
    >
      <Box>
        <Typography>{item}</Typography>
        <Typography color="text.secondary">{url}</Typography>
      </Box>
      <IconButton
        className="border-gray-400 border rounded p-3 float-right"
        onClick={() => removeItem(item)}
      >
        <DeleteIcon />
      </IconButton>
    </Box>
  );
};

export default ListCard;

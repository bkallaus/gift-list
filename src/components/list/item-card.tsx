import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";

const ListCard = ({
  item,
  removeItem,
}: {
  item: string;
  removeItem: (id: string) => void;
}) => {
  return (
    <div className="border-gray-400 border rounded p-3 flex justify-between">
      <h2>{item}</h2>
      <IconButton
        className="border-gray-400 border rounded p-3 float-right"
        onClick={() => removeItem(item)}
      >
        <DeleteIcon />
      </IconButton>
    </div>
  );
};

export default ListCard;

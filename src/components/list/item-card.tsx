import { Box, IconButton, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Redeem, RemoveShoppingCart } from "@mui/icons-material";

const ListCard = ({
  item,
  url,
  purchased,
  purchase,
  removeItem,
}: {
  item: string;
  purchased?: boolean;
  purchase: () => void;
  url?: string;
  removeItem?: (id: string) => void;
}) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "space-between",
        border: "1px solid gainsboro",
        borderRadius: "5px",
        padding: 1,
      }}
    >
      <Box>
        <Typography fontWeight={500} fontSize={18}>
          {item}
        </Typography>
        <Typography>{url}</Typography>
      </Box>
      <Box>
        <IconButton
          title={purchased ? "Mark as Not Purchased" : "Mark as Purchased"}
          onClick={purchase}
        >
          {purchased ? <RemoveShoppingCart /> : <Redeem />}
        </IconButton>
        {removeItem && (
          <IconButton onClick={() => removeItem(item)}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  );
};

export default ListCard;

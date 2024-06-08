import { Box, IconButton, Paper, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Redeem, RemoveShoppingCart, LinkRounded } from "@mui/icons-material";
import { BorderedPaper } from "../bordered-paper";

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
  const urlWithHttps = url?.includes("http") ? url : `https://${url}`;

  return (
    <BorderedPaper
      sx={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography fontWeight={500} fontSize={18}>
          {item}
        </Typography>
      </Box>
      <Box>
        {url && (
          <IconButton target="_blank" href={urlWithHttps}>
            <LinkRounded />
          </IconButton>
        )}
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
    </BorderedPaper>
  );
};

export default ListCard;

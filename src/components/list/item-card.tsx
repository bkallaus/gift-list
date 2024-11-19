import { Box, Button, IconButton, Paper, Typography } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { Redeem, RemoveShoppingCart, LinkRounded } from "@mui/icons-material";
import { BorderedPaper } from "../bordered-paper";
import ConfirmDialog from "../confirm-dialog";
import { useState } from "react";

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

  const [showConfirm, setShowConfirm] = useState(false);

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
      <Button onClick={purchase}>
        {purchased ? (
          <Box display={"flex"} gap={1}>
            Mark as Not Purchased <RemoveShoppingCart />
          </Box>
        ) : (
          <Box display={"flex"} gap={1}>
            Mark as Purchased
            <Redeem />
          </Box>
        )}
      </Button>
      <Box>
        {url && (
          <IconButton target="_blank" href={urlWithHttps}>
            <LinkRounded />
          </IconButton>
        )}
        {removeItem && (
          <IconButton onClick={() => setShowConfirm(true)}>
            <DeleteIcon />
          </IconButton>
        )}
      </Box>
      <ConfirmDialog
        title={"Remove Item"}
        description={"Are you sure you want to remove this item from the list?"}
        setOpen={setShowConfirm}
        open={showConfirm}
        confirmAction={() => {
          // biome-ignore lint/complexity/useOptionalChain: <explanation>
          removeItem && removeItem(item);
        }}
      />
    </BorderedPaper>
  );
};

export default ListCard;

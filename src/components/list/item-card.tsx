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
        alignItems: "center",
        gap: 2,
        p: 2.5,
        "&:hover": {
          boxShadow: 2,
        },
        ...(purchased && {
          opacity: 0.7,
          backgroundColor: "#f5f5f5",
        }),
      }}
    >
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography 
          fontWeight={500} 
          fontSize={18}
          sx={{
            textDecoration: purchased ? "line-through" : "none",
            color: purchased ? "text.secondary" : "text.primary",
          }}
        >
          {item}
        </Typography>
      </Box>
      
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        {url && (
          <IconButton 
            target="_blank" 
            href={urlWithHttps}
            size="small"
            sx={{ color: "primary.main" }}
            title="Open link"
          >
            <LinkRounded />
          </IconButton>
        )}
        
        <Button 
          onClick={purchase}
          variant={purchased ? "outlined" : "contained"}
          size="small"
          startIcon={purchased ? <RemoveShoppingCart /> : <Redeem />}
          sx={{ whiteSpace: "nowrap" }}
        >
          {purchased ? "Unmark" : "Mark Purchased"}
        </Button>
        
        {removeItem && (
          <IconButton 
            onClick={() => setShowConfirm(true)}
            size="small"
            sx={{ color: "error.main" }}
            title="Remove item"
          >
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

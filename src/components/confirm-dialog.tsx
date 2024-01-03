import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

type ConfirmDialogProps = {
  title: string;
  description: string;
  setOpen: (open: boolean) => void;
  open: boolean;
  confirmAction: () => void;
};

const ConfirmDialog = (props: ConfirmDialogProps) => {
  const { title, description, setOpen, open, confirmAction } = props;

  const onCancel = () => {
    setOpen(false);
  };
  const handleOk = async () => {
    confirmAction();

    setOpen(false);
  };

  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>{title}</DialogTitle>
      <DialogContent>
        <DialogContentText>{description}</DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button autoFocus onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleOk}>Ok</Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;

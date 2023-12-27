"use client";
import { Box, Button, Dialog, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { Dispatch, SetStateAction } from "react";

type Group = {
  id: string;
  name: string;
  giftLimit: number;
  members: string[];
};

const AddGroup = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const form = useFormik({
    initialValues: {
      id: "",
      name: "",
      giftLimit: 0,
    },
    onSubmit: (values) => {
      console.log(values);
    },
  });

  return (
    <Dialog open={open}>
      <form onSubmit={form.handleSubmit}>
        <Box px={4} py={2}>
          <Box display={"flex"} mb={1} gap={1}>
            <Typography> Add Group</Typography>
          </Box>
          <Box display={"flex"} gap={1}>
            <Box display={"flex"} gap={1} flexDirection={"column"}>
              <TextField
                label="Name of Group"
                name="name"
                onChange={form.handleChange}
              />
              <TextField
                inputMode="numeric"
                label="Gift Limit"
                name="giftLimit"
                onChange={form.handleChange}
              />
            </Box>
          </Box>
          <Button variant="contained" type="submit">
            Save
          </Button>
        </Box>
      </form>
    </Dialog>
  );
};

export default AddGroup;

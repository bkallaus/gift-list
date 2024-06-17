"use client";
import {
  Box,
  Button,
  Dialog,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useFormik } from "formik";
import { Dispatch, SetStateAction } from "react";
import { Spacing } from "../spacing";
import { addGroupServer } from "@/services/add-group";

const AddGroup = ({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
}) => {
  const form = useFormik({
    initialValues: {
      name: "",
      description: "",
      limit: 0,
    },
    onSubmit: (values) => {
      void addGroupServer({
        name: values.name,
        description: values.description,
        limit: Number(values.limit),
      }).then(({ errors }) => {
        if (errors) {
          console.log(errors);
          return;
        }
      });
      setOpen(false);
    },
  });

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <Paper
        sx={{
          backgroundColor: "white",
        }}
      >
        <form onSubmit={form.handleSubmit}>
          <Box px={4} py={2}>
            <Box display={"flex"} mb={1} gap={1}>
              <Typography>Add Group</Typography>
            </Box>
            <Box display={"flex"} gap={1}>
              <Box display={"flex"} gap={1} flexDirection={"column"}>
                <TextField
                  required
                  label="Name of Group"
                  name="name"
                  onChange={form.handleChange}
                />
                <TextField
                  label="Description"
                  name="description"
                  onChange={form.handleChange}
                />
                <TextField
                  required
                  inputMode="numeric"
                  label="Gift Limit"
                  name="limit"
                  onChange={form.handleChange}
                />
              </Box>
            </Box>
            <Spacing />
            <Button variant="contained" type="submit">
              Save
            </Button>
          </Box>
        </form>
      </Paper>
    </Dialog>
  );
};

export default AddGroup;

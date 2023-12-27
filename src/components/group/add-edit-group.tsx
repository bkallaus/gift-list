"use client";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { List } from "../list/list";

type Group = {
  id: string;
  name: string;
  giftLimit: number;
  members: string[];
};

const AddEditGroup = () => {
  const form = useFormik({
    initialValues: {
      id: "",
      name: "",
      giftLimit: 0,
      members: [],
    },
    onSubmit: () => {},
  });

  return (
    <Box>
      <Box display={"flex"} mb={1} gap={1}>
        <Typography> Manage Group</Typography>

        <Button variant="contained">Save</Button>
      </Box>
      <Box display={"flex"} gap={1}>
        <Box display={"flex"} gap={1} flexDirection={"column"}>
          <TextField
            label="Name of Group"
            name="name"
            onChange={form.handleChange}
          />
          <TextField
            label="Gift Limit"
            name="giftLimit"
            onChange={form.handleChange}
          />
        </Box>
        <Box>
          <List
            label="Add Emails to Group"
            items={form.values.members}
            setItems={(items) => form.setFieldValue("members", items)}
          />
        </Box>
      </Box>
    </Box>
  );
};

export default AddEditGroup;

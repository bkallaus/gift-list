"use client";
import { Box } from "@mui/material";
import { useFormik } from "formik";
import { List } from "../list/list";

const PersonalList = () => {
  const form = useFormik({
    initialValues: {
      gifts: [],
    },
    onSubmit: () => {},
  });

  return (
    <Box>
      <List
        label="Add Items to List"
        items={form.values.gifts}
        setItems={(items) => form.setFieldValue("gifts", items)}
      />
    </Box>
  );
};

export default PersonalList;

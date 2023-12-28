"use client";
import { Box, Button, Dialog, TextField, Typography } from "@mui/material";
import { useFormik } from "formik";
import { Dispatch, SetStateAction } from "react";
import { Spacing } from "../spacing";
import { useMutation } from "@apollo/client";
import { Add_Member, GiftsQuery } from "../group/group-queries";
import * as Yup from "yup";

const AddMember = ({
  open,
  setOpen,
  groupSlug,
}: {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  groupSlug: string;
}) => {
  const [mutation] = useMutation(Add_Member);

  const form = useFormik({
    initialValues: {
      email: "",
      firstName: "",
      lastName: "",
    },
    onSubmit: (values) => {
      mutation({
        variables: {
          groupSlug,
          email: values.email,
          firstName: values.firstName,
          lastName: values.lastName,
        },
        refetchQueries: [GiftsQuery],
      });
      setOpen(false);
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
  });

  return (
    <Dialog open={open} onClose={() => setOpen(false)}>
      <form onSubmit={form.handleSubmit}>
        <Box px={4} py={2}>
          <Box display={"flex"} mb={1} gap={1}>
            <Typography>Add Group</Typography>
          </Box>
          <Box display={"flex"} gap={1}>
            <Box display={"flex"} gap={1} flexDirection={"column"}>
              <TextField
                required
                helperText={Boolean(form.submitCount) && form.errors.email}
                error={Boolean(form.errors.email)}
                label="Email"
                name="email"
                onChange={form.handleChange}
              />
              <TextField
                label="First Name"
                name="firstName"
                onChange={form.handleChange}
              />
              <TextField
                label="Last Name"
                name="lastName"
                onChange={form.handleChange}
              />
            </Box>
          </Box>
          <Spacing />
          <Button variant="contained" type="submit">
            Add Member
          </Button>
        </Box>
      </form>
    </Dialog>
  );
};

export default AddMember;

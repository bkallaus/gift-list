import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  TextField,
} from "@mui/material";
import { Group } from "./group-queries";
import { useState } from "react";
import { useFormik } from "formik";
import { Spacing } from "../spacing";
import { gql, useMutation } from "@apollo/client";

type EditGroupModalProps = {
  group: Group;
};

const EditGroupMutation = gql`
  mutation EditGroup(
    $groupSlug: String!
    $name: String
    $description: String
    $limit: Float
  ) {
    editGroup(
      groupSlug: $groupSlug
      name: $name
      description: $description
      limit: $limit
    ) {
      slug
      name
      description
      limit
    }
  }
`;

const EditGroupModalButton = ({ group }: EditGroupModalProps) => {
  const [open, setOpen] = useState(false);
  const [editGroupMutation] = useMutation(EditGroupMutation);

  const formik = useFormik({
    initialValues: {
      name: group?.name,
      description: group?.description,
      limit: group?.limit,
    },
    enableReinitialize: true,
    onSubmit: async (values) => {
      await editGroupMutation({
        variables: {
          groupSlug: group.slug,
          ...values,
          limit: parseFloat(`${values.limit}`),
        },
        refetchQueries: ["GroupQuery"],
      });
      setOpen(false);
    },
  });
  if (!group) return null;

  const onCancel = () => {
    setOpen(false);
  };
  const handleOk = async () => {
    formik.handleSubmit();
  };

  return (
    <div>
      <Button variant="outlined" size="small" onClick={() => setOpen(true)}>
        Edit Group
      </Button>
      <Dialog open={open} onClose={onCancel}>
        <form onSubmit={formik.handleSubmit}>
          <DialogTitle>Edit {group.name}</DialogTitle>
          <DialogContent>
            <Box>
              <Spacing />
              <TextField
                label="Name"
                name="name"
                value={formik.values.name}
                onChange={formik.handleChange}
              />
              <Spacing />
              <TextField
                label="Descriptions"
                name="description"
                value={formik.values.description}
                onChange={formik.handleChange}
              />
              <Spacing />
              <TextField
                label="Limit"
                name="limit"
                value={formik.values.limit}
                onChange={formik.handleChange}
              />
            </Box>
            <DialogContentText>{group.description}</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button autoFocus onClick={onCancel}>
              Cancel
            </Button>
            <Button type="submit" onClick={handleOk}>
              Ok
            </Button>
          </DialogActions>
        </form>
      </Dialog>
    </div>
  );
};

export default EditGroupModalButton;

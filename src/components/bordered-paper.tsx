import { Paper } from "@mui/material";

export const BorderedPaper = ({
  children,
  sx,
}: {
  children: React.ReactNode;
  sx?: object;
}) => {
  return (
    <Paper
      sx={{
        backgroundColor: "#fff",
        p: 2,
        border: "1px solid #ba895d40",
        borderRadius: 1,
        ...sx,
      }}
    >
      {children}
    </Paper>
  );
};

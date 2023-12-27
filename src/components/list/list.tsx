"use client";
import { Box, Button, TextField } from "@mui/material";
import ListCard from "./item-card";
import { Dispatch, SetStateAction, useState } from "react";

export const List = ({
  label,
  items,
  setItems,
}: {
  label: string;
  items: string[];
  setItems: Dispatch<SetStateAction<string[]>>;
}) => {
  const [name, setName] = useState("");

  const addItem = () => {
    setItems([...items, name]);
    setName("");
  };

  const removeItem = (remove: string) => {
    setItems(items.filter((item) => item !== remove));
  };

  return (
    <>
      <form>
        <Box display={"flex"} gap={1}>
          <TextField
            label={label}
            onChange={(e) => setName(e.target.value)}
            value={name}
          />
          <Button
            variant="contained"
            type="submit"
            disabled={!name}
            onClick={addItem}
          >
            Add
          </Button>
        </Box>
      </form>
      {items.map((item) => (
        <>
          <ListCard item={item} removeItem={removeItem} />
        </>
      ))}
    </>
  );
};

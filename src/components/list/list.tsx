"use client";
import {
  Box,
  Button,
  LinearProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import ListCard from "./item-card";
import { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useUser } from "@auth0/nextjs-auth0/client";
import { Spacing } from "../spacing";

const GiftsQuery = gql`
  query {
    gifts {
      id
      title
      url
    }
  }
`;

const GiftsMutation = gql`
  mutation AddGift($title: String!, $url: String!) {
    addGift(title: $title, url: $url) {
      id
      title
      url
    }
  }
`;

const GiftsRemoveMutation = gql`
  mutation RemoveGift($giftId: Int!) {
    removeGift(giftId: $giftId) {
      title
      url
    }
  }
`;

type Gift = {
  id?: number;
  title: string;
  url?: string;
};

export const List = () => {
  const { user } = useUser();

  const { data, error, loading } = useQuery(GiftsQuery);
  const [mutate] = useMutation(GiftsMutation);
  const [removeGift] = useMutation(GiftsRemoveMutation);

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [items, setItems] = useState<Gift[]>([]);

  const addItem = async () => {
    setItems([...items, { title: name }]);
    mutate({
      variables: {
        title: name,
        url: url || "",
      },
      refetchQueries: [GiftsQuery],
    });

    setUrl("");
    setName("");
  };

  const removeItem = (remove: string) => {
    const item = items.find((item) => item.title === remove);
    setItems(items.filter((item) => item.title !== remove));

    if (item?.id) {
      removeGift({
        variables: {
          giftId: item.id,
        },
      });
    }
  };

  useEffect(() => {
    if (data) {
      setItems(data.gifts);
    }
  }, [data]);

  if (!user) {
    return (
      <Box sx={{ display: "flex" }}>
        <Button href="/api/auth/login">Login to see list</Button>
      </Box>
    );
  }

  return (
    <Box>
      <Typography textAlign={"center"} fontWeight={600} fontSize={24}>
        My Wish List
      </Typography>
      <Paper>
        <Box display={"flex"} gap={1} padding={3}>
          <Box>
            <TextField
              size="small"
              label={"Gift Name"}
              onChange={(e) => setName(e.target.value)}
              value={name}
            />
            <Spacing />
            <TextField
              size="small"
              label={"Url"}
              onChange={(e) => setUrl(e.target.value)}
              value={url}
            />
          </Box>
          <Box>
            <Button
              variant="contained"
              type="submit"
              disabled={!name}
              onClick={addItem}
            >
              Add
            </Button>
          </Box>
        </Box>
      </Paper>
      <Spacing />
      <Box display={"flex"} flexDirection={"column"} gap={1}>
        {loading && <LinearProgress />}
        {items.map((item) => (
          <ListCard
            key={item.id}
            item={item.title}
            url={item.url}
            removeItem={removeItem}
          />
        ))}
      </Box>
    </Box>
  );
};

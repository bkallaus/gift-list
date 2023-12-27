"use client";
import { Box, Button, TextField } from "@mui/material";
import ListCard from "./item-card";
import { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { useUser } from "@auth0/nextjs-auth0/client";

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
  const [items, setItems] = useState<Gift[]>([]);

  const addItem = async () => {
    setItems([...items, { title: name }]);
    mutate({
      variables: {
        title: name,
        url: "https://www.google.com",
      },
      refetchQueries: [GiftsQuery],
    });

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
      <form>
        <Box display={"flex"} gap={1}>
          <TextField
            label={"My List"}
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
        <ListCard
          key={item.id}
          item={item.title}
          url={item.url}
          removeItem={removeItem}
        />
      ))}
    </Box>
  );
};

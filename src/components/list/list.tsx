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
import { Spacing } from "../spacing";
import { Claims } from "@auth0/nextjs-auth0";

const GiftsQuery = gql`
  query ($userSlug: String, $groupSlug: String) {
    gifts(userSlug: $userSlug, groupSlug: $groupSlug) {
      id
      title
      url
      purchased
    }
  }
`;

const UserQuery = gql`
  query User($userSlug: String!) {
    user(slug: $userSlug) {
      slug
      email
      firstName
      lastName
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

const PurchaseMutation = gql`
  mutation PurchaseGift($giftId: Int!, $purchased: Boolean!) {
    purchaseGift(giftId: $giftId, purchased: $purchased) {
      title
      url
    }
  }
`;

type Gift = {
  id?: number;
  title: string;
  url?: string;
  purchased?: boolean;
};

export const List = ({
  groupSlug,
  userSlug,
  user,
  listUser,
}: {
  groupSlug?: string;
  userSlug?: string;
  user?: Claims;
  listUser?: {
    slug: string;
    email: string;
    firstName: string;
    lastName: string;
  };
}) => {
  const { data, error, loading } = useQuery(GiftsQuery, {
    variables: {
      groupSlug,
      userSlug,
    },
  });

  const [mutate] = useMutation(GiftsMutation);
  const [removeGift] = useMutation(GiftsRemoveMutation);
  const [purchaseGift] = useMutation(PurchaseMutation);

  const [name, setName] = useState("");
  const [url, setUrl] = useState("");

  const [items, setItems] = useState<Gift[]>([]);
  const canEdit = (!groupSlug && !userSlug) || user?.email === listUser?.email;
  const userTitle = `${listUser?.firstName} ${listUser?.lastName} (${listUser?.email})`;

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

  return (
    <Box>
      <Typography textAlign={"center"} fontWeight={600} fontSize={24}>
        {canEdit ? "My List" : <>{userTitle} Gift List</>}
      </Typography>
      {canEdit && (
        <Paper
          style={{
            border: "1px solid gainsboro",
          }}
        >
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
      )}
      <Spacing />
      <Box display={"flex"} flexDirection={"column"} gap={1}>
        {loading && <LinearProgress />}
        {items.length < 1 && (
          <Typography textAlign={"center"}>
            {canEdit
              ? "No gifts added"
              : `${userTitle} has not added any gifts`}
          </Typography>
        )}
        {items.map((item) => (
          <ListCard
            key={item.id}
            item={item.title}
            purchased={item.purchased}
            purchase={() => {
              purchaseGift({
                variables: {
                  giftId: item.id,
                  purchased: !item.purchased,
                },
                refetchQueries: [GiftsQuery],
              });
            }}
            url={item.url}
            removeItem={canEdit ? removeItem : undefined}
          />
        ))}
      </Box>
    </Box>
  );
};

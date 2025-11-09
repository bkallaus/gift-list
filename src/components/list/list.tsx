"use client";
import {
  Box,
  Button,
  LinearProgress,
  TextField,
  Typography,
} from "@mui/material";
import ListCard from "./item-card";
import { useEffect, useState } from "react";
import { gql, useMutation, useQuery } from "@apollo/client";
import { BorderedPaper } from "../bordered-paper";
import { User } from "@/types/user";

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
  user?: User;
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
  console.log(data);

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
    <Box sx={{ maxWidth: 800, mx: "auto", px: 2 }}>
      <Box sx={{ mb: 4, textAlign: "center" }}>
        <Typography 
          variant="h4" 
          fontWeight={600} 
          sx={{ mb: 1 }}
          color="primary"
        >
          {canEdit ? "My Wish List" : `${listUser?.firstName || ""} ${listUser?.lastName || ""}'s Wish List`}
        </Typography>
        {!canEdit && listUser && (
          <Typography variant="body2" color="text.secondary">
            {listUser.email}
          </Typography>
        )}
      </Box>

      {canEdit && (
        <BorderedPaper sx={{ mb: 3 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
            Add New Gift
          </Typography>
          <Box display={"flex"} flexDirection={"column"} gap={2}>
            <TextField
              fullWidth
              label="Gift Name"
              placeholder="e.g., Wireless Headphones"
              onChange={(e) => setName(e.target.value)}
              value={name}
              variant="outlined"
            />
            <TextField
              fullWidth
              label="Link (Optional)"
              placeholder="https://example.com/product"
              onChange={(e) => setUrl(e.target.value)}
              value={url}
              variant="outlined"
              helperText="Add a link to help others find this gift"
            />
            <Button
              variant="contained"
              size="large"
              fullWidth
              disabled={!name}
              onClick={addItem}
              sx={{ mt: 1 }}
            >
              Add to List
            </Button>
          </Box>
        </BorderedPaper>
      )}

      {loading && <LinearProgress sx={{ mb: 2 }} />}

      {!loading && items.length === 0 && (
        <BorderedPaper>
          <Box sx={{ textAlign: "center", py: 6 }}>
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              {canEdit
                ? "Your wish list is empty"
                : `${listUser?.firstName || "This user"} hasn't added any gifts yet`}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {canEdit
                ? "Start adding gifts to your list above"
                : "Check back later to see their wish list"}
            </Typography>
          </Box>
        </BorderedPaper>
      )}

      {items.length > 0 && (
        <Box>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 500 }}>
            {items.length} {items.length === 1 ? "Item" : "Items"}
          </Typography>
          <Box display={"flex"} flexDirection={"column"} gap={2}>
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
      )}
    </Box>
  );
};

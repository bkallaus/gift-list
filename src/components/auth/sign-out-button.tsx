
'use client';
import { COOKIE_NAME } from "@/types/cookie";
import { Button } from "@mui/material";
import Cookies from "js-cookie";

export const SignOutButton = () => {
    const logout =() => {
        Cookies.remove(COOKIE_NAME);
        
        window.location.reload();
      }

    return  <Button sx={{ color: "white" }} variant="text" onClick={logout}>
        Log Out
    </Button>
}
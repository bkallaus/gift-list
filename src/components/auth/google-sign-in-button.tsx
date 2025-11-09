"use client";
import { COOKIE_NAME } from "@/types/cookie";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import Cookies from "js-cookie";


const GoogleSignIn = () => {

  return (
    <GoogleOAuthProvider clientId={process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID as string}>
      <GoogleLogin
        onSuccess={async (credentialResponse) => {
            if(!credentialResponse){
                return null;
            }

            Cookies.set(COOKIE_NAME, credentialResponse.credential as string, {
                expires: 99,
                sameSite: "lax",
                secure: true,
            })

          window.location.reload();
        }}
        useOneTap
        auto_select
        onError={() => {
          console.log("Login Failed");
        }}
      />
    </GoogleOAuthProvider>
  );
};

export default GoogleSignIn;

"use client";
import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const roboto = Roboto({
	weight: ["300", "400", "500", "700"],
	subsets: ["latin"],
	display: "swap",
});

const theme = createTheme({
	palette: {
		primary: {
			main: "#24695c",
			contrastText: "#fff",
		},
		secondary: {
			main: "#ba895d",
			contrastText: "#fff",
		},
		background: {
			paper: "#24695C1A",
			default: "#fff",
		},
		text: {
			primary: "#59667a",
			secondary: "#898989",
		},
	},
	typography: {
		fontFamily: roboto.style.fontFamily,
	},
});

export default theme;

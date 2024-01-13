import { Roboto } from "next/font/google";
import { createTheme } from "@mui/material/styles";

const roboto = Roboto({
	weight: ["300", "400", "500", "700"],
	subsets: ["latin"],
	display: "swap",
});

const theme = createTheme({
	palette: {
		mode: "light",
		// primary: {
		// 	main: "#818479",
		// },
		// secondary: {
		// 	main: "#B5CBB7",
		// },
		// background: {
		// 	default: "#D2E4C4",
		// },
		// text: {
		// 	primary: "#000000",
		// 	secondary: "#000000",
		// },
	},
	typography: {
		fontFamily: roboto.style.fontFamily,
	},
	components: {
		MuiAlert: {
			styleOverrides: {
				root: ({ ownerState }) => ({
					...(ownerState.severity === "info" && {
						backgroundColor: "#60a5fa",
					}),
				}),
			},
		},
	},
});

export default theme;

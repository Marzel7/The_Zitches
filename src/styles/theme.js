import { extendTheme } from "@chakra-ui/react";
import { ButtonStyles as Button } from "./components/buttonStyles";
import { BoxStyles as Box } from "./components/boxStyles";

export const Theme = extendTheme({
  colors: {
    primary: "#845EC2",
    secondary: "#FF6F91",
    highlight: "#00C9A7",
    warning: "#FFCF5F",
    danger: "#C34A36",
  },
  textStyles: {
    h1: {
      // you can also use responsive styles
      fontSize: "22",
      fontWeight: "semibold",
      lineHeight: "110%",
      //letterSpacing: "-2%",
    },
    h2: {
      isInLine: "true",
      fontSize: ["13"],
      fontWeight: "semibold",
      //lineHeight: "110%",
      //spacing: "0.5",
      align: "baseline",
      color: "gray.600",
    },
    h3: {
      isInLine: "true",
      fontSize: ["13"],
      fontWeight: "semibold",
      align: "baseline",
      color: "gray.600",
    },
  },

  components: {
    Button,
    Box,
  },
});

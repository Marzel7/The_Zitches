import { extendTheme } from "@chakra-ui/react";
import { ButtonStyles as Button } from "./components/buttonStyles";
import { BoxStyles as Box } from "./components/boxStyles";
//import { TableStyles as Table } from "./components/tableStyles";

export const Theme = extendTheme({
  initialColorMode: "dark",
  useSystemColorMode: false,

  colors: {
    primary: "#845EC2",
    secondary: "#FF6F91",
    highlight: "#00C9A7",
    warning: "#FFCF5F",
    danger: "#C34A36",
  },
  textStyles: {
    h1: {
      fontSize: "22",
      fontWeight: "semibold",
      lineHeight: "110%",
    },
    h2: {
      isInLine: "true",
      fontSize: ["12"],
      fontWeight: "semibold",
      align: "baseline",
      color: "gray.600",
    },
    h3: {
      isInLine: "true",
      fontSize: ["12"],
      fontWeight: "semibold",
      align: "baseline",
      color: "gray.600",
    },
    h4: {
      align: "baseline",
      justify: "right",
      color: "gray.600",
      fontSize: "12.5",
      fontWeight: "bold",
    },
    h5: {
      align: "baseline",
      justify: "right",
      color: "gray.500",
      fontSize: "12.5",
      fontWeight: "bold",
    },
    i1: {
      align: "baseline",
      justify: "right",
      color: "gray.500",
      fontSize: "12.5",
      fontWeight: "bold",
    },
  },

  components: {
    Button,
    Box,
  },
});

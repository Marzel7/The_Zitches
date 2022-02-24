export const ButtonStyles = {
  baseStyle: {},
  sizes: {},
  variants: {
    outline: (props) => ({
      _hover: {
        boxShadow: "none",
        background: "gray.900",
        color: "gray.100",
        outline: "none",
      },
      _focus: {
        outline: "0px",
        boxShadow: "none",
      },
    }),
    empty: (props) => ({
      _hover: {
        boxShadow: "none",
        background: "gray.900",
        color: "gray.100",
        outline: "none",
      },
      _focus: {
        outline: "0px",
        boxShadow: "none",
      },
    }),
  },
};

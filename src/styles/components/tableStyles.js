export const TableStyles = {
  baseStyle: {},
  // styles for different sizes ("sm", "md", "lg")
  sizes: {},
  // styles for different visual variants ("outline", "solid")
  variants: {
    outline: (props) => ({
      fontSize: "22",
      color: "gray.500",
      _hover: {
        boxShadow: "sm",
        background: "gray.900",
        color: "gray.100",
      },
      _active: "gray.900",
    }),
  },
  // default values for `size` and `variant`
  defaultProps: {
    size: "md",
    variant: "",
    fontSize: "12",
  },
};

import { extendTheme } from "@chakra-ui/react";
import "fontsource-monoton/index.css";

const theme = extendTheme({
  config: {
    initialColorMode: "dark",
    useSystemColorMode: false,
  },
  fonts: {
    heading: `'Monoton', sans-serif`,
  },
});

export default theme;

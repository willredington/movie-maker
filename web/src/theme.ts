import { extendTheme, withDefaultColorScheme } from "@chakra-ui/react";
import "fontsource-monoton/index.css";

// https://smart-swatch.netlify.app/#6d0eaa
const purpleColors = {
  50: "#f9e5ff",
  100: "#e1b7fc",
  200: "#cb89f6",
  300: "#b65af1",
  400: "#a12ced",
  500: "#8813d3",
  600: "#6a0ea5",
  700: "#4c0977",
  800: "#2e0449",
  900: "#12001d",
};

const theme = extendTheme(
  {
    config: {
      initialColorMode: "dark",
      useSystemColorMode: false,
    },
    fonts: {
      heading: `'Monoton', sans-serif`,
    },
    colors: {
      brand: purpleColors,
    },
    // components: {
    //   Card: {
    //     defaultProps: {
    //       bg: "brand.400",
    //     },
    //   },
    // },
  },
  withDefaultColorScheme({
    colorScheme: "brand",
  })
);

export default theme;

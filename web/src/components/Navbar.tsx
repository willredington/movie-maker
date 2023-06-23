import { useAuth0 } from "@auth0/auth0-react";
import { MoonIcon, SunIcon } from "@chakra-ui/icons";
import {
  Button,
  HStack,
  Heading,
  IconButton,
  Link,
  useColorMode,
} from "@chakra-ui/react";
import { Link as RLink } from "react-router-dom";

type NavItem = {
  label: string;
  link: string;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Projects",
    link: "/projects",
  },
];

export function Navbar() {
  const { colorMode, toggleColorMode } = useColorMode();
  const { isAuthenticated, loginWithRedirect, logout } = useAuth0();

  return (
    <HStack
      borderBottom={"1px"}
      borderBottomColor={"gray.200"}
      px={4}
      py={2}
      minH={"60px"}
      w="full"
      justify={"space-between"}
    >
      <HStack spacing={"10"}>
        <Heading size={"md"} as={RLink} to={"/"}>
          Auto Movie Maker
        </Heading>
        <HStack spacing={4}>
          {NAV_ITEMS.map((navItem) => (
            <Link key={navItem.label} as={RLink} to={navItem.link}>
              {navItem.label}
            </Link>
          ))}
        </HStack>
      </HStack>
      <HStack spacing={4}>
        <IconButton
          onClick={toggleColorMode}
          aria-label="toggle-color-mode-btn"
          icon={colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        />

        {isAuthenticated ? (
          <Button onClick={() => logout()}>Logout</Button>
        ) : (
          <Button onClick={() => loginWithRedirect()}>Login</Button>
        )}
      </HStack>
    </HStack>
  );
}

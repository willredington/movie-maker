import { Button, HStack, Heading, Link } from "@chakra-ui/react";
import { Link as RLink } from "react-router-dom";

type NavItem = {
  label: string;
  link: string;
};

const NAV_ITEMS: NavItem[] = [
  {
    label: "Home",
    link: "/",
  },
  {
    label: "Dashboard",
    link: "/dashboard",
  },
  {
    label: "Projects",
    link: "/projects",
  },
];

export function Navbar() {
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
        <Heading size={"md"}>Auto Movie Maker</Heading>
        <HStack spacing={4}>
          {NAV_ITEMS.map((navItem) => (
            <Link key={navItem.label} as={RLink} to={navItem.link}>
              {navItem.label}
            </Link>
          ))}
        </HStack>
      </HStack>
      <HStack spacing={4}>
        <Button>Sign In</Button>
      </HStack>
    </HStack>
  );
}

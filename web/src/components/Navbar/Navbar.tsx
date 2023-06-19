import { HStack, Link } from "@chakra-ui/react";
import { Link as RLink } from "react-router-dom";
import { Logout } from "./Logout";

export function Navbar() {
  return (
    <HStack py={2} px={2} justify={"space-between"}>
      <HStack>
        <Link as={RLink} to="/projects">
          Projects
        </Link>
      </HStack>
      <Logout />
    </HStack>
  );
}

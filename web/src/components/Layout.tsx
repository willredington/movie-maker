import { PropsWithChildren } from "react";
import { Box, Container, VStack, useColorModeValue } from "@chakra-ui/react";
import { Navbar } from "./Navbar";

export function Layout({ children }: PropsWithChildren) {
  return (
    <Box h="full" bg={useColorModeValue("gray.50", "gray.800")}>
      <Navbar />
      <Container mt={12} h="full" maxW={"container.lg"}>
        <VStack h="full" alignItems={"center"} w="full">
          {children}
        </VStack>
      </Container>
    </Box>
  );
}

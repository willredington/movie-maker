import { Box, Container, VStack } from "@chakra-ui/react";
import { PropsWithChildren } from "react";
import { Navbar } from "./Navbar";
import { Title } from "./Title";

export function Layout({ children }: PropsWithChildren) {
  return (
    <Box minH="100vh" bgGradient={"linear(to-b, #2e026d, #15162c)"}>
      <Navbar />
      <VStack alignItems={"center"}>
        <Container maxW={"container.lg"}>
          <VStack w="full" spacing={"24"} px={6} py={8}>
            <Title />
            {children}
          </VStack>
        </Container>
      </VStack>
    </Box>
  );
}

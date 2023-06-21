import { PropsWithChildren } from "react";
import { Container, VStack } from "@chakra-ui/react";
import { Navbar } from "./Navbar";

export function Layout({ children }: PropsWithChildren) {
  return (
    <>
      <Navbar />
      <Container h="full" maxW={"container.lg"}>
        <VStack h="full" justify={"center"}>
          {children}
        </VStack>
      </Container>
    </>
  );
}

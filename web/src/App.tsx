import { useAuth0 } from "@auth0/auth0-react";
import { Container, VStack } from "@chakra-ui/react";
import { Header } from "./components/Header";
import { LoginButton } from "./components/LoginButton";
import { Prompt } from "./components/Prompt";

export function App() {
  const { isAuthenticated } = useAuth0();

  return (
    <VStack
      minH="100vh"
      justify={"center"}
      alignItems={"center"}
      bgGradient={"linear(to-b, #2e026d, #15162c)"}
    >
      <Container maxW={"container.lg"}>
        <VStack w="full" spacing={"24"} px={6} py={8}>
          <Header />
          {isAuthenticated ? <Prompt /> : <LoginButton />}
        </VStack>
      </Container>
    </VStack>
  );
}

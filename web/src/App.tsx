import { useAuth0 } from "@auth0/auth0-react";
import { Container, Spinner, VStack } from "@chakra-ui/react";
import { Header } from "./components/Header";
import { LoginButton } from "./components/LoginButton";
import { Prompt } from "./components/Prompt";
import { Toaster, toast } from "react-hot-toast";
import { useEffect } from "react";

export function App() {
  const { isAuthenticated, isLoading, error } = useAuth0();

  useEffect(() => {
    if (error) {
      toast("Something went wrong!");
    }
  }, [error]);

  // do they have any active projects?

  return (
    <>
      <VStack
        minH="100vh"
        justify={"center"}
        alignItems={"center"}
        bgGradient={"linear(to-b, #2e026d, #15162c)"}
      >
        <Container maxW={"container.lg"}>
          <VStack w="full" spacing={"24"} px={6} py={8}>
            <Header />
            {isLoading ? (
              <Spinner />
            ) : isAuthenticated ? (
              <Prompt />
            ) : (
              <LoginButton />
            )}
          </VStack>
        </Container>
      </VStack>
      <Toaster />
    </>
  );
}

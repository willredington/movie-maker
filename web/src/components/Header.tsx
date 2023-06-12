import { Heading } from "@chakra-ui/react";

// TODO: add flickering effect
export const Header = () => {
  return (
    <Heading
      color="white"
      size="4xl"
      mb={10}
      textShadow="0.1vw 0vw 0.25vw #bc13fe, 0.2vw 0vw 0.25vw #bc13fe,
    0.4vw 0vw 0.25vw #bc13fe, 0.1vw 0vw 0vw #bc13fe, 0.2vw 0vw 0vw #bc13fe,
    0.2vw 0vw 1vw #bc13fe, 0.4vw 0vw 10vw #bc13fe, 0.1vw 0vw 10vw #bc13fe,
    0.2vw 0vw 30vw #bc13fe, 0.4vw 0vw 10vw #bc13fe"
    >
      Auto Movie Maker
    </Heading>
  );
};

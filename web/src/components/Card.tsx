import { Box } from "@chakra-ui/react";

export const Card = ({ children }: { children: React.ReactNode }) => {
  return (
    <Box
      w="full"
      color="white"
      bg="rgba(118, 0, 192, 0.2)"
      rounded={"md"}
      px={8}
      py={6}
      boxShadow={"0 4px 30px rgba(0, 0, 0, 0.1)"}
    >
      {children}
    </Box>
  );
};

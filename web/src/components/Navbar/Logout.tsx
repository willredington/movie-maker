import { useAuth0 } from "@auth0/auth0-react";
import { Button } from "@chakra-ui/react";
import { useCallback } from "react";

export function Logout() {
  const { logout, isAuthenticated } = useAuth0();

  const handleLogout = useCallback(() => {
    logout({
      logoutParams: {
        returnTo: window.location.origin,
      },
    });
  }, [logout]);

  if (isAuthenticated) {
    return (
      <Button color={"white"} bg={"brand.700"} onClick={handleLogout}>
        Logout
      </Button>
    );
  }

  return null;
}

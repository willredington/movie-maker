import { useAuth0 } from "@auth0/auth0-react";
import { useCallback } from "react";
import { Button } from "../Button";

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
    return <Button onClick={handleLogout}>Logout</Button>;
  }

  return null;
}

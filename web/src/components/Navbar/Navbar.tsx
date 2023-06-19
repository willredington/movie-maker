import { Link } from "react-router-dom";
import { Logout } from "./logout";
import styles from "./navbar.module.css";

export function Navbar() {
  // return (
  //   <HStack py={2} px={2} justify={"space-between"}>
  //     <HStack>
  //       <Link as={RLink} to="/projects">
  //         Projects
  //       </Link>
  //     </HStack>
  //     <Logout />
  //   </HStack>
  // );

  return (
    <div className={styles.root}>
      <div>
        <Link className={styles.link} to="/projects">
          Projects
        </Link>
      </div>
      <Logout />
    </div>
  );
}

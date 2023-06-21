import { withAuthenticationRequired } from "@auth0/auth0-react";
import { Layout } from "../../components/Layout";
import { Prompt } from "./Prompt";
import { Card, CardBody, CardHeader, Heading, VStack } from "@chakra-ui/react";

function _Dashboard() {
  return (
    <Layout>
      <Card w="full">
        <CardHeader>
          <Heading size="lg">Movie Generator</Heading>
        </CardHeader>
        <CardBody>
          <VStack alignItems={"flex-start"} spacing={6}>
            <Prompt />
          </VStack>
        </CardBody>
      </Card>
    </Layout>
  );
}

export const Dashboard = withAuthenticationRequired(_Dashboard);

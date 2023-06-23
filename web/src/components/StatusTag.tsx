import { Tag } from "@chakra-ui/react";
import { ProjectStatus } from "../models/project";
import { memo } from "react";

function _StatusTag({ status }: { status: ProjectStatus }) {
  switch (status) {
    case ProjectStatus.InProgress:
      return <Tag colorScheme="blue">In Progress</Tag>;
    case ProjectStatus.NeedsApproval:
      return <Tag colorScheme="yellow">Needs Approval</Tag>;
    case ProjectStatus.Finalizing:
      return <Tag colorScheme="orange">Finalizing</Tag>;
    case ProjectStatus.Completed:
      return <Tag colorScheme="green">Complete</Tag>;
    case ProjectStatus.Failed:
      return <Tag colorScheme="red">Failed</Tag>;
  }
}

export const StatusTag = memo(_StatusTag);

import client from "@core/api/graphql/graphql-client";
import { RegisterPointsOperationType } from "@core/api/graphql/types";
import mutationDocument from "./registerPointsOperation.graphql";

export default async function registerPointsOperation(
  command: RegisterPointsOperationType
): Promise<boolean | undefined> {
  const { data } = await client.mutate({
    mutation: mutationDocument,
    variables: {
      command: command,
    },
  });
  return data;
}

import client from "@core/api/graphql/graphql-client";
import getUserBalanceQueryDocument from "./getUserBalanceQuery.graphql";
import { UserBalanceType } from "@core/api/graphql/types";
import { boolean } from "yup";

async function getUserBalance(includeOperations: boolean, userId?: string, storeId?: string): Promise<UserBalanceType> {
  const { data } = await client.query({
    query: getUserBalanceQueryDocument,
    variables: {
      userId: userId,
      storeId: storeId,
      includeOperations: includeOperations,
    },
  });
  return data?.balance;
}
export default getUserBalance;

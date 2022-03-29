import client from "@core/api/graphql/graphql-client";
import getPointsOperationsQueryDocument from "./getPointsOperationsQuery.graphql";
import { SearchPointsOperationsResultType } from "@core/api/graphql/types";

async function getPointsOperations(
  userId: string,
  take: number,
  skip: number,
  storeId?: string
): Promise<SearchPointsOperationsResultType> {
  const { data } = await client.query({
    query: getPointsOperationsQueryDocument,
    variables: {
      userId: userId,
      storeId: storeId,
      take: take,
      skip: skip,
    },
  });
  return data?.searchPointsOperations;
}
export default getPointsOperations;

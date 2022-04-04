import { currentUserId, storeId } from "@core/constants";

import getPointsOperations from "@/core/api/graphql/account/queries/getPointsOperations";
import registerPointsOperation from "@/core/api/graphql/account/mutations/registerPointsOperation";
import {
  PointsOperationType,
  RegisterPointsOperationType,
  SearchPointsOperationsResultType,
  UserType,
} from "@/core/api/graphql/types";
import { Logger } from "@/core/utilities";
import { computed, readonly, ref, Ref } from "vue";

export default () => {
  const loading: Ref<boolean> = ref(false);
  const searchResult: Ref<SearchPointsOperationsResultType | null> = ref(null);

  async function loadPointsOperations(page: number) {
    loading.value = true;

    const take = 10;
    const skip = (page - 1) * 10;

    try {
      searchResult.value = await getPointsOperations(currentUserId, take, skip, storeId);
    } catch (e) {
      Logger.error("usePointsOperations.loadPointsOperations", e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  async function addPointsOperation(operation: PointsOperationType) {
    loading.value = true;
    const command: RegisterPointsOperationType = {
      userId: currentUserId,
      storeId: storeId,
      amount: typeof operation.amount === "string" ? parseInt(operation.amount, 10) : 0,
      reason: operation.reason,
    };

    try {
      await registerPointsOperation(command);
    } catch (e) {
      Logger.error("usePointsOperations.loadPointsOperations", e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    addPointsOperation,
    loadPointsOperations,
    pointsOperationsLoading: readonly(loading),
    pointsOperationsSearchResult: computed(() => searchResult.value),
  };
};

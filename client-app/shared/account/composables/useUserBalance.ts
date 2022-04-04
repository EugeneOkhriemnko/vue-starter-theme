import { currentUserId, storeId } from "@core/constants";

import { UserBalanceType, UserType } from "@/core/api/graphql/types";
import { Logger } from "@/core/utilities";
import { getUserBalance } from "@core/api/graphql/account";
import { computed, readonly, ref, Ref } from "vue";

export default () => {
  const loading: Ref<boolean> = ref(false);
  const userBalance: Ref<UserBalanceType | null> = ref(null);

  async function loadUserBalance(includeOperations: boolean) {
    loading.value = true;

    try {
      userBalance.value = await getUserBalance(includeOperations, currentUserId, storeId);
    } catch (e) {
      Logger.error("useUserBalance.loadUserBalance", e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    loadUserBalance,
    userBalanceLoading: readonly(loading),
    userBalance: computed(() => userBalance.value),
  };
};

import { UserBalanceType, UserType } from "@/core/api/graphql/types";
import { Logger } from "@/core/utilities";
import { getUserBalance } from "@core/api/graphql/account";
import { MaybeRef } from "@vueuse/core";
import { computed, readonly, ref, Ref, shallowRef, unref } from "vue";

export default (options: { user: MaybeRef<UserType> }) => {
  const { user } = options;

  const loading: Ref<boolean> = ref(false);
  const userBalance: Ref<UserBalanceType | null> = ref(null);

  async function loadUserBalance() {
    loading.value = true;

    try {
      userBalance.value = await getUserBalance(unref(user).id);
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

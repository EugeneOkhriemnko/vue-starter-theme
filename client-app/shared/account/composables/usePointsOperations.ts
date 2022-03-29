import getPointsOperations from "@/core/api/graphql/account/queries/getPointsOperations";
import { SearchPointsOperationsResultType, UserType } from "@/core/api/graphql/types";
import { Logger } from "@/core/utilities";
import { MaybeRef } from "@vueuse/core";
import { computed, readonly, ref, Ref, shallowRef, unref } from "vue";

export default (options: { user: MaybeRef<UserType>; page: Ref<number> }) => {
  const { user, page } = options;

  const loading: Ref<boolean> = ref(false);
  const searchResult: Ref<SearchPointsOperationsResultType | null> = ref(null);

  async function loadPointsOperations() {
    loading.value = true;

    const take = 10;
    const skip = (page.value - 1) * 10;

    try {
      searchResult.value = await getPointsOperations(unref(user).id, take, skip);
    } catch (e) {
      Logger.error("usePointsOperations.loadPointsOperations", e);
      throw e;
    } finally {
      loading.value = false;
    }
  }

  return {
    loadPointsOperations,
    pointsOperationsLoading: readonly(loading),
    pointsOperationsSearchResult: computed(() => searchResult.value),
  };
};

import { clone } from "lodash";
<template>
  <div class="bg-gray-100 pt-6 pb-16 shadow-inner">
    <div class="max-w-screen-2xl md:px-12 mx-auto">
      <div class="flex">
        <!-- First column-->
        <div class="hidden lg:flex flex-col lg:w-1/5 space-y-5">
          <AccountNavigation></AccountNavigation>
        </div>
        <!-- Second column-->
        <div class="flex flex-col w-full px-5 space-y-5 lg:w-4/5">
          <div class="flex justify-between items-center mx-5 lg:mx-0">
            <h2 class="text-gray-800 text-3xl font-bold uppercase">{{ title }}</h2>
            <VcButton v-if="!editingMode" class="px-3 uppercase border" size="sm" is-outline @click="openEditMode()">
              {{ isMobile ? "Add new" : "Add new points operation" }}
            </VcButton>
          </div>
          <div class="flex flex-col space-y-5 shadow-sm">
            <PointsOperationsForm v-if="editingMode" @save="saveOperation">
              <template #append="{ dirty }">
                <div class="flex space-x-4 pb-3 pt-7 sm:pb-4 sm:pt-4 sm:float-right">
                  <VcButton
                    kind="secondary"
                    :size="isMobile ? 'md' : 'lg'"
                    :is-disabled="false"
                    class="uppercase w-32 sm:w-auto sm:px-12"
                    is-outline
                    @click="closeEditMode"
                    v-t="'pages.account.addresses.cancel_button'"
                  >
                  </VcButton>

                  <VcButton
                    :size="isMobile ? 'md' : 'lg'"
                    :is-disabled="!dirty"
                    :is-waiting="false"
                    class="uppercase flex-grow sm:flex-none sm:px-16"
                    is-submit
                  >
                    {{
                      editableOperation
                        ? $t("pages.account.addresses.save_button")
                        : $t("pages.account.addresses.create_button")
                    }}
                  </VcButton>
                </div>
              </template>
            </PointsOperationsForm>
            <VcCard title="Points balance" v-else-if="!editingMode">
              <div class="flex flex-col lg:items-left lg:space-y-3">
                <span class="text-5xl font-extrabold">{{ userBalance?.amount ?? 0 }}</span>
              </div>
            </VcCard>
            <VcCard title="Points operations" v-if="!editingMode">
              <VcTable
                :loading="loading"
                :columns="columns"
                :items="operations"
                :pages="pages"
                :page="page"
                @pageChanged="onPageChange"
              >
                <template #desktop-body>
                  <tr v-for="operation in operations" :key="operation.id" class="even:bg-gray-50">
                    <td class="p-5 overflow-hidden overflow-ellipsis">
                      <span class="font-semibold">
                        {{ moment(operation?.createdDate).format("MMM DD, YYYY") }}
                      </span>
                      <br />
                      <span>
                        {{ moment(operation?.createdDate).format("HH:mm A") }}
                      </span>
                    </td>
                    <td class="p-5 overflow-hidden overflow-ellipsis">{{ operation.reason }}</td>
                    <td v-if="operation.isDeposit" class="p-5 overflow-hidden overflow-ellipsis">Deposit</td>
                    <td v-else class="p-5 overflow-hidden overflow-ellipsis">Debit</td>
                    <td v-if="operation.isDeposit" class="p-5 overflow-hidden overflow-ellipsis text-green-500">
                      {{ operation.amount }}
                    </td>
                    <td v-else class="p-5 overflow-hidden overflow-ellipsis text-red-500">{{ operation.amount }}</td>
                    <td class="p-5 overflow-hidden overflow-ellipsis">{{ operation.balance }}</td>
                  </tr>
                </template>
              </VcTable>
            </VcCard>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VcCard, VcButton, VcTable, ITableColumn } from "@/components";
import { AccountNavigation } from "@/shared/account";
import useUserBalance from "@/shared/account/composables/useUserBalance";
import { computed, ComputedRef, onMounted, Ref, ref } from "vue";
import moment from "moment";
import { useBreakpoints, breakpointsTailwind } from "@vueuse/core";
import usePointsOperations from "@/shared/account/composables/usePointsOperations";
import { PointsOperationType } from "@/core/api/graphql/types";
import { clone } from "lodash";
import PointsOperationsForm from "@/shared/account/components/points-operations-form.vue";

const breakpoints = useBreakpoints(breakpointsTailwind);
const includeOperations = ref(false);
const page = ref(1);
const { userBalanceLoading, userBalance, loadUserBalance } = useUserBalance();
const { pointsOperationsLoading, pointsOperationsSearchResult, loadPointsOperations, addPointsOperation } =
  usePointsOperations();

const isMobile = breakpoints.smaller("md");
const editingMode: Ref<boolean> = ref(false);
const editableOperation: Ref<PointsOperationType | null> = ref(null);
const itemsPerPage = ref(20);
const loading = userBalanceLoading && pointsOperationsLoading;
const saveOperationLoading = ref(false);

const title: ComputedRef<string> = computed(() => {
  if (editingMode.value) {
    return "New points operation";
  } else {
    return "Loyalty";
  }
});

const pages: ComputedRef<number> = computed(() =>
  Math.ceil((pointsOperationsSearchResult.value?.totalCount ?? 0) / itemsPerPage.value)
);
const operations: ComputedRef<PointsOperationType[]> = computed(
  () => pointsOperationsSearchResult.value?.results ?? []
);

const columns = ref<ITableColumn[]>([
  {
    id: "createDate",
    title: "Created date",
    sortable: false,
  },
  {
    id: "reason",
    title: "Reason",
    sortable: false,
  },
  {
    id: "isDeposit",
    title: "Operation type",
    sortable: false,
  },
  {
    id: "amount",
    title: "Amount",
    sortable: false,
  },
  {
    id: "balance",
    title: "Balance",
    sortable: false,
  },
]);

async function openEditMode(operation: PointsOperationType | null = null) {
  editableOperation.value = clone(operation);
  editingMode.value = true;
}

async function closeEditMode(operation: PointsOperationType | null = null) {
  editableOperation.value = clone(operation);
  editingMode.value = false;
}

async function saveOperation(operation: PointsOperationType): Promise<void> {
  saveOperationLoading.value = true;
  operation.amount = operation.amount as number;
  await addPointsOperation(operation);
  closeEditMode();
  saveOperationLoading.value = false;
}

const onPageChange = async (newPage: number) => {
  page.value = newPage;
  await loadPointsOperations(page.value);
};

onMounted(async () => {
  await loadUserBalance(includeOperations.value);
  await loadPointsOperations(page.value);
  console.log(pointsOperationsSearchResult.value?.totalCount);
  console.log(pointsOperationsSearchResult.value);
});
</script>

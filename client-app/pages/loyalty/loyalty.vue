<template>
  <div class="bg-gray-100 pt-6 pb-16 shadow-inner">
    <div class="max-w-screen-2xl md:px-12 mx-auto">
      <h2 class="md:hidden text-gray-800 px-5 text-3xl font-bold uppercase mb-5">Loyalty</h2>
      <div class="flex">
        <!-- First column-->
        <div class="hidden lg:flex flex-col lg:w-1/5 space-y-5">
          <AccountNavigation></AccountNavigation>
        </div>
        <!-- Second column-->
        <div class="flex flex-col w-full px-5 space-y-5 lg:w-3/5">
          <VcCard title="Current points balance">
            <div class="flex flex-col lg:items-left lg:space-y-3">
              <span class="text-5xl font-extrabold">{{ userBalance?.amount }}</span>
            </div>
          </VcCard>
          <VcCard title="Points operations">
            <table class="table-fixed text-sm text-left w-full">
              <thead class="border-b border-gray-200">
                <tr>
                  <th class="py-3 px-5 font-extrabold w-1/3">Date</th>
                  <th class="py-3 px-5 font-extrabold w-1/3">Operation</th>
                  <th class="py-3 px-5 font-extrabold w-1/6">Amount</th>
                  <th class="py-3 px-5 font-extrabold w-1/6">Balance</th>
                </tr>
              </thead>
              <tbody v-if="operations?.length">
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
                  <td v-if="operation.isDeposit" class="p-5 overflow-hidden overflow-ellipsis">Deposit</td>
                  <td v-else class="p-5 overflow-hidden overflow-ellipsis">Debit</td>
                  <td v-if="operation.isDeposit" class="p-5 overflow-hidden overflow-ellipsis text-green-500">
                    {{ operation.amount }}
                  </td>
                  <td v-else class="p-5 overflow-hidden overflow-ellipsis text-red-500">{{ operation.amount }}</td>
                  <td class="p-5 overflow-hidden overflow-ellipsis">{{ operation.balance }}</td>
                </tr>
              </tbody>
              <tbody v-else-if="!userBalanceLoading">
                <!-- Workaround for using colspan -->
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td></td>
                </tr>
                <tr>
                  <td colspan="6" class="polygons-bg">
                    <div class="flex items-center pl-56 space-x-10 h-80">
                      <img src="/static/images/account/icons/no-addresses.svg" alt="No operations" />
                      <div class="flex flex-col space-y-2">
                        <span class="text-base">There are no operations yet</span>
                      </div>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </VcCard>
          <!-- Commented due to accetpance criteria, will be used in future-->
          <!-- <VcCard title="Users" class="h-52"></VcCard> -->
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { VcCard } from "@/components";
import { AccountNavigation, useUser } from "@/shared/account";
import useUserBalance from "@/shared/account/composables/useUserBalance";
import { computed, onMounted } from "vue";
import moment from "moment";

const { me: user } = useUser();
const { userBalanceLoading, userBalance, loadUserBalance } = useUserBalance({ user });

const operations = computed(() => userBalance.value?.pointsOperations);

onMounted(async () => {
  await loadUserBalance();
});
</script>

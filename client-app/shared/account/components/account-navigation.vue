<template>
  <VcCard :title="$t('shared.account.navigation.title')">
    <div class="flex flex-col">
      <AccountNavigationLink
        to="/account/dashboard"
        :text="$t('shared.account.navigation.links.dashboard')"
        class="dashboard-icon"
      ></AccountNavigationLink>
      <AccountNavigationLink
        to="/account/profile"
        :text="$t('shared.account.navigation.links.profile')"
        class="profile-icon"
      ></AccountNavigationLink>
      <AccountNavigationLink
        to="/account/addresses"
        :text="$t('shared.account.navigation.links.addresses')"
        class="addresses-icon"
      ></AccountNavigationLink>
      <AccountNavigationLink
        to="/account/orders"
        :text="$t('shared.account.navigation.links.orders')"
        class="orders-icon"
      ></AccountNavigationLink>
      <AccountNavigationLink
        :to="{ name: 'Lists' }"
        :text="$t('shared.account.navigation.links.your_lists')"
        class="list-icon"
      ></AccountNavigationLink>
      <AccountNavigationLink
        to="/account/checkout-defaults"
        :text="$t('shared.account.navigation.links.checkout_defaults')"
        class="checkout-icon"
      ></AccountNavigationLink>
      <AccountNavigationLink to="/account/loyalty" text="Loyalty" class="list-icon"></AccountNavigationLink>
    </div>
  </VcCard>
  <!-- Commented due to accetpance criteria, will be used in future-->
  <!-- <VcCard title="Corporate">
    <div class="flex flex-col">
      <AccountNavigationLink to="/companyInfo" text="Company info" class="company-icon"></AccountNavigationLink>
      <AccountNavigationLink
        to="/companyMembers"
        text="Company members"
        class="company-members-icon"
      ></AccountNavigationLink>
    </div>
  </VcCard> -->
</template>

<script setup lang="ts">
import { VcCard } from "@/components";
import { AccountNavigationLink } from ".";
</script>

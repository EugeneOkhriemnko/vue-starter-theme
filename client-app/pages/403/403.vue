<template>
  <TwoColumn class="max-w-screen-lg">
    <template #left>
      <h1 class="text-primary text-7xl md:text-8xl font-black mb-5" v-t="'pages.403.error_code'"></h1>
      <h2 class="text-black-800 text-2xl md:text-4xl font-bold mb-2" v-t="'pages.403.error_text'"></h2>
      <p class="text-gray-700 text-base md:text-xl leading-relaxed mb-10" v-t="'pages.403.message'"></p>
      <div>
        <VcButton to="/" size="md" class="w-40 uppercase">
          {{ $t("pages.403.home_button") }}
        </VcButton>
      </div>
    </template>
    <template #right>
      <VcImage src="/static/images/errors/403.webp" :alt="$t('pages.403.img_alt')" class="w-full max-w-md" />
    </template>
  </TwoColumn>
</template>

<script setup lang="ts">
import { TwoColumn } from "@/shared/layout";
import { VcImage, VcButton } from "@/components";
</script>

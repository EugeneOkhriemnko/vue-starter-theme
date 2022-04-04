<template>
  <form class="overflow-x-hidden" @submit.prevent="save">
    <slot name="prepend" v-bind="slotsData" />

    <div class="md:flex">
      <div class="md:w-1/2">
        <VcInput
          v-model="amount"
          :error-message="errors.amount"
          :is-disabled="disabled"
          label="Amount"
          class="mb-4"
          is-required
          :type="'number'"
        />
      </div>

      <!-- Divider -->
      <div class="border-t md:border-l border-yellow-500 mt-8 mb-6 md:mt-6 md:mb-4 -mx-96 md:mx-9"></div>

      <div class="md:w-1/2">
        <VcTextArea
          v-model="reason"
          :error-message="errors.reason"
          :is-disabled="disabled"
          :counter="true"
          :label="'Reason'"
          class="mb-4"
          is-required
        />
      </div>
    </div>

    <slot name="append" v-bind="slotsData" />
  </form>
</template>

<script setup lang="ts">
import { computed, PropType, ref, Ref, watch } from "vue";
import { clone } from "lodash";
import { useForm, useField } from "vee-validate";
import { VcInput, VcTextArea } from "@/components";
import { Logger } from "@core/utilities";
import { PointsOperationType } from "@/core/api/graphql/types";
import * as yup from "yup";

const props = defineProps({
  disabled: Boolean,

  modelValue: {
    type: Object as PropType<PointsOperationType | null>,
    default: null,
  },
});

const emit = defineEmits<{
  (event: "update:modelValue", operation: PointsOperationType): void;
  (event: "save", operation: PointsOperationType): void;
}>();

const _emptyOperation: Readonly<PointsOperationType> = {
  amount: 0,
  reason: "",
  balance: 0,
  createdDate: "",
  id: "",
  isDeposit: false,
  userId: "",
  // FIXME: The values may be NULL. Incorrect behavior of the "dirty" variable
};

const initialValues: Ref<PointsOperationType> = ref(clone(props.modelValue || _emptyOperation));

const {
  values,
  meta,
  errors,
  handleSubmit,
  setValues,
  setErrors,
  validate,
  resetForm: reset,
} = useForm({ initialValues });

const slotsData = computed(() => ({
  setErrors,
  validate,
  reset,
  clear,
  save,
  errors,
  values,
  dirty: meta.value.dirty,
  valid: meta.value.valid,
  validated: meta.value.validated,
  pending: meta.value.pending,
  touched: meta.value.touched,
}));

const { value: amount } = useField<number>("amount", yup.number().max(10000).min(-10000));
const { value: reason } = useField<string>("reason", yup.string().max(128).required());

const save = handleSubmit((operation) => {
  const newOperation: PointsOperationType = { ...operation };
  emit("update:modelValue", newOperation);
  emit("save", newOperation);
}, Logger.debug);

function clear() {
  setValues({
    ...props.modelValue,
    ..._emptyOperation,
  });
}

watch(
  () => props.modelValue,
  (value: PointsOperationType | null) => {
    initialValues.value = clone(value || _emptyOperation);
    setValues(initialValues.value);
  },
  { deep: true }
);
</script>

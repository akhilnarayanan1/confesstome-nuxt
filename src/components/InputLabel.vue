<template>
  <label class="label">
    <div v-if="thisField">
      <span :class="thisField.type==='error'?
        'label-text-alt text-red-500':
      thisField.type==='success'?
        'label-text-alt text-green-500':
      thisField.type==='warning'?
        'label-text-alt text-yellow-500':
        'label-text-alt'
      ">
        {{ thisField.message }}
      </span>
    </div>
  </label>
</template>

<script setup lang="ts">
  import { getFieldAlerts } from "@/composables/fieldAlerts";
  import _ from "lodash";

  const props = defineProps<{ labelName: string }>();
  const fieldAlert = getFieldAlerts();
  const thisField = computed(()=>_.find(fieldAlert.value, {fieldid: props.labelName}));
    
</script>
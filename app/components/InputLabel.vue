<template>
  <label class="label">
    <div v-if="thisField">
      <span :class="thisField.type==='error'?
        'label-text-alt text-error':
      thisField.type==='success'?
        'label-text-alt text-success':
      thisField.type==='warning'?
        'label-text-alt text-warning':
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
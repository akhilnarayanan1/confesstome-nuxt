<template>
  <label v-if="shouldShow" class="label">
    <div class="flex items-center gap-2 mt-2">
      <span :class="{
        'text-xs font-medium px-2 py-1 rounded-full flex items-center gap-1': true,
        'bg-pink-500/20 text-pink-300 border border-pink-300/30': thisField?.type === 'error',
        'bg-yellow-500/20 text-yellow-300 border border-yellow-300/30': thisField?.type === 'success', 
        'bg-orange-500/20 text-orange-300 border border-orange-300/30': thisField?.type === 'warning',
        'bg-white/10 text-white/70 border border-white/20': !thisField?.type || thisField?.type === 'info'
      }">
        <span v-if="thisField?.type === 'error'">💥</span>
        <span v-else-if="thisField?.type === 'success'">✨</span>
        <span v-else-if="thisField?.type === 'warning'">⚠️</span>
        <span v-else>ℹ️</span>
        {{ thisField?.message }}
      </span>
    </div>
  </label>
</template>

<script setup lang="ts">
  import { getFieldAlerts } from "@/composables/fieldAlerts";
  import _ from "lodash";

  const props = defineProps<{ 
    labelName: string;
    autoHide?: boolean;
    autoHideDuration?: number;
  }>();
  
  const fieldAlert = getFieldAlerts();
  const thisField = computed(()=>_.find(fieldAlert.value, {fieldid: props.labelName}));
  const showTimer = ref(true);

  const shouldShow = computed(() => {
    if (!thisField.value) return false;
    if (!props.autoHide) return true;
    return showTimer.value;
  });

  // Auto-hide functionality
  watch(thisField, (newField) => {
    if (newField && props.autoHide) {
      showTimer.value = true;
      setTimeout(() => {
        showTimer.value = false;
      }, props.autoHideDuration || 3000);
    }
  });
    
</script>
<template>
  <div v-if="toasts?.length"  class="flex justify-center md:justify-end">
    <div class="fixed bottom-0 stack">
      <transition-group name="list">
        <div v-for="toast in reverseToast(toasts)" :key="toast.id" class="m-2">
          <div :class="{'alert shadow-lg text-white':true, 'alert-error': toast.type==='error',
          'alert-success': toast.type==='success', 'alert-warning': toast.type==='warning'}">
            <div><span>{{ toast.message }}</span></div>
            <div v-if="!toast.duration" class="flex-none">
              <button v-if="toast.run" @click="toast.run.feature" class="btn btn-sm btn-ghost">{{ toast.run.message }}</button>
              <button @click="removeToast(toast.id)" class="btn btn-sm">CLOSE</button>
            </div>
          </div>
        </div>
      </transition-group>
    </div>
  </div>
</template>

<script setup lang="ts">
  import _ from "lodash";
  import { getToasts } from "@/composables/toasts";
  import { type ToastData } from "@/assets/js/types";
  
  let toasts = getToasts();
  const removeToast = (id: number | undefined) =>{
    if (typeof id !== "undefined") {
      const isOnIndex = (_.findIndex(toasts.value, {id: id}));
      toasts.value.splice(isOnIndex, 1);
    };
  };

  const reverseToast = (toasts: ToastData[]) => {
    return [...toasts].reverse()
  }

</script>


<style scoped>
.list-enter-active,
.list-leave-active {
  transition: all 0.3s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(30px);
}
</style>
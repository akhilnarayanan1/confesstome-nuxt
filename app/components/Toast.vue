<template>
  <div v-if="toasts?.length" class="flex justify-center md:justify-end">
    <div class="fixed bottom-0 stack m-4 z-50">
      <transition-group name="list">
        <div v-for="toast in reverseToast(toasts)" :key="toast.id">
          <div :class="{
            'bg-white/10 backdrop-blur-lg rounded-2xl p-6 border shadow-2xl text-white font-medium transform transition-all duration-300 hover:scale-105 min-w-80': true,
            'border-pink-300/50 shadow-pink-500/25 bg-gradient-to-r from-pink-500/20 to-red-500/20': toast.type === 'error',
            'border-yellow-300/50 shadow-yellow-500/25 bg-gradient-to-r from-yellow-500/20 to-orange-500/20': toast.type === 'success', 
            'border-orange-300/50 shadow-orange-500/25 bg-gradient-to-r from-orange-500/20 to-yellow-500/20': toast.type === 'warning'
          }">
            <div class="flex items-start justify-between gap-4">
              <div class="flex items-center gap-3">
                <div class="text-3xl flex-shrink-0">
                  <span v-if="toast.type === 'error'">💥</span>
                  <span v-else-if="toast.type === 'success'">🎉</span>
                  <span v-else-if="toast.type === 'warning'">⚠️</span>
                </div>
                <div>
                  <div :class="{
                    'font-black text-lg leading-tight': true,
                    'text-pink-200': toast.type === 'error',
                    'text-yellow-200': toast.type === 'success',
                    'text-orange-200': toast.type === 'warning'
                  }">
                    <span v-if="toast.type === 'error'">Oops! 😅</span>
                    <span v-else-if="toast.type === 'success'">Success! ✨</span>
                    <span v-else-if="toast.type === 'warning'">Heads up! 🤔</span>
                  </div>
                  <div class="text-white/90 leading-relaxed">{{ toast.message }}</div>
                </div>
              </div>
              
              <div v-if="!toast.duration" class="flex-none flex flex-col gap-2">
                <button 
                  v-if="toast.run" 
                  @click="toast.run.feature" 
                  :class="{
                    'btn btn-sm font-bold rounded-full transition-all duration-300 transform hover:scale-110': true,
                    'bg-pink-500 hover:bg-pink-600 text-white border-none': toast.type === 'error',
                    'bg-yellow-500 hover:bg-yellow-600 text-white border-none': toast.type === 'success',
                    'bg-orange-500 hover:bg-orange-600 text-white border-none': toast.type === 'warning'
                  }"
                >
                  {{ toast.run.message }}
                </button>
                <button 
                  @click="removeToast(toast.id)" 
                  class="btn btn-sm bg-white/20 hover:bg-white/30 text-white font-bold rounded-full border-none transition-all duration-300 transform hover:scale-110"
                >
                  ❌ CLOSE
                </button>
              </div>
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
  transition: all 0.5s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateY(50px) scale(0.8);
}
.list-enter-to,
.list-leave-from {
  opacity: 1;
  transform: translateY(0) scale(1);
}
</style>
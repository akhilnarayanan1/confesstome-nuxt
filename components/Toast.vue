<template>
    <div v-if="toasts?.length"  class="flex justify-center md:justify-end">
        <div class="fixed bottom-0">
            <transition-group name="list">
                <div v-for="toast in toasts" :key="toast.id">
                    <div :class="toast.type==='error'? 
                        'alert text-red-500 bg-red-50 rounded-md m-2':
                    toast.type==='success'?
                        'alert text-green-500 bg-green-50 rounded-md m-2':
                    toast.type==='warning'?
                        'alert text-yellow-500 bg-yellow-50 rounded-md m-2':
                        'alert text-gray-500 bg-gray-50 rounded-md m-2'
                    ">
                        <div class="flex-1">
                            <label v-if="toast.isHTML" v-html="toast.message"></label>
                            <label v-else>{{ toast.message }}</label>
                        </div>
                        <div v-if="!toast.duration" class="flex-none">
                            <button @click="removeToast(toast.id)" class="btn btn-sm btn-ghost">CLOSE</button>
                        </div>
                    </div>
                </div>
            </transition-group>
        </div>
    </div>
</template>

<script setup lang="ts">
    import _ from 'lodash'
    import { computed, ref } from 'vue'
    //import { useState } from '#app'
    import { getToasts } from '@/composables/toasts'
    
    let toasts = getToasts()

    const removeToast = (id: number) =>{
        const isOnIndex = (_.findIndex(toasts.value, {id: id}))
        toasts.value.splice(isOnIndex, 1)
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
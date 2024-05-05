<template>
    <div v-if="!profile.username">
        <LoadingNavbar />
        <div class="flex justify-center mx-4">
            <div class="skelton h-16 max-w-96 ">
                <span class="text-base-100">a</span>
            </div>
            <div class="skeleton w-96"></div>
        </div>
    </div>
    <div v-else>
        <Navbar />
        <div class="flex justify-center mx-4">
            <div class="alert bg-emerald-600 max-w-96 shadow-lg flex justify-between">
                <span class="text-base-100">https://confessto.me/@{{ profile.username }}</span>
                <div class="flex space-x-2">
                <button class="btn btn-ghost bg-emerald-700 min-h-7 h-7 px-1">
                    <span class="material-symbols-outlined text-lg font-light text-base-100">content_copy</span>
                </button>
                <button class="btn btn-ghost bg-emerald-700 min-h-7 h-7 px-1">
                    <span class="material-symbols-outlined text-lg font-light text-base-100">share</span>
                </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  profile: {
    username: string;
  };
}>();
</script>
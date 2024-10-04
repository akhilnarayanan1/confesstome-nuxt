<template>
    <Navbar />
    <div v-if="!profile.username">
        <div class="flex justify-center mx-4">
            <div class="skelton h-16 max-w-96 ">
                <span class="text-base-100">a</span>
            </div>
            <div class="skeleton w-96"></div>
        </div>
    </div>
    <div v-else>
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

        <div class="mx-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div class="stats shadow">
                <div class="stat" @click="navigateTo('/messages')">
                    <div class="stat-title">Total Messages Received</div>
                    <div class="stat-value">89,400</div>
                    <div class="stat-desc">21% more than last month</div>
                </div>
            </div>

            <div class="stats shadow">
                <div class="stat">
                    <div class="stat-title">Total Messages Sent</div>
                    <div class="stat-value">89,400</div>
                    <div class="stat-desc">21% more than last month</div>
                </div>
            </div>

        </div>
    </div>
</template>

<script setup lang="ts">
    const profile = getProfile();
</script>
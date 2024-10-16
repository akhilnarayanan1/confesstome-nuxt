<template>
    <Navbar />
    <div v-if="!profile.username">
        <div class="flex justify-center mx-4">
            <div class="skelton h-16 max-w-96 ">\</div>
            <div class="skeleton w-96"></div>
        </div>
    </div>
    <div v-else>
        <div class="flex justify-center mx-4">
            <div class="alert bg-base-300 border-none bg-opacity-30 max-w-96 shadow-lg flex justify-between">
                <span>https://confessto.me/@{{ profile.username }}</span>
                <div class="flex space-x-2">
                    <button class="btn btn-ghost glass min-h-7 h-7 px-1">
                        <span class="material-symbols-outlined text-lg font-light">content_copy</span>
                    </button>
                    <button class="btn btn-ghost glass min-h-7 h-7 px-1">
                        <span class="material-symbols-outlined text-lg font-light">share</span>
                    </button>
                </div>
            </div>
        </div>

        <div class="mx-4 grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            <div class="stats bg-opacity-30 shadow">
                <div class="stat" @click="navigateTo('/messages')">
                    <div class="stat-title">Total Messages Received</div>
                    <div class="stat-value">89,400</div>
                    <div class="stat-desc">21% more than last month</div>
                </div>
            </div>

            <div class="stats bg-opacity-30 shadow">
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
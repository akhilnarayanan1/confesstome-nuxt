<template>
    <div class="p-4">
        <!-- Loading State -->
        <div v-if="!profile.username" class="max-w-4xl mx-auto">
            <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl animate-pulse mb-6">
                <div class="h-12 bg-white/20 rounded-2xl"></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl animate-pulse">
                    <div class="h-24 bg-white/20 rounded-2xl"></div>
                </div>
                <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-white/20 shadow-2xl animate-pulse">
                    <div class="h-24 bg-white/20 rounded-2xl"></div>
                </div>
            </div>
        </div>

        <!-- Dashboard Content -->
        <div v-else class="max-w-4xl mx-auto">
            <!-- Personal Link Card -->
            <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-6 border border-yellow-300/50 shadow-2xl mb-8 transform transition-all duration-300 hover:scale-[1.02]">
                <div class="flex items-center justify-between flex-wrap gap-4">
                    <div class="flex items-center gap-4">
                        <div class="text-4xl">🔗</div>
                        <div>
                            <div class="text-lg font-black text-yellow-300 mb-1">Your Personal Link</div>
                            <div class="text-white/90 font-mono bg-white/10 px-3 py-2 rounded-xl border border-white/20">
                                confessto.me/@{{ profile.username }}
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-3">
                        <button class="bg-white/20 hover:bg-white/30 text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-110 border border-white/30">
                            <span class="material-symbols-outlined">content_copy</span>
                        </button>
                        <button class="bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white p-3 rounded-xl transition-all duration-300 transform hover:scale-110 shadow-lg">
                            <span class="material-symbols-outlined">share</span>
                        </button>
                    </div>
                </div>
            </div>

            <!-- Stats Grid -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Messages Sent -->
                <button 
                    @click="navigateTo({ path: '/messages', query: { source: 'sent' } })"
                    class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-pink-300/50 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:border-pink-300/70 text-left group"
                >
                    <div class="flex items-start justify-between mb-6">
                        <div class="text-5xl group-hover:scale-110 transition-transform duration-300">📤</div>
                        <div class="text-pink-300 opacity-60 group-hover:opacity-100 transition-opacity">
                            <span class="material-symbols-outlined text-2xl">arrow_forward</span>
                        </div>
                    </div>
                    <div>
                        <div class="text-sm text-white/70 font-medium mb-2 uppercase tracking-wide">Messages Sent</div>
                        <div class="text-4xl font-black text-pink-300 mb-2">89,400</div>
                        <div class="text-sm text-white/60">
                            <span class="text-pink-300 font-bold">↗ 21%</span> more than last month
                        </div>
                    </div>
                </button>

                <!-- Messages Received -->
                <button 
                    @click="navigateTo({ path: '/messages', query: { source: 'received' } })"
                    class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-purple-300/50 shadow-2xl transform transition-all duration-300 hover:scale-105 hover:border-purple-300/70 text-left group"
                >
                    <div class="flex items-start justify-between mb-6">
                        <div class="text-5xl group-hover:scale-110 transition-transform duration-300">📥</div>
                        <div class="text-purple-300 opacity-60 group-hover:opacity-100 transition-opacity">
                            <span class="material-symbols-outlined text-2xl">arrow_forward</span>
                        </div>
                    </div>
                    <div>
                        <div class="text-sm text-white/70 font-medium mb-2 uppercase tracking-wide">Messages Received</div>
                        <div class="text-4xl font-black text-purple-300 mb-2">89,400</div>
                        <div class="text-sm text-white/60">
                            <span class="text-purple-300 font-bold">↗ 21%</span> more than last month
                        </div>
                    </div>
                </button>
            </div>

            <!-- Quick Actions -->
            <div class="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                <NuxtLink 
                    to="/messages"
                    class="bg-gradient-to-r from-yellow-500/20 to-orange-500/20 backdrop-blur-lg rounded-2xl p-6 border border-yellow-300/30 hover:border-yellow-300/50 transition-all duration-300 transform hover:scale-105 text-center group"
                >
                    <div class="text-3xl mb-3 group-hover:scale-110 transition-transform">💬</div>
                    <div class="font-black text-yellow-300">View All Chats</div>
                </NuxtLink>

                <div class="bg-gradient-to-r from-pink-500/20 to-red-500/20 backdrop-blur-lg rounded-2xl p-6 border border-pink-300/30 hover:border-pink-300/50 transition-all duration-300 transform hover:scale-105 text-center group cursor-pointer">
                    <div class="text-3xl mb-3 group-hover:scale-110 transition-transform">📊</div>
                    <div class="font-black text-pink-300">Analytics</div>
                </div>

                <div class="bg-gradient-to-r from-purple-500/20 to-indigo-500/20 backdrop-blur-lg rounded-2xl p-6 border border-purple-300/30 hover:border-purple-300/50 transition-all duration-300 transform hover:scale-105 text-center group cursor-pointer">
                    <div class="text-3xl mb-3 group-hover:scale-110 transition-transform">⚙️</div>
                    <div class="font-black text-purple-300">Settings</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    const profile = getProfile();
</script>
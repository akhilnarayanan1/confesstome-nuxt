<template>
    <div class="p-4">
        <div class="max-w-4xl mx-auto">
            <!-- Header Skeleton -->
            <div class="text-center mb-8">
                <div class="w-16 h-16 bg-white/20 rounded-full mx-auto mb-4 animate-pulse"></div>
                <div class="h-8 bg-white/20 rounded-2xl w-48 mx-auto mb-2 animate-pulse"></div>
                <div class="h-4 bg-white/10 rounded-xl w-64 mx-auto animate-pulse"></div>
            </div>

            <!-- Chat List Skeleton -->
            <div class="bg-white/10 backdrop-blur-lg rounded-3xl border border-white/20 shadow-2xl overflow-hidden">
                <div class="p-6 border-b border-white/10">
                    <div class="h-6 bg-white/20 rounded-xl w-48 animate-pulse"></div>
                </div>
                
                <div v-for="(_, index) in Array.from({length: 5})" :key="index" class="p-6 border-b border-white/10">
                    <div class="flex items-center gap-4">
                        <!-- Avatar Skeleton -->
                        <div class="w-12 h-12 bg-white/20 rounded-full flex-shrink-0 animate-pulse"></div>
                        
                        <!-- Content Skeleton -->
                        <div class="flex-grow space-y-3">
                            <div class="flex items-center justify-between">
                                <div class="h-5 bg-white/20 rounded-xl w-32 animate-pulse"></div>
                                <div class="h-3 bg-white/10 rounded-lg w-16 animate-pulse"></div>
                            </div>
                            <div class="h-4 bg-white/10 rounded-xl w-full animate-pulse"></div>
                            <div class="h-6 bg-white/10 rounded-full w-20 animate-pulse"></div>
                        </div>
                        
                        <!-- Arrow Skeleton -->
                        <div class="w-6 h-6 bg-white/10 rounded animate-pulse flex-shrink-0"></div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
<script setup lang="ts">
</script>
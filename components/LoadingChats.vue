<template>
    <section class="flex flex-col justify-center p-4">
        <div class="h-full">
            <div class="relative mx-auto shadow-lg rounded-lg">
            <div class="py-3 px-5">
                <h3 class="text-xs font-semibold uppercase text-gray-400 mb-1">Chats</h3>
                <div class="">
                <div v-for="_ in Array.from({length: 5})">
                    <div class="flex flex-col gap-4 p-2 ">
                    <div class="flex gap-3 items-center max-w-full">
                        <div class="skeleton w-9 h-9 rounded-full shrink-0"></div>
                        <div class="flex flex-col gap-4">
                            <div class="skeleton h-3 w-14"></div>
                            <div class="skeleton h-3 w-52"> </div>
                        </div>
                    </div>
                    </div>
                </div>
                </div>
            </div>
            </div>
        </div>
    </section>
</template>
<script setup lang="ts">
</script>
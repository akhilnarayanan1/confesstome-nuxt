<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style="animation-delay: 4s;"></div>
    </div>

    <div v-if="loading.page" class="relative z-10">
      <CircleLoad />
    </div>
    <div v-else class="relative z-10">
      <Dashboard />
    </div>
  </div>
</template>

<script setup lang="ts">

  //Set and clear field alert on page load
  clearFieldAlerts();
  clearToasts(); 

  const loading = reactive({ page: true });
  const profile = getProfile();

  const currentUser = useCurrentUser();

  watchEffect(() => loading.page = currentUser == undefined);

</script>
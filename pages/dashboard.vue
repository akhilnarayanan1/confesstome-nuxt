<template>
  <div>
    <div v-if="loading.page"><CircleLoad /></div>
    <div v-else>
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
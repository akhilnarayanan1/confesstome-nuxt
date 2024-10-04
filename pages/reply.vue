<template>
    <Navbar />
        <div v-if="loading.page"><LoadingChats /></div>
        <div v-else>
            <div> {{ route.query }} </div>
        </div>
</template>

<script setup lang="ts">

    const route = useRoute();

    const loading = reactive({ page: true, replies: true })
    const currentUser = useCurrentUser();

    watchEffect(() => loading.page = currentUser == undefined);

    

</script>
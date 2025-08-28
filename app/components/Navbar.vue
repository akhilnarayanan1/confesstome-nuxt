<template>
    <div class="navbar backdrop-blur-lg sticky top-0 z-40">
        <div class="flex-none">
            <button class="btn btn-square btn-ghost text-white hover:bg-white/20">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path>
                </svg>
            </button>
        </div>
        <div class="flex-1">
            <NuxtLink to="/" class="btn btn-ghost text-xl text-white hover:bg-white/20 font-black">
                🎭 ConfessTo.Me
            </NuxtLink>
        </div>
        <div class="flex-none">
            <div class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="btn btn-ghost text-white hover:bg-white/20">
                    <span class="material-symbols-outlined">more_vert</span>
                </div>
                
                <!-- Loading Menu -->
                <ul v-if="!profile.username" tabindex="0" class="menu dropdown-content p-4 shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl w-52 mt-4">
                    <div v-for="(_, index) in Array.from({length: 3})" :key="index" class="mb-2">
                        <div class="h-8 bg-white/20 rounded-xl animate-pulse"></div>
                    </div>
                </ul>
                
                <!-- Loaded Menu -->
                <ul v-else tabindex="0" class="menu dropdown-content p-2 shadow-2xl bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl w-52 mt-4 text-white">
                    <li>
                        <a class="rounded-xl hover:bg-white/20 transition-colors font-medium">
                            <span class="material-symbols-outlined text-yellow-300">edit</span>
                            Edit Profile
                        </a>
                    </li> 
                    <li>
                        <a @click="showLogoutModal = true" class="rounded-xl hover:bg-white/20 transition-colors font-medium">
                            <span class="material-symbols-outlined text-pink-300">logout</span>
                            Logout
                        </a>
                    </li>
                </ul>
            </div>
        </div>
    </div>

    <!-- Logout Confirmation Modal -->
    <div v-if="showLogoutModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl max-w-sm w-full">
            <div class="text-center">
                <div class="text-5xl mb-4">🤔</div>
                <h3 class="text-2xl font-black text-white mb-3">Sure?</h3>
                <p class="text-white/80 leading-relaxed mb-8">
                    Are you sure you want to log out? You'll need to sign back in to access your chats.
                </p>
                
                <div class="flex gap-3">
                    <button 
                        @click="signOutUser" 
                        class="flex-1 bg-gradient-to-r from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 text-white font-black py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
                    >
                        🚪 CONFIRM
                    </button>
                    <button 
                        @click="showLogoutModal = false"
                        class="flex-1 bg-white/20 hover:bg-white/30 text-white font-bold py-3 px-6 rounded-full transition-all duration-300 transform hover:scale-105"
                    >
                        ❌ CANCEL
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">

    const auth = useFirebaseAuth()!;
    const user = useCurrentUser();

    const isDark = ref(false);
    const showLogoutModal = ref(false);

    const profile = getProfile();


    const signOutUser = async () => {
        if (!user.value?.isAnonymous as boolean) {
            // console.log(user.value)
            // const anonymousUserCredential = await signInAnonymously(auth);
            // linkWithCredential(user.value as User, anonymousUserCredential )
            // await unlink(user.value as User, user.value?.providerData[0].providerId as string)
            // .catch(error => {
            //     addToast({
            //         message: error,
            //         type: "error",
            //     });
            // });
            // signOut(auth).catch(error => {
            //     addToast({
            //         message: error,
            //         type: "error",
            //     });
            // });
        } else {
            addToast({
                message: "Already signedout. Can't signout again.",
                type: "error",
                duration: 3000,
            });
        };
    };

</script>
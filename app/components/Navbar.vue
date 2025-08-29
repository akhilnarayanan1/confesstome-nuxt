<template>
    <div class="navbar backdrop-blur-lg sticky top-0 z-40">
        <div class="flex-1">
            <NuxtLink to="/" class="btn btn-ghost text-xl text-white hover:bg-white/20 font-black">
                🎭 {{ appConfig.appName }}
            </NuxtLink>
        </div>
        <div class="flex-none">
            <div class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="btn btn-ghost text-white hover:bg-white/20">
                    <span class="material-symbols-outlined">more_vert</span>
                </div>
                
                <!-- Loading Menu -->
                <ul v-if="!profile.username" tabindex="0" class="menu dropdown-content p-4 bg-black/60 backdrop-blur-lg border border-white/20 rounded-2xl w-52 mt-4">
                    <div v-for="(_, index) in Array.from({length: 3})" :key="index" class="mb-2">
                        <div class="h-8 bg-white/20 rounded-xl animate-pulse"></div>
                    </div>
                </ul>
                
                <!-- Loaded Menu -->
                <ul v-else tabindex="0" class="menu dropdown-content p-2 shadow-2xl bg-black/60 backdrop-blur-sm border border-white/20 rounded-2xl w-52 mt-4 text-white">
                    <li>
                        <a @click="showEditProfile = true" class="rounded-xl hover:bg-white/20 transition-colors font-medium cursor-pointer">
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

    <!-- Edit Profile Modal -->
    <CompleteProfile :active="showEditProfile" :editMode="true" @load-profile="onProfileUpdated" />

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
    const showEditProfile = ref(false);

    const profile = getProfile();
    const appConfig = useAppMetaConfig();


    const signOutUser = async () => {
        performSignout();
        showLogoutModal.value = false;
        addToast({
            message: "Signed out successfully!",
            type: "success",
            duration: 2000,
        });
    };

    const onProfileUpdated = () => {
        showEditProfile.value = false;
        addToast({
            message: "Profile updated successfully!",
            type: "success",
            duration: 2000,
        });
    };

</script>
<template>
    <div class="navbar bg-base-100">
        <div class="flex-none">
            <button class="btn btn-square btn-ghost">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" class="inline-block w-5 h-5 stroke-current"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"></path></svg>
            </button>
        </div>
        <div class="flex-1">
            <a class="btn btn-ghost normal-case text-xl">ConfessTo.Me</a>
        </div>
        <div class="flex-none">
            <label class="swap swap-rotate">
                <input data-key="theme" data-toggle-theme="light,dark" data-act-class="ACTIVECLASS" type="checkbox" class="theme-controller" />                    
                <span :class="{'fill-current material-symbols-outlined': true, 'swap-on': isDark, 'swap-off': !isDark}">dark_mode</span>
                <span :class="{'fill-current material-symbols-outlined': true, 'swap-off': isDark, 'swap-on': !isDark}">light_mode</span>
            </label>
            <div class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="btn btn-ghost">
                    <span class="material-symbols-outlined">more_vert</span>
                </div>
                <ul v-if="!profile.username" tabindex="0" class="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                    <div v-for="_ in Array.from({length: 5})">
                        <li><a class="skeleton h-3 w-14 my-2"></a></li> 
                    </div>
                </ul>
                <ul v-else tabindex="0" class="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
                    <li><a>Edit Profile</a></li> 
                    <li onclick="logout_confirm.showModal()"><a>Logout</a></li>
                </ul>
            </div>
        </div>
    </div>

    <dialog id="logout_confirm" class="modal modal-bottom sm:modal-middle">
        <div class="modal-box">
            <h3 class="font-bold text-2xl">Sure?</h3>
            <p class="mt-6">Are you sure, you want to log-out?</p>
            <div class="modal-action">
                <form id="formDialog" method="dialog">
                    <!-- if there is a button in form, it will close the modal -->
                    <button @click="signOutUser" class="btn btn-ghost">CONFIRM</button>
                    <button class="btn">CLOSE</button>
                </form>
            </div>
        </div>
    </dialog>
    
</template>

<script setup lang="ts">
    import { themeChange } from "theme-change";
    import type { FirestoreUserProfile } from "@/assets/js/types";

    const auth = useFirebaseAuth()!;
    const user = useCurrentUser();

    const isDark = ref(false);

    const profile = getProfile();

    onMounted(() => {
        isDark.value = localStorage.getItem("theme") === "dark" ? true : false;
        themeChange(false);
    })

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
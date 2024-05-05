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
        <div class="dropdown">
            <div tabindex="0" role="button" class="btn">Theme</div>
            <ul tabindex="0" class="dropdown-content z-[1] shadow-2xl menu bg-base-200 rounded-box">
                <li><input type="radio" name="theme-dropdown" class="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Light" value="light"/></li>
                <li><input type="radio" name="theme-dropdown" class="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Dark" value="dark"/></li>
                <li><input type="radio" name="theme-dropdown" class="theme-controller btn btn-sm btn-block btn-ghost justify-start" aria-label="Default" value="default"/></li>
            </ul>
        </div>
        <div class="flex-none">
            <!-- <button class="btn btn-ghost btn-circle">
                <div class="indicator">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                    <span class="badge badge-xs badge-primary indicator-item"></span>
                </div>
            </button> -->
            <div class="dropdown dropdown-end">
                <div tabindex="0" role="button" class="btn btn-ghost">
                    <span class="material-symbols-outlined">more_vert</span>
                </div>
                <ul tabindex="0" class="menu dropdown-content p-2 shadow bg-base-100 rounded-box w-52 mt-4">
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
    import { signOut, unlink, linkWithCredential, signInAnonymously, type User, type AuthCredential } from "firebase/auth";
    
    const auth = useFirebaseAuth()!;
    const user = useCurrentUser();

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
<template>
    <div v-if="completeProfileModal.open" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl max-w-lg w-full transform transition-all duration-300 scale-100">
            <div class="text-center mb-8">
                <div class="text-6xl mb-4">✨</div>
                <h3 class="text-4xl font-black text-white mb-3">Complete Your Profile</h3>
                <p class="text-white/80 leading-relaxed">
                    Just a couple more details to unlock the full experience! 🚀
                </p>
            </div>

            <form id="formCreateAccount" @submit.prevent="createAccount">
                <div class="form-control mb-6">
                    <label class="input input-bordered flex items-center gap-2 border-2 border-white/30 bg-white/5 hover:border-white/50 focus-within:border-yellow-300 rounded-2xl w-full">
                        <span class="text-xl opacity-70 flex-shrink-0">👤</span>
                        <input 
                            id="inputName" 
                            v-model="form.update_name" 
                            type="text" 
                            placeholder="Enter your name" 
                            class="flex-1 w-full bg-transparent text-white placeholder-white/60 font-medium border-none outline-none"
                        >
                    </label>
                    <InputLabel labelName="update_name"/>
                </div>

                <div class="form-control mb-8">
                    <label class="input input-bordered flex items-center gap-2 border-2 border-white/30 bg-white/5 hover:border-white/50 focus-within:border-yellow-300 rounded-2xl w-full">
                        <span class="text-xl opacity-70 flex-shrink-0">@</span>
                        <input 
                            id="inputUsername" 
                            autocomplete="false" 
                            v-model="form.update_username" 
                            type="text" 
                            placeholder="Choose a username" 
                            class="flex-1 w-full bg-transparent text-white placeholder-white/60 font-medium border-none outline-none"
                        > 
                    </label>
                    <InputLabel labelName="update_username"/>
                </div>

                <button 
                    type="submit" 
                    class="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-black py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-pink-500/50"
                    :disabled="loading.continue"
                >
                    <span v-if="loading.continue" class="loading loading-spinner loading-sm"></span>
                    <span v-else>🎉 CONTINUE TO DASHBOARD</span>
                </button>
            </form>

            <!-- Fun Benefits -->
            <div class="mt-8 p-6 bg-white/5 backdrop-blur-sm rounded-2xl border border-white/10">
                <div class="text-center">
                    <div class="text-sm text-white/80 leading-relaxed">
                        🔗 Get your personal link • 💬 Receive confessions • 🎭 Stay anonymous
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
    import type { ToastData } from "@/assets/js/types";
    import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
    import { collection, query, where, getDocs, and } from "firebase/firestore";
    import { CompleteProfileForm } from "@/assets/js/forms";

    // Add props to control when profile completion should be active
    const props = defineProps({
        active: {
            type: Boolean,
            default: false
        }
    });

    const currentUser = useCurrentUser();
    const db = useFirestore()!;
    
    watch(currentUser, (newCurrentUser) => {
        if (newCurrentUser === undefined || newCurrentUser === null) {
            //Stop processing if user is blank - don't show error during initial auth
            return;
        } else if (props.active) {
            // Only check profile completion when component is active
            isProfileCompleted();
        };
    });
    
    // Also watch for active prop changes
    watch(() => props.active, (isActive) => {
        if (isActive && currentUser.value) {
            isProfileCompleted();
        } else if (!isActive) {
            completeProfileModal.open = false;
        }
    });
    
    const loading = reactive({ continue: false });
    const completeProfileModal = reactive({ loading:true, open: false });
    const emit = defineEmits(['loadProfile']);

    //Create a form
    const form = reactive({
        update_name: '',
        update_username: ''
    });

    const createAccount = async () => {
        //Stop processing if user is blank
        if(!currentUser.value){
            addToast({
                message: "Unknown error, Please try again (101)",
                type: "error",
                duration: 2000,
            } as ToastData);
            return;
        };

        //Stop processing if any UI error
        const completeProfileForm = new CompleteProfileForm(form);
        if(!completeProfileForm.checkFormValid()) return;

        loading.continue = true;

        const q = query(collection(db, "users"), and(where("username", "==", form.update_username), where("__name__", "!=", currentUser.value?.uid as string)));
        const querySnapshot = await getDocs(q).catch((err) => {
            addToast({
                message: err,
                type: "error",
                duration: 2000,
            } as ToastData);
        });
        if (!querySnapshot || !querySnapshot.empty) {
            addFieldAlert({
                message: "User already exist. Pick another username.",
                source: "server",
                type: "error",
                fieldid: "update_username",
            })
        } else {
            await setDoc(doc(db, "users", currentUser.value?.uid as string), {
                name: form.update_name,
                username: form.update_username,
                createdOn: serverTimestamp(),
            });
            completeProfileModal.open = false;
            performLogin();
            emit('loadProfile');
            addToast({
                message: "Profile updated successfully!",
                type: "success",
                duration: 2000,
            } as ToastData);
        }
        loading.continue = false;
    };

    const isProfileCompleted = async () => {
        const userSnap = await getDoc(doc(db, "users", currentUser.value?.uid as string)).catch((err) => {
            addToast({
                message: err,
                type: "error",
                duration: 2000,
            } as ToastData);
        });
        completeProfileModal.loading = false;
        if (!currentUser.value?.isAnonymous && (!userSnap || !userSnap.exists() || !userSnap.data().name || !userSnap.data().username)) {
            completeProfileModal.open = true;
        } 
    };

</script>
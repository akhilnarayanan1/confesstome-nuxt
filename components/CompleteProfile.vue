<template>

    <dialog id="completeProfileModal" :class="completeProfileModal.open ? 'modal modal-open' : 'modal' ">
        <div class="modal-box">
            <h3 class="font-bold text-lg mb-4">Complete Profile</h3>

            <form id="formCreateAccount" @submit.prevent="createAccount">
                <div class="form-control">
                    <div class="relative input-group border rounded-lg">
                        <div class="absolute mt-3 flex items-center ps-3.5">
                            <span class="material-symbols-outlined">badge</span>
                        </div>
                        <input id="inputName" v-model="form.update_name" type="text" placeholder="Enter your name" class="w-full input ps-12">
                    </div>
                    <InputLabel labelName="update_name"/>
                </div>

                <div class="form-control">
                    <div class="relative input-group border rounded-lg">
                        <div class="absolute mt-3 flex items-center ps-3.5">
                            <span class="material-symbols-outlined">alternate_email</span>
                        </div>
                        <input id="inputUsername" autocomplete="false" v-model="form.update_username" type="text" placeholder="Choose a username" class="w-full input ps-12"> 
                    </div>
                    <InputLabel labelName="update_username"/>
                </div>

                <div class="modal-action">
                    <button type="submit" class="btn btn-block glass bg-primary hover:bg-primary text-white">
                        <span v-if="loading.continue" class="loading loading-spinner loading-sm"></span>
                        <span>CONTINUE</span>
                    </button>
                </div>

                
            </form>
            
        </div>
    </dialog>
</template>

<script setup lang="ts">
    import type { ToastData } from "@/assets/js/types";
    import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
    import { collection, query, where, getDocs, and } from "firebase/firestore";
    import { CompleteProfileForm } from "@/assets/js/forms";

    const currentUser = useCurrentUser();
    const db = useFirestore();
    
    watch(currentUser, (newCurrentUser) => {
        if (newCurrentUser === undefined || newCurrentUser === null) {
            //Stop processing if user is blank
            addToast({
                message: "Unknown error, Please try again (101)",
                type: "error",
                duration: 2000,
            } as ToastData);
            return;
        } else {
            isProfileCompleted();
        };
    });
    
    const loading = reactive({ continue: false });
    const completeProfileModal = reactive({ loading:true, open: false });
    const emit = defineEmits(['loadProfile'])

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
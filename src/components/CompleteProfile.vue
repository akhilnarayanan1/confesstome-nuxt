<template>

    <dialog id="completeProfileModal" :class="completeProfileModal.open ? 'modal modal-open' : 'modal' ">
        <div class="modal-box">
            <h3 class="font-bold text-lg mb-4">Complete Profile</h3>

            <form @submit.prevent="createAccount">
                <div class="form-control">
                <div class="input-group border rounded-lg">
                    <span class="bg-transparent">🤠</span>
                    <input v-model="form.update_name" type="text" placeholder="Enter your name" class="w-full input">
                </div>  
                <InputLabel labelName="update_name"/>
                </div> 
                
                <div class="form-control">
                <div class="input-group border rounded-lg">
                    <span class="bg-transparent">🩸</span>
                    <input autocomplete="false" v-model="form.update_username" type="text" placeholder="Choose a username" class="w-full input"> 
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
    import { type ToastData } from "@/assets/js/types";
    import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
    import { collection, query, where, getDocs } from "firebase/firestore";
    import { CompleteProfileForm } from "@/assets/js/forms";

    const db = useFirestore();
    
    const loading = reactive({ continue: false });
    const completeProfileModal = reactive({ loading:true, open: false });

    //Create a form
    const form = reactive({
        update_name: '',
        update_username: ''
    });

    const createAccount = async () => {
        const currentUser = firebaseUser().value || await getUserDataPromised();

        //Stop processing if user is blank
        if(!currentUser){
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

        const q = query(collection(db, "users"), where("username", "==", form.update_username));
        const querySnapshot = await getDocs(q);
        if (!querySnapshot.empty) {
            addFieldAlert({
                message: "User already exist. Pick another username.",
                source: "server",
                type: "error",
                fieldid: "update_username",
            })
        } else {
            await setDoc(doc(db, "users", currentUser.uid), {
                name: form.update_name,
                username: form.update_username,
                createdOn: serverTimestamp(),
            });
            completeProfileModal.open = false;
            addToast({
                message: "Profile updated successfully!",
                type: "success",
                duration: 2000,
            } as ToastData);
        }
        loading.continue = false;
    };

    onMounted(async ()=>{
        const currentUser = firebaseUser().value || await getUserDataPromised();
        const userSnap = await getDoc(doc(db, "users", currentUser.uid));

        completeProfileModal.loading = false;

        if (!currentUser.isAnonymous && (!userSnap.exists() || !userSnap.data().name || !userSnap.data().username)) {
            completeProfileModal.open = true;
        } 
    });

</script>
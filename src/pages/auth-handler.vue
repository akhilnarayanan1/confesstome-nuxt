<template>
  <div class="authhandler">
    <div class="flex items-center justify-center h-screen">
        
      <div v-if="loading.data">
        Loading
      </div>
      <div v-else-if="invalidOrExpired">
        <div class="card shadow max-w-sm m-4">
          <div class="card-body">
            {{ message }}
          </div>
        </div>
      </div>
      <div v-else-if="mode==='verifyEmail' && !invalidOrExpired">
        <div class="card shadow max-w-sm m-4">
          <div class="card-body">
            Email verified successfully!
          </div>
        </div>
      </div>
      <div v-else-if="mode==='resetPassword' && !invalidOrExpired">
        <div class="card shadow max-w-sm m-4">
          <div class="card-body">
            <div class="text-4xl font-bold mb-4">Reset Password</div>
            <div class="my-4">Hi {{ maskedEmail }}, please enter your new password</div>
            <form @submit.prevent="resetPassword">
              <div class="form-control">
                <div class="input-group border rounded-lg">
                  <span class="bg-transparent">🔒</span>
                  <input v-model="form.reset_password" type="password" placeholder="Choose a password" class="w-full input" autocomplete="false"> 
                </div>  
                <InputLabel labelName="reset_password"></InputLabel>
              </div> 
              <div class="form-control">
                <div class="input-group border rounded-lg">
                  <span class="bg-transparent">🔒</span>
                  <input v-model="form.reset_confirm_password" type="password" placeholder="Confirm your password" class="w-full input" autocomplete="false"> 
                </div>  
                <InputLabel labelName="reset_confirm_password"/>
              </div> 
              <button type="submit" :class="loading.reset ? 
              'btn btn-block glass bg-primary hover:bg-primary loading': 
              'btn btn-block glass bg-primary hover:bg-primary'">
                CHANGE PASSWORD
              </button>
            </form>
          </div>
        </div>
      </div>
      
      <div v-else>
        Invalid Page
      </div>


    </div>
  </div>
</template>


<script setup lang="ts">
  import _ from "lodash";
  import { type ToastData } from "@/assets/js/types";
  import { maskMail } from "@/assets/js/functions";
  import { verifyPasswordResetCode, applyActionCode, confirmPasswordReset } from "firebase/auth";
  import { ResetPasswordForm } from "@/assets/js/forms";

  const loading: { data: boolean, reset: boolean } = reactive({ data: false, reset: false });

  //Set and clear field alert on page load
  let fieldAlert = getFieldAlerts();
  clearFieldAlerts();
  clearToasts();

  const auth = useFirebaseAuth()!;

  const route = useRoute();

  const query = route.query;
  const mode = query.mode?.toString();
  const actionCode = query.oobCode?.toString() || "";
  const continueUrl = query.continueUrl?.toString();
  const lang = query.lang?.toString() || "en";

  // const reset_password = ref("");
  // const reset_confirm_password = ref("");
  const message = ref("");
  const invalidOrExpired = ref(false);
  const maskedEmail = ref("");

  //Create a form
  const form = reactive({
    reset_password: '',
    reset_confirm_password: ''
  });

  // watch(() => _.cloneDeep(fieldProps.value),
  // (newval, preval) => {
  //   //Find and delete any alerts that are no longer relevant
  //   const changedKey = changedKeys(newval, preval);
  //   for (let i=0; i< changedKey.length; i++) {
  //     const isOnIndex = (_.findIndex(fieldAlert.value, {fieldid: changedKey[i]}));
  //     if(isOnIndex > -1) fieldAlert.value.splice(isOnIndex, 1);
  //   };
  //   //Match password again on input change
  //   if (changedKey.includes("reset_confirm_password")) {
  //     const resetPasswordForm = new ResetPasswordForm(newval);
  //     resetPasswordForm.passwordMatcher();
  //   };
  // });

  const handleResetPassword = (actionCode: string, continueUrl: string | undefined, lang: string) => {
    verifyPasswordResetCode(auth, actionCode).then((email) => {
      loading.data = false;
      maskedEmail.value = maskMail(email);
    }).catch((err) => {
      loading.data = false;
      invalidOrExpired.value = true;
      switch(err.code) {
        case "auth/expired-action-code":
        case "auth/invalid-action-code":
          message.value = "Invalid or expired token. Please request a new one.";
          break;
        default:
          message.value = err;
          break;
      };
    });
  };

  const handleVerifyEmail = (actionCode: string, continueUrl: string | undefined, lang: string) => {
    applyActionCode(auth, actionCode).then(() => {
      loading.data = false;
    }).catch((err) => {
      loading.data = false;
      invalidOrExpired.value = true;
      switch(err.code) {
        case "auth/expired-action-code":
        case "auth/invalid-action-code":
          message.value = "Invalid or expired token. Please request a new one.";
          break;
        default:
          message.value = err;
          break;
      };
    });
  };

  switch (mode) {
    case "resetPassword":
      loading.data = true;
      handleResetPassword(actionCode, continueUrl, lang);
      break;
    case "verifyEmail":
      loading.data = true;
      handleVerifyEmail(actionCode, continueUrl, lang);
      break;
    default:
      break;
  };

  const resetPassword = () => {

    //Stop processing if any UI error
    const resetPasswordForm = new ResetPasswordForm(form);
    if(!resetPasswordForm.checkFormValid()) return;

    loading.reset = true

    confirmPasswordReset(auth, actionCode, form.reset_password).then(() => {
        loading.reset = false;
        addToast({
          message: "Password changed successfully",
          type: "success",
        } as ToastData);
      }).catch((err) => {
        loading.reset = false;
        switch (err.code) {
          case "auth/expired-action-code":
          case "auth/invalid-action-code":
            invalidOrExpired.value = true;
            message.value = "Invalid or expired token. Please request a new one.";
            break;
          default:
            invalidOrExpired.value = true;
            message.value = err;
            break;
      };
    });

  };
</script>
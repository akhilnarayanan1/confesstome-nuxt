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
                  <input v-model="reset_password" type="password" placeholder="Choose a password" class="w-full input" autocomplete="false"> 
                </div>  
                <InputLabel labelName="reset_password"></InputLabel>
              </div> 
              <div class="form-control">
                <div class="input-group border rounded-lg">
                  <span class="bg-transparent">🔒</span>
                  <input v-model="reset_confirm_password" type="password" placeholder="Confirm your password" class="w-full input" autocomplete="false"> 
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
  import { AlertData, ResetPasswordData, ToastData } from "@/assets/js/types";
  import { changedKeys, maskMail } from "@/assets/js/functions";
  import { verifyPasswordResetCode, applyActionCode, confirmPasswordReset } from "firebase/auth";

  const loading: { data: boolean, reset: boolean } = reactive({ data: false, reset: false });

  //Set and clear field alert on page load
  let fieldAlert = getFieldAlerts();
  clearFieldAlerts();
  clearToasts();

  const { $firebaseAuth } = useNuxtApp();

  const route = useRoute();

  const query = route.query;
  const mode = query.mode?.toString();
  const actionCode = query.oobCode?.toString() || "";
  const continueUrl = query.continueUrl?.toString();
  const lang = query.lang?.toString() || "en";

  const reset_password = ref("");
  const reset_confirm_password = ref("");
  const message = ref("");
  const invalidOrExpired = ref(false);
  const maskedEmail = ref("");

  //Create an object with computed values of the fields
  const fieldProps = computed(() => {
    return {
      reset_password: reset_password.value,
      reset_confirm_password: reset_confirm_password.value,
    };
  });

  watch(() => _.cloneDeep(fieldProps.value),
  (newval, preval) => {
    //Find and delete any alerts that are no longer relevant
    const changedKey = changedKeys(newval, preval);
    for (let i=0; i< changedKey.length; i++) {
      const isOnIndex = (_.findIndex(fieldAlert.value, {fieldid: changedKey[i]}));
      if(isOnIndex > -1) fieldAlert.value.splice(isOnIndex, 1);
    };
    //Match password again on input change
    if (changedKey.includes("reset_confirm_password")) {
      const resetPasswordForm = new ResetPasswordForm(newval);
      resetPasswordForm.passwordMatcher();
    };
  });

  const handleResetPassword = (actionCode: string, continueUrl: string, lang: string) => {
    verifyPasswordResetCode($firebaseAuth, actionCode).then((email) => {
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

  const handleVerifyEmail = (actionCode: string, continueUrl: string, lang: string) => {
    applyActionCode($firebaseAuth, actionCode).then(() => {
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

  class ResetPasswordForm {
    reset_password: string;
    reset_confirm_password: string;

    constructor(props: ResetPasswordData){
      this.reset_password = props.reset_password;
      this.reset_confirm_password = props.reset_confirm_password;
    };

    checkRequiredFields() {
      if (this.reset_password.length < 6) {
        addFieldAlert({
            message: "Password must be at least 6 characters",
            type: "error",
            source: "ui",
            fieldid: "reset_password",
        } as AlertData);
      };
      if (this.reset_confirm_password.length < 6) {
        addFieldAlert({
            message: "Password must be at least 6 characters",
            fieldid: "reset_confirm_password",
            source: "ui",
            type: "error",
        } as AlertData);
      };
    };

    passwordMatcher() {
      if ((this.reset_password.length >= 6) && 
      (this.reset_password === this.reset_confirm_password)) {
        addFieldAlert({
          message: "Password matched",
          fieldid: "reset_confirm_password",
          source: "ui",
          type: "success",
        } as AlertData);
      }else if ((this.reset_password.length >= 6) && 
      (this.reset_password !== this.reset_confirm_password)) {
        addFieldAlert({
          message: "Passwords do not match",
          fieldid: "reset_confirm_password",
          source: "ui",
          type: "error",
        } as AlertData);
      };
    };

    checkFormValid(){
      this.checkRequiredFields()
      this.passwordMatcher()
      return (_.findIndex(fieldAlert.value, {
        source: "ui", 
        type: "error",
      }) > -1) ? false : true
    };

  };

  const resetPassword = () => {

    //Stop processing if any UI error
    const resetPasswordForm = new ResetPasswordForm(fieldProps.value);
    if(!resetPasswordForm.checkFormValid()) return;

    loading.reset = true

    confirmPasswordReset($firebaseAuth, actionCode, reset_password.value).then(() => {
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
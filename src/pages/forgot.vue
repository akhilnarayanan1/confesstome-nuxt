<template>
  <div class="forgot flex items-center justify-center h-screen">
    <div class="card shadow max-w-sm m-4">
      <div class="card-body">
          
        <div class="text-4xl font-bold mb-4">Forgot Password</div>
        <div class="mb-4">Enter the e-mail associated with your account</div>

        <form @submit.prevent="forgotPassword">
          <div class="form-control">
            <div class="input-group border rounded-lg">
              <span class="bg-transparent">📧</span>
              <input v-model="forgot_email" type="email" placeholder="Enter your e-mail" class="w-full input"> 
            </div>  
              <InputLabel labelName="forgot_email" />
          </div> 
          
          <button type="submit" :class="loading.forgot ? 
          'btn btn-block glass bg-primary hover:bg-primary loading': 
          'btn btn-block glass bg-primary hover:bg-primary'">
            FORGOT PASSWORD
          </button>
        </form>

      </div>
    </div> 

  </div>
</template>

<script setup lang="ts">

  import _ from "lodash";
  import { sendPasswordResetEmail } from "firebase/auth";
  import { AlertData, ForgotPasswordData } from "@/assets/js/types";
  import { changedKeys } from "@/assets/js/functions";

  let loading: { forgot: boolean } = reactive({ forgot: false });
  
  //Set and clear field alert on page load
  let fieldAlert = getFieldAlerts();
  clearFieldAlerts();
  clearToasts();

  const { $firebaseAuth } = useNuxtApp();
  const forgot_email = ref("");

  //Create an object with computed values of the fields
  const fieldProps = computed(() => {
    return {
      forgot_email: forgot_email.value,
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
  });

  class ForgotPasswordForm{
    forgot_email: string;
    constructor(props: ForgotPasswordData){
      this.forgot_email = props.forgot_email;
    };
    checkRequiredFields(){
      if (this.forgot_email.length <= 0) {
        addFieldAlert({
          message: "Email is required",
          type: "error",
          source: "ui",
          fieldid: "forgot_email",
        } as AlertData);
      };
    };
    checkFormValid(){
      this.checkRequiredFields();
      return (_.findIndex(fieldAlert.value, {
        source: "ui", 
        type: "error",
      }) > -1) ? false : true;
    };
  };

  const forgotPassword = () => {

    //Stop processing if any UI error
    const forgotPasswordForm = new ForgotPasswordForm(fieldProps.value);
    if(!forgotPasswordForm.checkFormValid()) return;

    loading.forgot = true;
    sendPasswordResetEmail($firebaseAuth, forgot_email.value)
    .then(() => {
      loading.forgot = false;
      addFieldAlert({
        message: "Email sent (if account exists)",
        type: "success",
        source: "server",
        fieldid: "forgot_email",
      } as AlertData);
    })
    .catch((err) => {
      loading.forgot = false;

      switch(err.code) {
        case "auth/too-many-requests":
          addFieldAlert({
            message: "Calm down. You are trying to too many times",
            type: "error",
            source: "server",
            fieldid: "forgot_email",
          } as AlertData);
          break;
        case "auth/user-not-found":
          addFieldAlert({
            message: "Email sent (if account exists)",
            type: "success",
            source: "server",
            fieldid: "forgot_email",
          } as AlertData);
          break;
        default:
          addFieldAlert({
            message: err,
            type: "error",
            source: "server",
            fieldid: "forgot_email",
          } as AlertData);
      };
    });
  };

</script>
<template>
  <div class="forgot flex items-center justify-center h-screen">
    <div class="card shadow max-w-sm m-4">
      <div class="card-body">
          
        <div class="text-4xl font-bold mb-4">Forgot Password</div>
        <div class="mb-4">Enter the e-mail associated with your account</div>

        <form id="formForgotPassword" @submit.prevent="forgotPassword">
          <div class="form-control">
            <div class="relative input-group border rounded-lg">
              <div class="absolute mt-3 flex items-center ps-3.5">
                <span class="material-symbols-outlined">email</span>
              </div>
              <input v-model="form.forgot_email" type="email" placeholder="Enter your e-mail" class="w-full input ps-12"> 
            </div>
            <InputLabel labelName="forgot_email"/>
          </div>
          <button type="submit" class="btn btn-block glass bg-primary hover:bg-primary text-white">
            <span v-if="loading.forgot" class="loading loading-spinner loading-sm"></span>
            <span>FORGOT PASSWORD</span>
          </button>
        </form>

      </div>
    </div> 

  </div>
</template>

<script setup lang="ts">

  import _ from "lodash";
  import { sendPasswordResetEmail } from "firebase/auth";
  import type { AlertData } from "@/assets/js/types";
  import { ForgotPasswordForm } from "@/assets/js/forms";

  let loading: { forgot: boolean } = reactive({ forgot: false });
  
  //Set and clear field alert on page load
  clearFieldAlerts();
  clearToasts();

  const auth = useFirebaseAuth()!;

  //Create a form
  const form = reactive({
    forgot_email: ''
  });

  const forgotPassword = () => {

    //Stop processing if any UI error
    const forgotPasswordForm = new ForgotPasswordForm(form);
    if(!forgotPasswordForm.checkFormValid()) return;

    loading.forgot = true;
    sendPasswordResetEmail(auth, form.forgot_email)
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
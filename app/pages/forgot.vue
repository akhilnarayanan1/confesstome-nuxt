<template>
    <div class="flex items-center justify-center min-h-screen">
      <div class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl max-w-sm w-full m-4">
          
        <div class="text-4xl font-black mb-6 text-center">🔐 Forgot Password</div>
        <div class="mb-6 text-center text-white/90">Enter the e-mail associated with your account</div>

        <form id="formForgotPassword" @submit.prevent="forgotPassword">
          <div class="form-control">
            <label class="input input-bordered flex items-center gap-2 border-2 border-white/30 bg-white/5 hover:border-white/50 focus-within:border-yellow-300 rounded-2xl">
              <span class="text-xl opacity-70">📧</span>
              <input v-model="form.forgot_email" type="email" placeholder="Enter your e-mail" class="grow bg-transparent" />
            </label>
            <InputLabel labelName="forgot_email"/>
          </div>
          <button type="submit" class="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-black py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-pink-500/50">
            <span v-if="loading.forgot" class="loading loading-spinner loading-sm"></span>
            <span>📧 RESET PASSWORD</span>
          </button>
        </form>

      </div>
    </div>
</template>

<script setup lang="ts">

  import _ from "lodash";
  import { sendPasswordResetEmail } from "firebase/auth";
  import type { AlertData } from "@/assets/js/types";
  import { ForgotPasswordForm } from "@/assets/js/forms";

  definePageMeta({ layout: 'auth' });

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
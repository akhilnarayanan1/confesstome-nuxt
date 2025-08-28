<template>
  <div class="min-h-screen bg-gradient-to-br from-purple-600 via-pink-500 to-orange-400 text-white relative overflow-hidden">
    <!-- Animated background elements -->
    <div class="absolute inset-0 overflow-hidden">
      <div class="absolute -top-40 -right-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse"></div>
      <div class="absolute -bottom-40 -left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style="animation-delay: 2s;"></div>
      <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-pulse" style="animation-delay: 4s;"></div>
    </div>

    <div class="flex items-center justify-center min-h-screen relative z-10">
      <!-- Loading State -->
      <div v-if="loading.data" class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl max-w-sm w-full m-4">
        <div class="text-center">
          <div class="text-6xl mb-4">⚡</div>
          <div class="text-2xl font-black mb-2">Processing...</div>
          <div class="loading loading-dots loading-lg text-yellow-300"></div>
        </div>
      </div>

      <!-- Error/Expired State -->
      <div v-else-if="invalidOrExpired" class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-pink-300/50 shadow-2xl max-w-sm w-full m-4">
        <div class="text-center">
          <div class="text-6xl mb-4">🚫</div>
          <div class="text-2xl font-black mb-4 text-pink-300">Oops!</div>
          <div class="text-white/90 leading-relaxed">{{ message }}</div>
        </div>
      </div>

      <!-- Email Verified Success -->
      <div v-else-if="mode==='verifyEmail' && !invalidOrExpired" class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-yellow-300/50 shadow-2xl max-w-sm w-full m-4">
        <div class="text-center">
          <div class="text-6xl mb-4">✅</div>
          <div class="text-2xl font-black mb-4 text-yellow-300">Success!</div>
          <div class="text-white/90 leading-relaxed">Email verified successfully! You can now login to your account. 🎉</div>
        </div>
      </div>

      <!-- Reset Password Form -->
      <div v-else-if="mode==='resetPassword' && !invalidOrExpired" class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl max-w-sm w-full m-4">
        <div class="text-center mb-6">
          <div class="text-6xl mb-4">🔐</div>
          <div class="text-4xl font-black mb-4">Reset Password</div>
          <div class="text-white/90 leading-relaxed">Hi {{ maskedEmail }}, please enter your new password 🔑</div>
        </div>

        <form id="formResetPassword" @submit.prevent="resetPassword">
          <div class="form-control">
            <label class="input input-bordered flex items-center gap-2 border-2 border-white/30 bg-white/5 hover:border-white/50 focus-within:border-yellow-300 rounded-2xl">
              <span class="text-xl opacity-70">🔒</span>
              <input v-model="form.reset_password" type="password" placeholder="Choose a password" class="grow bg-transparent" autocomplete="false" />
            </label>
            <InputLabel labelName="reset_password"/>
          </div>

          <div class="form-control">
            <label class="input input-bordered flex items-center gap-2 border-2 border-white/30 bg-white/5 hover:border-white/50 focus-within:border-yellow-300 rounded-2xl">
              <span class="text-xl opacity-70">🔒</span>
              <input v-model="form.reset_confirm_password" type="password" placeholder="Confirm your password" class="grow bg-transparent" autocomplete="false" />
            </label>
            <InputLabel labelName="reset_confirm_password"/>
          </div>

          <button type="submit" class="w-full bg-gradient-to-r from-pink-500 to-orange-500 hover:from-pink-600 hover:to-orange-600 text-white font-black py-4 px-8 rounded-full text-lg transition-all duration-300 transform hover:scale-105 shadow-2xl hover:shadow-pink-500/50">
            <span v-if="loading.reset" class="loading loading-spinner loading-sm"></span>
            <span>🔑 CHANGE PASSWORD</span>
          </button>
        </form>
      </div>
      
      <!-- Invalid Page -->
      <div v-else class="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-orange-300/50 shadow-2xl max-w-sm w-full m-4">
        <div class="text-center">
          <div class="text-6xl mb-4">❓</div>
          <div class="text-2xl font-black mb-4 text-orange-300">Invalid Page</div>
          <div class="text-white/90 leading-relaxed">This page doesn't seem to exist or the link is broken. 🤔</div>
        </div>
      </div>
    </div>
  </div>
</template>


<script setup lang="ts">
  import _ from "lodash";
  import type { ToastData } from "@/assets/js/types";
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
  const actionCode = query.oobCode?.toString() as string;
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
          duration: 2000,
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
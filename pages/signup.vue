<template>
    <div class="signup">
        <div class="flex items-center justify-center h-screen">
            <div class="card shadow max-w-sm m-4">
                <div class="card-body">
                    
                    <div class="text-4xl font-bold mb-4">Signup</div>
                    <div class="mb-4">Already have an account? <NuxtLink to="/login" class="text-primary font-bold" replace>Login here</NuxtLink>, and stay ahead!</div>

                    <form @submit.prevent="createAccount">
                    <div class="form-control">
                        <div class="input-group border rounded-lg">
                            <span class="bg-transparent">📧</span>
                            <input v-model="signup_email" type="email" placeholder="Enter your e-mail" class="w-full input"> 
                        </div>  
                        <InputLabel labelName="signup_email"></InputLabel>
                    </div> 
                    
                    <div class="form-control">
                        <div class="input-group border rounded-lg">
                            <span class="bg-transparent">🔒</span>
                            <input v-model="signup_password" type="password" placeholder="Choose a password" class="w-full input" autocomplete="false"> 
                        </div>  
                        <InputLabel labelName="signup_password"/>
                    </div> 
                    <div class="form-control">
                        <div class="input-group border rounded-lg">
                            <span class="bg-transparent">🔒</span>
                            <input v-model="signup_confirm_password" type="password" placeholder="Confirm your password" class="w-full input" autocomplete="false"> 
                        </div>  
                        <InputLabel labelName="signup_confirm_password"/>
                    </div> 
                    <!-- <div class="form-control">
                        <div class="label">
                            <input type="checkbox" checked="checked" class="checkbox checkbox-primary">
                            <span class="label-text m-4">I agree to <NuxtLink to="/terms" class="text-primary">Terms of use</NuxtLink> & <NuxtLink to="/privacy" class="text-primary">Privacy Policy</NuxtLink></span> 
                        </div>   
                    </div> -->

                    <button type="submit" :class="loading.signup ? 
                    'btn btn-block glass bg-primary hover:bg-primary loading': 
                    'btn btn-block glass bg-primary hover:bg-primary'">
                        CREATE ACCOUNT
                    </button>
                    </form>
                </div>
            </div> 
        </div>
    </div>
</template>

<script setup lang="ts">
    import _ from 'lodash'
    import { changedKeys } from '@/assets/js/functions'
    import { AlertData, ToastData, SignupData } from '@/assets/js/types'
    import { linkWithCredential, EmailAuthProvider, sendEmailVerification, Auth } from 'firebase/auth'

    let loading: { signup: boolean } = reactive({signup: false})
    let fieldAlert = getFieldAlerts()
    clearFieldAlerts()

    const auth = useState<Auth>('auth').value
    const user = getUserData()

    const signup_email = ref('')
    const signup_password = ref('')
    const signup_confirm_password = ref('')

    //Create an object with computed values of the fields
    const fieldProps = computed(() => {
        return {
            signup_email: signup_email.value,
            signup_password: signup_password.value,
            signup_confirm_password: signup_confirm_password.value,
        }
    })

    watch(
    () => _.cloneDeep(fieldProps.value),
    (newval, preval) => {
        //Find and delete any alerts that are no longer relevant
        const changedKey = changedKeys(newval, preval)
        for(let i=0; i< changedKey.length; i++){
            const isOnIndex = (_.findIndex(fieldAlert.value, {fieldid: changedKey[i]}))
            if(isOnIndex > -1) fieldAlert.value.splice(isOnIndex, 1)
        }
        //Match password again on input change
        if(changedKey.includes('signup_confirm_password')){
            const signupForm = new SignupForm(newval)
            signupForm.passwordMatcher()
        } 
    })


    class SignupForm{
        signup_email: string
        signup_password: string
        signup_confirm_password: string

        constructor(props: SignupData){
            this.signup_email = props.signup_email
            this.signup_password = props.signup_password
            this.signup_confirm_password = props.signup_confirm_password
        }

        checkRequiredFields(){
            if(this.signup_password.length < 6){
                addFieldAlert({
                    message: 'Password must be at least 6 characters',
                    type: 'error',
                    source: 'ui',
                    fieldid: 'signup_password',
                } as AlertData)
            }
            if(this.signup_confirm_password.length < 6){
                addFieldAlert({
                    message: 'Password must be at least 6 characters',
                    fieldid: 'signup_confirm_password',
                    source: 'ui',
                    type: 'error'
                } as AlertData)
            }
            if(this.signup_email.length <= 0){
                addFieldAlert({
                    message: 'Email is required',
                    fieldid: 'signup_email',
                    source: 'ui',
                    type: 'error'
                } as AlertData)
            }
        }

        passwordMatcher() {
            if((this.signup_password.length >= 6) && 
            (this.signup_password === this.signup_confirm_password)) {
                addFieldAlert({
                    message: "Password matched",
                    fieldid: "signup_confirm_password",
                    source: 'ui',
                    type: 'success'
                } as AlertData)
            }else if((this.signup_password.length >= 6) && 
            (this.signup_password !== this.signup_confirm_password)){
                addFieldAlert({
                    message: "Passwords do not match",
                    fieldid: "signup_confirm_password",
                    source: 'ui',
                    type: 'error'
                } as AlertData)
            }
        }

        checkFormValid(){
            this.checkRequiredFields()
            this.passwordMatcher()
            return (_.findIndex(fieldAlert.value, {
                source: 'ui', 
                type: 'error'
            }) > -1) ? false : true
        }
    }


    const createAccount = () => {

        //Stop processing if user is blank
        if(!user.value){
            addToast({
                message: 'Unknown error, Please try again (101)',
                type: 'error',
                duration: 2000,
            } as ToastData)
            return
        }

        //Stop processing if any UI error
        const signupForm = new SignupForm(fieldProps.value)
        if(!signupForm.checkFormValid()) return

        loading.signup = true

        const credential = EmailAuthProvider.credential(signup_email.value, signup_password.value);

        linkWithCredential(user.value, credential)
        .then(async (userCredential) => {
            try{
                //Send verification email
                await sendEmailVerification(userCredential.user)
                addToast({
                    message: 'Account created successfully. Please verify your email 📧 & login to continue.',
                    type: 'success'
                } as ToastData)
            }
            catch(error){
                addToast({
                    message: 'Error sending verification email. Try login.',
                    type: 'error'
                } as ToastData)
            }

            loading.signup = false
            //signout as soon as account created
            //await signOut(auth)
            //router.replace({name: 'login',})
            
        })
        .catch(err=>{
            loading.signup = false
            switch(err.code) {
                case "auth/invalid-email":
                    addFieldAlert({
                        message: "Please provide a valid email",
                        fieldid: "signup_email",
                        source: 'server',
                        type: 'error'
                    } as AlertData)
                    break
                case "auth/email-already-in-use":
                    addFieldAlert({
                        message: "This account is already in use. Please Login",
                        fieldid: "signup_email",
                        source: 'server',
                        type: 'error'
                    } as AlertData)
                    break
                default:
                    addToast({
                        message: err,
                        type: 'error',
                        duration: 2000,
                    } as ToastData)
                    break
            }
        })

    }

</script>

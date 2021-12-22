<template>
  <div>
    <NuxtPage />
    <Toast /> 
  </div>
</template>

<script setup lang="ts">
    import { onAuthStateChanged, signInAnonymously, Auth } from 'firebase/auth';
    //import { currentFirebaseUser } from '@/composables/users';

    //const auth = useState('auth').value

    // onMounted(()=>{ 
    //   onAuthStateChanged(auth as Auth, (user) => {
    //       if (user) {
    //         // useState('firebaseUser', () => user)
    //         // useState('isAuthenticated', () => user !== null)
    //         currentFirebaseUser().value = user
    //       } else {
    //         anonymousSignIn()
    //       }
    //   });
    // })


</script>


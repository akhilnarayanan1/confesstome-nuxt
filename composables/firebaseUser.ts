import { onAuthStateChanged, signInAnonymously, Auth } from 'firebase/auth'
import { User } from 'firebase/auth'

const firebaseUser = () => useState<User>('firebaseUser')
const isUserLoading = () => useState<boolean>('isUserLoading', () => true)
const isAuthenticated = () => useState<boolean>('isAuthenticated', () => false)

export const getUserData = () => {    
    const auth = useState('auth').value
    onBeforeMount(() => {
        isUserLoading().value = true
    })
    onMounted(() => {
        onAuthStateChanged(auth as Auth, (currentUser) => {
            if (currentUser) {
                firebaseUser().value = currentUser
                //isAuthenticated().value = true
                isUserLoading().value = false
            }else {
                isUserLoading().value = false
                anonymousSignIn(auth as Auth)
            }
        })
    })
    return firebaseUser()
}

export const getIsUserLoading = () => isUserLoading()
export const getIsAuthenticated = () => isAuthenticated()
export const setIsAuthenticated = (authenticated: boolean) => isAuthenticated().value = authenticated


const anonymousSignIn = (auth: Auth) => {
    signInAnonymously(auth as Auth)
    .then(() => {})
    .catch((error) => {});
}

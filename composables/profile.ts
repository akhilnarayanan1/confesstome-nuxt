import type { FirestoreUserProfile } from "@/assets/js/types";

export const profile = () => useState<FirestoreUserProfile>(
    "profile", () => ({
        createdOn: "",
        name: "",
        username: ""
    })
);

export const getProfile = () => computed(()=>profile()).value;

export const setProfile = (data: FirestoreUserProfile) => {
    profile().value.createdOn = data.createdOn;
    profile().value.name = data.name;
    profile().value.username = data.username;
};
import type { FirestoreUserProfile } from "@/assets/js/types";

export const profile = () => useState<FirestoreUserProfile>(
    "profile", () => ({
        id: "",
        createdOn: "",
        name: "",
        username: ""
    })
);

export const getProfile = () => computed(()=>profile()).value;

export const setProfile = (data: FirestoreUserProfile) => {
    profile().value.id = data.id;
    profile().value.createdOn = data.createdOn;
    profile().value.name = data.name;
    profile().value.username = data.username;
};
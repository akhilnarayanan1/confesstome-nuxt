import { type ToastData } from "@/assets/js/types";
import _ from "lodash";

export const toasts = () => useState<ToastData[]>("toasts", () => []);

export const addToast = (toast: ToastData) => {
    toast.id = toasts().value.length;
    toast.duration ? setTimeout(() => {
        const isOnIndex = (_.findIndex(toasts().value, {id: toast.id}));
        toasts().value.splice(isOnIndex, 1);
    }, toast.duration) : null;
    toasts().value.push(toast);
    if (_.findIndex(toasts().value, 'duration') < 0) {
        toasts().value = toasts().value.slice(-1);
    };
};

export const getToasts = () => computed(()=>toasts()).value;

export const clearToasts = () => toasts().value.length = 0;
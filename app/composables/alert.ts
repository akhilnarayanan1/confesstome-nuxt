import _ from "lodash";
import { changedKeys } from "@/assets/js/functions";
import { getFieldAlerts } from "@/composables/fieldAlerts";

export const watchAlert = (params: {[key: string]: string}) => {
    const fieldAlert = getFieldAlerts();
    watch(
        () => ({...params}),
        (newval, preval) => {
        //Find and delete any alerts that are no longer relevant
        const changedKey = changedKeys(newval, preval);
        for (let i=0; i< changedKey.length; i++) {
            const isOnIndex = (_.findIndex(fieldAlert.value, {fieldid: changedKey[i]}));
            if(isOnIndex > -1) fieldAlert.value.splice(isOnIndex, 1);
        };
        }, {deep: true}
    );
};


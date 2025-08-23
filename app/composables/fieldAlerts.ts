import { type AlertData } from "@/assets/js/types";
import _ from "lodash";

export const fieldAlerts = () => useState<AlertData[]>("fieldAlerts", () => []);

export const addFieldAlert = (fieldAlert: AlertData) => {
    const foundIndex = _.findIndex(fieldAlerts().value, {"fieldid": fieldAlert.fieldid});
    if (foundIndex < 0) {
        fieldAlerts().value.push(fieldAlert);
    } else {
        fieldAlerts().value[foundIndex] = fieldAlert;
    };
}

export const getFieldAlerts = () => computed(()=>fieldAlerts()).value;

export const clearFieldAlerts = () => fieldAlerts().value.length = 0;
import _ from "lodash";
import { type RandomKeyValue } from "@/assets/js/types";

const changedKeys = (o1: RandomKeyValue, o2: RandomKeyValue) => _.keys(_.pickBy(o1, (v: string, k: string) => v !== o2[k]));

const maskMail = (email: string) => {
  let maskid = email.replace(/^(.)(.*)(.@.*)$/,
      (_, a, b, c) => a + b.replace(/./g, '*') + c
  );
  return maskid;
};

export {
  changedKeys,
  maskMail,
}
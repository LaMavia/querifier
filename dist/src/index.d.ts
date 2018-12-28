import { UpdateQuery } from "./distionaries/update.dict";
import { natifyCondition as _nc, natifyUpdate as _nu } from "./helpers/nativfy";
import { get } from "./get";
export interface ObjectLit {
    [key: string]: any | any[];
}
export declare const exception: (message?: string | undefined, ...optionalParams: any[]) => void;
export declare const natifyCondition: typeof _nc;
export declare const natifyUpdate: typeof _nu;
export declare const throwError: () => never;
declare const _default: {
    update: <T extends ObjectLit>(object: T, query: UpdateQuery) => T;
    get: typeof get;
    natifyUpdate: typeof _nu;
    natifyCondition: typeof _nc;
};
export default _default;

import { UpdateQuery } from './distionaries/update.dict';
export interface ObjectLit {
    [key: string]: any;
}
export declare const exception: (message?: string | undefined, ...optionalParams: any[]) => void;
export declare const throwError: () => never;
export declare const update: <T extends ObjectLit>(object: T, query: UpdateQuery) => T;
declare const _default: {
    update: <T extends ObjectLit>(object: T, query: UpdateQuery) => T;
};
export default _default;

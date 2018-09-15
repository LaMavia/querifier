export interface Arrayable {
    [key: string]: ArrayQuery | string | symbol | number;
}
export interface ArrayQuery {
    $each: any[];
}
export declare const arrayDictionary: {
    $each: <T>(target: T[]) => (items?: T[]) => T[];
};

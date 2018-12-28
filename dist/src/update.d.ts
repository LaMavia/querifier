import { UpdateQuery } from "./distionaries/update.dict";
import { ObjectLit } from ".";
/**
 * Not-mutating update function. Returns updated object
 * @param object
 * @param query
 */
export declare const update: <T extends ObjectLit>(object: T, query: UpdateQuery) => T;

export declare type KeyValueOption = {
    value: string;
    label: string;
};
export declare type KeyValueOptions = KeyValueOption[] | Record<string, string> | string[];
export declare function isKeyValueOption(value: any): value is KeyValueOption;

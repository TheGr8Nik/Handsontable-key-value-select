export type KeyValueOption = {
  value: string,
  label: string,
}

export type KeyValueOptions = KeyValueOption[] | Record<string, string> | string[];

export function isKeyValueOption(value: any): value is KeyValueOption {
  return typeof value === 'object'
}

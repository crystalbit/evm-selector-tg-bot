type HexString = string;

type EventOrFunctionDetail = {
  name: string;
  filtered: boolean;
};

type EventOrFunctionMap = {
  [key: HexString]: EventOrFunctionDetail[] | null;
};

type Result = {
  event: EventOrFunctionMap;
  function: EventOrFunctionMap;
};

export type OpenChainApiResponse = {
  ok: boolean;
  result: Result;
};

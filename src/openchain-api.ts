import axios from "axios";
import { OpenChainApiResponse } from "./types/openchain-types";

const LOOKUP_ENDPOINT = 'https://api.openchain.xyz/signature-database/v1/lookup';


export const openChainQuery = async (selectors: string[], events: string[]): Promise<string> => {
  const response = await axios.get <OpenChainApiResponse>(LOOKUP_ENDPOINT, {
    params: {
      function: selectors.join(','),
      event: events.join(','),
      filter: true,
    },
  });
  const data = response.data;
  const hashData: string[] = [];
  if (data.ok) {
    const result = data.result;
    const { function: functions, event } = result;
    // console.log('functions: ', functions);
    for (const key of Object.keys(functions)) {
      const item = functions[key];
      if (item !== null) {
        for (const { name } of item) {
          hashData.push(`${key} – <code>${name}</code>`);
        }
      }
    }
    // console.log('events: ', event);
    for (const key of Object.keys(event)) {
      const item = event[key];
      if (item !== null) {
        for (const { name } of item) {
          hashData.push(`${key} – <code>${name}</code>`);
        }
      }
    }
  }
  return hashData.join('\n');
};

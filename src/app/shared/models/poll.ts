import { PollOptions } from "./poll-options";

export interface Poll {
  options?: null | Array<PollOptions>;
  topic: string;
}
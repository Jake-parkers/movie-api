import { InAppResponse } from "../../helpers/response";

export interface MovieDetails {
  save(title: string): Promise<InAppResponse>;
}

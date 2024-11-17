import { IncomingHttpHeaders } from "http";

export type ContextType = {
   headers: IncomingHttpHeaders;
   user?: ContextUser;
};

export type ContextUser = {
   id: string;
   email: string;
   role: string;
};

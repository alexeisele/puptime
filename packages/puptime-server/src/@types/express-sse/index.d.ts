declare module "express-sse" {
  import { Request, Response } from "express";

  class SSE {
    constructor(initial?: string[], options?: object);
    init(req: Request, res: Response): void;
    send(content: any): void;
  }
  export = SSE;
}

// Augments Express's Request type so `req.user` is typed everywhere,
// without needing to cast or redeclare it in every controller.
// This file has no imports/exports of runtime code — `export {}` at the
// bottom is what makes TypeScript treat it as a module augmentation
// instead of a global script.

import { IUser } from '../models/User.model';

declare global {
  namespace Express {
    interface Request {
      user?: IUser;
    }
  }
}

export {};

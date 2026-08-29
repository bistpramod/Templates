import { NextFunction, Request, Response } from 'express';
import { ZodObject, ZodRawShape } from 'zod';

// Wrap a Zod schema shaped like { body, params, query } and drop this in
// before the controller, e.g.:
//   router.post('/', validate(createEntitySchema), controller.create)
export function validate(schema: ZodObject<ZodRawShape>) {
  return (req: Request, res: Response, next: NextFunction) => {
    const result = schema.safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
    });

    if (!result.success) {
      const errors = result.error.issues.map((issue) => ({
        path: issue.path.join('.'),
        message: issue.message,
      }));
      res.status(400);
      return res.json({ message: 'Validation failed', errors });
    }

    next();
  };
}

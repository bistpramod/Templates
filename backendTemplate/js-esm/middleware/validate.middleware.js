import { validationResult } from 'express-validator';

// Drop this in after an array of express-validator checks, e.g.:
//   router.post('/', [body('name').notEmpty()], runValidation, controller.create)
export default function runValidation(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    res.status(400);
    return res.json({ message: 'Validation failed', errors: errors.array() });
  }
  next();
}

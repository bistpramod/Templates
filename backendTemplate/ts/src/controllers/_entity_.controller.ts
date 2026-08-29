import { Request, Response } from 'express';
import asyncHandler from '../utils/asyncHandler';
import ApiFeatures from '../utils/apiFeatures';
import _Entity_, { I_Entity_ } from '../models/_Entity_.model';

// GET /api/_entities_
// Supports ?search=&<filter fields>&minPrice=&maxPrice=&sort=&page=&limit=
export const getAll = asyncHandler(async (req: Request, res: Response) => {
  // PLACEHOLDER: list the fields searchable/filterable for this resource.
  const features = new ApiFeatures<I_Entity_>(_Entity_.find(), req.query as any)
    .search(['name', 'description'])
    .filter(['status'])
    .sort()
    .paginate();

  const [items, total] = await Promise.all([features.query, _Entity_.countDocuments()]);

  res.json({ items, total, page: Number(req.query.page) || 1 });
});

// GET /api/_entities_/:idOrSlug
export const getOne = asyncHandler(async (req: Request, res: Response) => {
  const { idOrSlug } = req.params;
  const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/) ? { _id: idOrSlug } : { slug: idOrSlug };

  const item = await _Entity_.findOne(query);
  if (!item) {
    res.status(404);
    throw new Error('_Entity_ not found');
  }
  res.json(item);
});

// POST /api/_entities_  (protected, admin-only)
export const create = asyncHandler(async (req: Request, res: Response) => {
  const item = await _Entity_.create({ ...req.body, owner: req.user?._id });
  res.status(201).json(item);
});

// PUT /api/_entities_/:id  (protected, admin-only)
export const update = asyncHandler(async (req: Request, res: Response) => {
  const item = await _Entity_.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });
  if (!item) {
    res.status(404);
    throw new Error('_Entity_ not found');
  }
  res.json(item);
});

// DELETE /api/_entities_/:id  (protected, admin-only)
export const remove = asyncHandler(async (req: Request, res: Response) => {
  const item = await _Entity_.findByIdAndDelete(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('_Entity_ not found');
  }
  res.json({ message: '_Entity_ deleted' });
});

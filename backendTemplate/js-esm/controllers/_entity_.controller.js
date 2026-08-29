import asyncHandler from '../utils/asyncHandler.js';
import ApiFeatures from '../utils/apiFeatures.js';
import _Entity_ from '../models/_Entity_.model.js';

// GET /api/_entities_
// Supports ?search=&<filter fields>&minPrice=&maxPrice=&sort=&page=&limit=
export const getAll = asyncHandler(async (req, res) => {
  // PLACEHOLDER: list the fields searchable/filterable for this resource.
  const features = new ApiFeatures(_Entity_.find(), req.query)
    .search(['name', 'description'])
    .filter(['status']) // e.g. ['category', 'brand'] for a product-like resource
    .sort()
    .paginate();

  const [items, total] = await Promise.all([
    features.query,
    _Entity_.countDocuments(), // NOTE: for exact filtered totals, mirror the same filter here
  ]);

  res.json({ items, total, page: Number(req.query.page) || 1 });
});

// GET /api/_entities_/:idOrSlug
export const getOne = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const query = idOrSlug.match(/^[0-9a-fA-F]{24}$/)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };

  const item = await _Entity_.findOne(query);
  if (!item) {
    res.status(404);
    throw new Error('_Entity_ not found');
  }
  res.json(item);
});

// POST /api/_entities_  (protected, admin-only)
export const create = asyncHandler(async (req, res) => {
  const item = await _Entity_.create({ ...req.body, owner: req.user?._id });
  res.status(201).json(item);
});

// PUT /api/_entities_/:id  (protected, admin-only)
export const update = asyncHandler(async (req, res) => {
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
export const remove = asyncHandler(async (req, res) => {
  const item = await _Entity_.findByIdAndDelete(req.params.id);
  if (!item) {
    res.status(404);
    throw new Error('_Entity_ not found');
  }
  res.json({ message: '_Entity_ deleted' });
});

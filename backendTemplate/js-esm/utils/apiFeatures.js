// Generic query-building helper. Works on ANY Mongoose model — nothing in
// here references a specific resource, so it doesn't need renaming when you
// rename _Entity_ to your real model.
//
// Usage in a controller:
//   const features = new ApiFeatures(Product.find(), req.query)
//     .search(['name', 'description'])
//     .filter(['category', 'brand'])
//     .sort()
//     .paginate();
//   const results = await features.query;

export default class ApiFeatures {
  constructor(query, queryString) {
    this.query = query;
    this.queryString = queryString;
  }

  // Full-text-ish search across the given fields using ?search=
  search(fields = []) {
    if (this.queryString.search && fields.length) {
      const regex = { $regex: this.queryString.search, $options: 'i' };
      this.query = this.query.find({
        $or: fields.map((field) => ({ [field]: regex })),
      });
    }
    return this;
  }

  // Exact-match filtering on whitelisted fields, e.g. ?category=<id>&brand=<id>
  // Also supports ?minPrice= / ?maxPrice= style range filters if present.
  filter(allowedFields = []) {
    const filters = {};
    allowedFields.forEach((field) => {
      if (this.queryString[field] !== undefined) {
        filters[field] = this.queryString[field];
      }
    });

    if (this.queryString.minPrice || this.queryString.maxPrice) {
      filters.price = {};
      if (this.queryString.minPrice) filters.price.$gte = Number(this.queryString.minPrice);
      if (this.queryString.maxPrice) filters.price.$lte = Number(this.queryString.maxPrice);
    }

    this.query = this.query.find(filters);
    return this;
  }

  // ?sort=price_asc | price_desc | newest | oldest
  sort() {
    const map = {
      price_asc: 'price',
      price_desc: '-price',
      newest: '-createdAt',
      oldest: 'createdAt',
    };
    const sortBy = map[this.queryString.sort] || '-createdAt';
    this.query = this.query.sort(sortBy);
    return this;
  }

  // ?page=1&limit=20
  paginate() {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 20;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

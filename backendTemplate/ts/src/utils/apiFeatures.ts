import { Query } from 'mongoose';

// Generic query-building helper. Works on ANY Mongoose model/document type —
// nothing in here references a specific resource, so it doesn't need
// renaming when you rename _Entity_ to your real model.
//
// Usage in a controller:
//   const features = new ApiFeatures(_Entity_.find(), req.query)
//     .search(['name', 'description'])
//     .filter(['status'])
//     .sort()
//     .paginate();
//   const results = await features.query;

interface QueryString {
  search?: string;
  sort?: string;
  page?: string;
  limit?: string;
  minPrice?: string;
  maxPrice?: string;
  [key: string]: string | undefined;
}

export default class ApiFeatures<T> {
  query: Query<T[], T>;
  queryString: QueryString;

  constructor(query: Query<T[], T>, queryString: QueryString) {
    this.query = query;
    this.queryString = queryString;
  }

  search(fields: string[] = []): this {
    if (this.queryString.search && fields.length) {
      const regex = { $regex: this.queryString.search, $options: 'i' };
      this.query = this.query.find({
        $or: fields.map((field) => ({ [field]: regex })),
      });
    }
    return this;
  }

  filter(allowedFields: string[] = []): this {
    const filters: Record<string, any> = {};
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

  sort(): this {
    const map: Record<string, string> = {
      price_asc: 'price',
      price_desc: '-price',
      newest: '-createdAt',
      oldest: 'createdAt',
    };
    const sortBy = (this.queryString.sort && map[this.queryString.sort]) || '-createdAt';
    this.query = this.query.sort(sortBy);
    return this;
  }

  paginate(): this {
    const page = Number(this.queryString.page) || 1;
    const limit = Number(this.queryString.limit) || 20;
    const skip = (page - 1) * limit;
    this.query = this.query.skip(skip).limit(limit);
    return this;
  }
}

# MERN Backend Starter Kit — JavaScript (ES Modules)

Same architecture as the TypeScript version in this pack, written in plain
JavaScript using `import`/`export` (ES Modules) instead of `require`/
`module.exports`. This works because `package.json` has `"type": "module"`,
which tells Node to treat every `.js` file as an ES module.

**The one rule ES Modules adds that CommonJS didn't have:** local imports
need their file extension, e.g. `import User from '../models/User.model.js'`
— not `'../models/User.model'`. Every file in this kit already does this
correctly; keep doing it as you add files.

See `../LOCAL-MONGODB-SETUP.md` for connecting this to MongoDB Compass.

---

## Placeholder Legend

Same as the TS version — search-and-replace these tokens (all three cases):

| Token | Meaning | Example replacement |
|---|---|---|
| `_Entity_` | PascalCase model/resource name | `Product`, `Post`, `Task` |
| `_entity_` | camelCase singular | `product`, `post`, `task` |
| `_entities_` | lowercase plural (route paths) | `products`, `posts`, `tasks` |
| `_ROLE_ADMIN_` | the "elevated" role string | `'admin'`, `'owner'` |
| `_ROLE_USER_` | the "regular" role string (delete if unneeded) | `'user'`, `'member'` |
| `_field_` | a generic schema field | `title`, `price`, `status` |

```bash
grep -rl '_Entity_' . | xargs sed -i 's/_Entity_/Product/g'   # Linux
grep -rl '_Entity_' . | xargs sed -i '' 's/_Entity_/Product/g' # macOS
```
Then rename the files: `models/_Entity_.model.js` → `models/Product.model.js`, etc.

## What's real vs. what's a placeholder

Same breakdown as the TS README — JWT auth, hashing, error handling,
`apiFeatures.js`, and the generic CRUD pattern are all working code; the
model fields, role strings, and `.env` values are yours to fill in.

## Quick Start

1. Copy this folder into your new project as `server/`.
2. `npm install`
3. Copy `.env.example` → `.env`. Make sure MongoDB is running locally and
   `MONGO_URI` points at it (see `../LOCAL-MONGODB-SETUP.md` if you haven't
   set that up yet).
4. Do the placeholder rename for your first real resource.
5. `npm run seed:admin` once.
6. `npm run dev`

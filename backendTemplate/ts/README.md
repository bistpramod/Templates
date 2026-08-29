# MERN Backend Starter Kit — TypeScript

Same architecture as the JavaScript (ES Modules) version in this pack,
written in TypeScript and shaped to match your own `Project_Backend`
conventions: `app.ts`/`server.ts` split, a centralized `env.config.ts`,
a typed `req.user` via `types/express.d.ts`, and a `Role` enum instead of
raw role strings.

See `../LOCAL-MONGODB-SETUP.md` for connecting this to MongoDB Compass.

---

## Placeholder Legend

| Token | Meaning | Example replacement |
|---|---|---|
| `_Entity_` | PascalCase model/resource name | `Product`, `Post`, `Task` |
| `_entity_` | camelCase singular | `product`, `post`, `task` |
| `_entities_` | lowercase plural (route paths) | `products`, `posts`, `tasks` |
| `_ROLE_ADMIN_` / `_ROLE_USER_` | values inside the `Role` enum (`src/types/enum.types.ts`) | `'ADMIN'`, `'USER'` |
| `_field_` | a generic schema field | `title`, `price`, `status` |

```bash
grep -rl '_Entity_' . | xargs sed -i 's/_Entity_/Product/g'   # Linux
grep -rl '_Entity_' . | xargs sed -i '' 's/_Entity_/Product/g' # macOS
```
Then rename the files: `src/models/_Entity_.model.ts` → `src/models/Product.model.ts`, etc.

**Roles work differently here than in the JS version:** instead of renaming
a string in three places, you only edit `src/types/enum.types.ts` once —
`Role.ADMIN` / `Role.USER` are used everywhere else, and TypeScript will
flag any place that still expects the old value.

## What's real vs. what's a placeholder

**Real and working:**
- JWT auth (`middleware/auth.middleware.ts`, `utils/jwt.utils.ts`)
- Password hashing (`models/User.model.ts`)
- Centralized error handling (`middleware/error.middleware.ts`)
- Generic search/filter/sort/paginate (`utils/apiFeatures.ts`) — typed, works on any model
- Generic CRUD pattern (`controllers/_entity_.controller.ts` / `routes/_entity_.routes.ts`)
- Zod-based request validation scaffold (`middleware/validate.middleware.ts`)
- One-time admin seed script (`src/seed/createAdmin.ts`)
- `req.user` is fully typed everywhere via `src/types/express.d.ts` — no `as any` casts needed

**You must edit per project:**
- `_Entity_.model.ts` — real schema + the `I_Entity_` interface fields
- `Role` enum values
- `.env`
- Whether you keep `upload.middleware.ts` / Cloudinary at all

## Quick Start

1. Copy this folder into your new project as `server/`.
2. `npm install`
3. Copy `.env.example` → `.env`. Make sure MongoDB is running locally and
   `DB_URI` points at it (see `../LOCAL-MONGODB-SETUP.md`).
4. Do the placeholder rename for your first real resource.
5. `npm run seed:admin` once.
6. `npm run dev` (uses `ts-node-dev`, so it restarts on save — no manual
   `tsc` build needed during development).
7. `npm run build && npm start` for a production build.

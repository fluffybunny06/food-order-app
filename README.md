# Foodies — Next.js Food Sharing App 🍽️

**Short description:**
Foodies is a small demo application built with Next.js (App Router) for sharing meals/recipes. It demonstrates server actions, image uploads to S3, and persistence with PostgreSQL via Prisma.

---

## 🚀 Quick Start

**Prerequisites**

- Node.js (v18+ recommended)
- Docker Desktop
- npm or yarn
- (Optional) AWS credentials if you plan to upload images to S3

**Install & run**

```bash
# install dependencies
npm install

# start local PostgreSQL
docker compose up -d postgres

# create/update database tables
npm run prisma:migrate

# seed demo meals
npm run db:seed

# start dev server
npm run dev

# build for production
npm run build
npm start
```

Open http://localhost:3000 after starting the server.

---

## 🔧 Environment variables

A `.env.example` has been added to the repo. Copy it to `.env.local` (do NOT commit `.env.local`) and fill in your values.

Example entries (in `.env.local`):

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/food_order_app?schema=public"
AWS_ACCESS_KEY_ID=your_access_key_id
AWS_SECRET_ACCESS_KEY=your_secret_access_key
AWS_REGION=us-east-1
S3_BUCKET=your-s3-bucket-name
S3_PUBLIC_BASE_URL=https://your-s3-bucket-name.s3.amazonaws.com
```

Notes:

- `DATABASE_URL` points Prisma to PostgreSQL. The Docker Compose service uses the example URL above.
- `S3_BUCKET` and `AWS_REGION` are read by the app (defaults are provided: `us-east-1` and the original demo bucket name). Replace with your values to use your S3 bucket.
- `S3_PUBLIC_BASE_URL` is used by the UI to render stored meal image keys.
- AWS credentials can alternatively be provided via the standard AWS shared credentials file or environment configuration.

---

## 🧭 Project Structure (high level)

- `app/` — Next.js app routes and pages (uses App Router)
- `components/` — UI components (image-picker, headers, meal cards)
- `lib/meals.ts` — Prisma + S3 logic (get/save meals)
- `lib/actions.ts` — server actions (shareMeal)
- `prisma/schema.prisma` — PostgreSQL data model
- `prisma/seed.js` — seeds demo meal data

---

## 🧪 Database

- Uses PostgreSQL with Prisma.
- Start local DB: `docker compose up -d postgres`.
- Apply migrations: `npm run prisma:migrate`.
- Seed DB: `npm run db:seed`.

---

## 🛠️ How it works (brief)

- The client `Share meal` form submits to a server action `shareMeal`.
- `saveMeal` slugifies & sanitizes fields, uploads the image to S3 (`S3_BUCKET`), and inserts the record with Prisma.
- After saving, the app revalidates the meals listing and redirects to `/meals`.

---

## 🔎 Troubleshooting

- Upload errors: confirm `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, and `S3_BUCKET` are correct and the bucket allows PutObject from your credentials.
- Database issues: confirm Docker is running, `DATABASE_URL` matches the Compose service, then run `npm run prisma:migrate` and `npm run db:seed`.

---

## 🤝 Contributing

- Fork → feature branch → pull request
- Add tests or manual testing steps for new features

---

## 📄 License

Add a license file as appropriate (e.g., `MIT`).

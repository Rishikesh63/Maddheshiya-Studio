# AWS S3 + CloudFront Environment Variables

Use these variables when running Maddheshiya Studio with S3-backed media uploads.

## Backend

Set these in `backend/.env` locally and in your backend host, such as Render.

```env
AWS_STORAGE_BUCKET_NAME=maddheshiya-studio-media
AWS_S3_REGION_NAME=ap-south-1
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_S3_CUSTOM_DOMAIN=your-cloudfront-domain.cloudfront.net
```

`AWS_S3_CUSTOM_DOMAIN` is optional, but recommended after CloudFront is ready.
Do not include `https://` in `AWS_S3_CUSTOM_DOMAIN`.

Uploaded Django files are stored under the `media/` prefix in S3.

## Frontend

Set these in `frontend/.env.local` locally and in Vercel.

```env
NEXT_PUBLIC_AWS_S3_BUCKET=maddheshiya-studio-media
NEXT_PUBLIC_AWS_CLOUDFRONT_URL=https://your-cloudfront-domain.cloudfront.net
NEXT_PUBLIC_AWS_REGION=ap-south-1
```

Use the same bucket, region, and CloudFront distribution as the backend.

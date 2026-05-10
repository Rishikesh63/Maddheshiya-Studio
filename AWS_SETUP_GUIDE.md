# AWS S3 + CloudFront Setup Guide

This guide will help you migrate from Cloudinary to AWS S3 + CloudFront for media storage and delivery.

## Why AWS S3 + CloudFront?

- **Cost-effective at scale** (~$0.023/GB storage + ~$0.085/GB transfer)
- **Full control** over your infrastructure
- **High reliability** (99.999999999% durability)
- **No vendor lock-in**
- **CloudFront CDN** for global fast delivery

---

## Step 1: Create an S3 Bucket

1. **Login to AWS Console**: https://console.aws.amazon.com
2. **Navigate to S3**: Search for "S3" in services
3. **Create Bucket**:
   - Click "Create bucket"
   - **Bucket name**: `maddheshiya-studio-media` (must be globally unique)
   - **Region**: Choose closest to your users (e.g., `us-east-1`)
   - **Block Public Access**: UNCHECK "Block all public access" ⚠️
   - Check the acknowledgment box
   - Click "Create bucket"

4. **Configure Bucket Policy** (Make files publicly readable):
   - Select your bucket → **Permissions** tab
   - Scroll to **Bucket Policy** → Click "Edit"
   - Paste this policy (replace `YOUR-BUCKET-NAME`):

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::YOUR-BUCKET-NAME/*"
    }
  ]
}
```

5. **Enable CORS** (for web access):
   - **Permissions** tab → **CORS** section → Click "Edit"
   - Paste:

```json
[
  {
    "AllowedHeaders": ["*"],
    "AllowedMethods": ["GET", "HEAD"],
    "AllowedOrigins": ["*"],
    "ExposeHeaders": []
  }
]
```

---

## Step 2: Upload Your Media Files

### Option A: Using AWS Console (Simple)
1. Open your bucket
2. Click **Upload** → **Add files** or **Add folder**
3. Organize your files:
   ```
   photos/
     ├── wedding_ceremony.jpg
     ├── haldi_ceremony.jpg
     ├── ethnic_photography.jpg
     └── product_photography.jpg
   videos/
     ├── ring-ceremony.mp4
     ├── wedding-highlights.mp4
     ├── prewedding-shoot.mp4
     └── drone-footage.mp4
   ```
4. Click **Upload**

### Option B: Using AWS CLI (Advanced)
```bash
# Install AWS CLI
# Windows: Download from https://aws.amazon.com/cli/
# macOS: brew install awscli

# Configure credentials
aws configure

# Upload files
aws s3 cp ./local-photos s3://YOUR-BUCKET-NAME/photos/ --recursive
aws s3 cp ./local-videos s3://YOUR-BUCKET-NAME/videos/ --recursive
```

### Generate Video Thumbnails
For videos, you need thumbnail images. Create them with ffmpeg:

```bash
# Install ffmpeg: https://ffmpeg.org/download.html

# Generate thumbnail (first frame)
ffmpeg -i ring-ceremony.mp4 -ss 00:00:01 -vframes 1 ring-ceremony-thumb.jpg

# Upload thumbnails
aws s3 cp ring-ceremony-thumb.jpg s3://YOUR-BUCKET-NAME/videos/ring-ceremony-thumb.jpg
```

---

## Step 3: Create CloudFront Distribution

CloudFront is AWS's CDN that caches your content globally for faster delivery.

1. **Navigate to CloudFront**: AWS Console → Search "CloudFront"
2. **Create Distribution**:
   - Click "Create distribution"
   - **Origin domain**: Select your S3 bucket from dropdown
   - **Origin path**: Leave empty
   - **Name**: Auto-filled (keep it)
   - **Origin access**: Choose "Public"
   - **Viewer protocol policy**: "Redirect HTTP to HTTPS"
   - **Allowed HTTP methods**: "GET, HEAD"
   - **Cache policy**: "CachingOptimized"
   - **Price class**: "Use all edge locations" (or choose based on your region)
   - Click **Create distribution**

3. **Wait for deployment** (5-15 minutes)
   - Status will change from "Deploying" to "Enabled"

4. **Copy CloudFront URL**:
   - You'll see something like: `d1234567890abc.cloudfront.net`
   - Your full URL: `https://d1234567890abc.cloudfront.net`

---

## Step 4: Configure Your Next.js App

1. **Create `.env.local`** file in `frontend/` directory:

```bash
# Copy the example file
cp .env.local.example .env.local
```

2. **Update `.env.local`** with your values:

```env
NEXT_PUBLIC_AWS_S3_BUCKET=maddheshiya-studio-media
NEXT_PUBLIC_AWS_CLOUDFRONT_URL=https://d1234567890abc.cloudfront.net
NEXT_PUBLIC_AWS_REGION=us-east-1
```

3. **Restart your development server**:

```bash
npm run dev
```

---

## Step 5: Update Media References

The code has been updated to use S3. Now update the file paths in:

### `frontend/src/app/components/PhotoGallery.tsx`
Update the `s3Key` values with your actual S3 paths:

```typescript
const photoMedia: Photo[] = [
  {
    id: "wedding_ceremony",
    s3Key: "photos/your-actual-filename.jpg", // ← Update this
    title: "Candid Wedding Moment",
    // ...
  },
  // ... update all photos
];
```

### `frontend/src/app/components/VideoGallery.tsx`
Update the `s3Key` values:

```typescript
const videoMedia = [
  {
    s3Key: "videos/your-actual-video.mp4", // ← Update this
    title: "Ring Ceremony",
  },
  // ... update all videos
];
```

---

## Step 6: Test Everything

1. **Check configuration status**:
   - Open browser console
   - You should see S3 URLs in network requests

2. **Test images**:
   - Navigate to Photo Gallery
   - Images should load from CloudFront

3. **Test videos**:
   - Navigate to Video Gallery
   - Videos should play properly

---

## Step 7: Deploy to Production

### Update Render Environment Variables:

1. Go to your Render dashboard
2. Navigate to your Next.js service
3. **Environment** tab → Add variables:
   ```
   NEXT_PUBLIC_AWS_S3_BUCKET=maddheshiya-studio-media
   NEXT_PUBLIC_AWS_CLOUDFRONT_URL=https://d1234567890abc.cloudfront.net
   NEXT_PUBLIC_AWS_REGION=us-east-1
   ```
4. Click **Save changes**
5. Trigger a new deployment

---

## Cost Estimation

### Monthly costs for a photography studio:

**Scenario: 50GB storage + 100GB transfer/month**

- **S3 Storage**: 50GB × $0.023 = $1.15/month
- **CloudFront Transfer**: 100GB × $0.085 = $8.50/month
- **S3 Requests**: ~1,000,000 GET × $0.0004/1000 = $0.40/month
- **Total**: ~$10/month

**Compare to Cloudinary Free Tier**: 25GB bandwidth/month (would need paid plan)

**Savings at scale**: Massive! At 1TB transfer:
- AWS: ~$85/month
- Cloudinary: ~$224/month (Pro plan)

---

## Optimization Tips

### 1. **Image Optimization**
Compress images before uploading:
```bash
# Using ImageMagick
convert input.jpg -quality 85 -resize 1920x output.jpg
```

### 2. **Cache Headers**
Set long cache times for S3 objects:
```bash
aws s3 cp image.jpg s3://bucket/image.jpg \
  --cache-control "public, max-age=31536000"
```

### 3. **Video Compression**
Compress videos for web:
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -c:a aac -b:a 128k output.mp4
```

### 4. **Use WebP Format**
Better compression than JPEG:
```bash
convert image.jpg -quality 80 image.webp
```

---

## Troubleshooting

### Images not loading?
- Check S3 bucket policy (must allow public read)
- Check CORS configuration
- Verify CloudFront distribution is deployed
- Check environment variables in `.env.local`

### Videos not playing?
- Ensure thumbnails exist (`video-name-thumb.jpg`)
- Check video format (MP4 H.264 works best)
- Verify CORS is enabled

### CloudFront showing old content?
- CloudFront caches for 24 hours by default
- Invalidate cache: CloudFront → Distribution → Invalidations → Create
- Add path: `/*` (invalidates everything)

---

## Migration Checklist

- [ ] Create S3 bucket
- [ ] Configure bucket policy and CORS
- [ ] Upload all photos to S3
- [ ] Upload all videos to S3
- [ ] Generate video thumbnails
- [ ] Create CloudFront distribution
- [ ] Update `.env.local` with AWS credentials
- [ ] Update media file paths in components
- [ ] Test locally
- [ ] Deploy to production
- [ ] Update production environment variables
- [ ] Test production deployment
- [ ] Remove Cloudinary dependencies (optional)

---

## Next Steps After Setup

1. **Remove Cloudinary packages** (save costs):
   ```bash
   npm uninstall @cloudinary/url-gen next-cloudinary
   ```

2. **Set up automated uploads** (optional):
   - Use AWS SDK in your backend
   - Implement direct upload from admin panel

3. **Enable S3 versioning** (backup):
   - S3 → Bucket → Properties → Versioning → Enable

4. **Set up lifecycle policies** (archive old files):
   - Move old files to cheaper storage tiers

---

## Support

If you need help:
- AWS Documentation: https://docs.aws.amazon.com/s3/
- AWS Support: https://console.aws.amazon.com/support/
- Stack Overflow: Tag questions with `amazon-s3` and `cloudfront`

---

**You're all set!** 🎉 Your media is now served from AWS S3 + CloudFront with global CDN caching and cost-effective pricing.

/**
 * AWS S3 + CloudFront Media Utilities
 * 
 * This utility provides functions to generate optimized URLs for images and videos
 * stored in AWS S3 and served through CloudFront CDN.
 */

// Configuration from environment variables
const S3_BUCKET = process.env.NEXT_PUBLIC_AWS_S3_BUCKET || '';
const CLOUDFRONT_URL = process.env.NEXT_PUBLIC_AWS_CLOUDFRONT_URL || '';
const AWS_REGION = process.env.NEXT_PUBLIC_AWS_REGION || 'us-east-1';

/**
 * Generates an optimized image URL from S3/CloudFront
 * @param key - The S3 object key (path to the image)
 * @param options - Optional transformations
 */
export const getImageUrl = (
  key: string
): string => {
  // If CloudFront URL is configured, use it (recommended for production)
  if (CLOUDFRONT_URL) {
    return `${CLOUDFRONT_URL}/${key}`;
  }
  
  // Fallback to direct S3 URL
  if (S3_BUCKET && AWS_REGION) {
    return `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
  }
  
  // Fallback to key if no configuration
  console.warn('AWS S3 configuration missing. Please set environment variables.');
  return key;
};

/**
 * Generates a video URL from S3/CloudFront
 * @param key - The S3 object key (path to the video)
 */
export const getVideoUrl = (key: string): string => {
  if (CLOUDFRONT_URL) {
    return `${CLOUDFRONT_URL}/${key}`;
  }
  
  if (S3_BUCKET && AWS_REGION) {
    return `https://${S3_BUCKET}.s3.${AWS_REGION}.amazonaws.com/${key}`;
  }
  
  console.warn('AWS S3 configuration missing. Please set environment variables.');
  return key;
};

/**
 * Generates a video thumbnail URL
 * Assumes thumbnails are stored with .jpg extension
 * @param key - The S3 object key (path to the video)
 */
export const getVideoThumbnail = (key: string): string => {
  // Remove extension and add .jpg
  const thumbnailKey = key.replace(/\.[^/.]+$/, '') + '-thumb.jpg';
  return getImageUrl(thumbnailKey);
};

/**
 * Checks if AWS S3 is properly configured
 */
export const isS3Configured = (): boolean => {
  return !!(S3_BUCKET || CLOUDFRONT_URL);
};

/**
 * Gets the configuration status for debugging
 */
export const getS3Config = () => {
  return {
    bucket: S3_BUCKET ? '✓ Configured' : '✗ Not set',
    cloudfront: CLOUDFRONT_URL ? '✓ Configured' : '✗ Not set',
    region: AWS_REGION,
    isConfigured: isS3Configured(),
  };
};

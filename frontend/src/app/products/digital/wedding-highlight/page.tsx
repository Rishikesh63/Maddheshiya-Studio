import VideoProductPage from "../../../components/VideoProductPage";
import { weddingHighlightProducts } from "./data";

export const metadata = {
  title: "Wedding Highlight | Maddheshiya Studio",
  description: "Cinematic wedding highlight reels — beautifully edited, color-graded, and music-synced.",
};

export default function WeddingHighlightPage() {
  return (
    <VideoProductPage
      title="Wedding Highlight"
      subtitle="Cinematic same-day wedding highlight reel"
      description="Every precious moment of your wedding day — the vows, the emotions, the celebrations — color-graded and music-synced into a cinematic film you will treasure forever. Choose your preferred duration and style."
      cartCategory="Wedding Highlight"
      products={weddingHighlightProducts}
    />
  );
}

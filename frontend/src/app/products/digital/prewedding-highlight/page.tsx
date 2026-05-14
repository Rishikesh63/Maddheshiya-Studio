import VideoProductPage from "../../../components/VideoProductPage";
import { preweddingHighlightProducts } from "./data";

export const metadata = {
  title: "Pre-Wedding Highlight | Maddheshiya Studio",
  description: "Dreamy cinematic pre-wedding films that tell your love story before the big day.",
};

export default function PreweddingHighlightPage() {
  return (
    <VideoProductPage
      title="Pre-Wedding Highlight"
      subtitle="Romantic cinematic pre-wedding film"
      description="A dreamy, cinematic edit of your pre-wedding shoot telling your love story before the big day. Crafted with romantic music, color grading, and storytelling edits that make every frame feel like a movie."
      cartCategory="Pre-Wedding Highlight"
      products={preweddingHighlightProducts}
    />
  );
}

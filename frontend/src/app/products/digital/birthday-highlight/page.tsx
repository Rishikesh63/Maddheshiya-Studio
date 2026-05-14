import VideoProductPage from "../../../components/VideoProductPage";
import { birthdayHighlightProducts } from "./data";

export const metadata = {
  title: "Birthday Highlight | Maddheshiya Studio",
  description: "Vibrant cinematic birthday highlight reels — perfect for Instagram Reels and WhatsApp.",
};

export default function BirthdayHighlightPage() {
  return (
    <VideoProductPage
      title="Birthday Highlight"
      subtitle="Fun and cinematic birthday event film"
      description="A vibrant, energetic highlight reel of your birthday celebration. Trending music, color grading, and all the best moments edited into a shareable film — perfect for Instagram Reels and WhatsApp."
      cartCategory="Birthday Highlight"
      products={birthdayHighlightProducts}
    />
  );
}

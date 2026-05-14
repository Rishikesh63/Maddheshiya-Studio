import VideoProductPage from "../../../components/VideoProductPage";
import { videoLogoProducts } from "./data";

export const metadata = {
  title: "Video Logo | Maddheshiya Studio",
  description: "Professional animated logo intros for photographers, studios, and businesses.",
};

export default function VideoLogoPage() {
  return (
    <VideoProductPage
      title="Video Logo"
      subtitle="Animated logo intro for your videos"
      description="A professional animated logo intro that adds a premium branded opening to every video you deliver. Cinematic motion, sound design, and your branding — ready to use forever on all your videos."
      cartCategory="Video Logo"
      products={videoLogoProducts}
    />
  );
}

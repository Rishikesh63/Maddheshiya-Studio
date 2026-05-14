import VideoProductPage from "../../../components/VideoProductPage";
import { weddingTitleProducts } from "./data";

export const metadata = {
  title: "Wedding Title | Maddheshiya Studio",
  description: "Custom animated title cards for wedding films and invitation videos.",
};

export default function WeddingTitlePage() {
  return (
    <VideoProductPage
      title="Wedding Title"
      subtitle="Cinematic name title card for your wedding film"
      description="Custom animated title cards featuring your names and wedding date. Used as an intro for wedding films, reels, and invitation videos. Elegant typography, gold accents, and smooth cinematic motion."
      cartCategory="Wedding Title"
      products={weddingTitleProducts}
    />
  );
}

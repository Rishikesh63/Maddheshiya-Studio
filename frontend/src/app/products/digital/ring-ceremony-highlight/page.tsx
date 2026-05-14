import VideoProductPage from "../../../components/VideoProductPage";
import { ringCeremonyProducts } from "./data";

export const metadata = {
  title: "Ring Ceremony Highlights | Maddheshiya Studio",
  description: "Elegant cinematic short films of your ring ceremony.",
};

export default function RingCeremonyHighlightPage() {
  return (
    <VideoProductPage
      title="Ring Ceremony Highlights"
      subtitle="Elegant short film of your ring exchange"
      description="A focused cinematic edit capturing every emotion of your ring ceremony. The exchange, the smiles, the tears of joy — beautifully preserved in a short film you will watch over and over."
      cartCategory="Ring Ceremony Highlight"
      products={ringCeremonyProducts}
    />
  );
}

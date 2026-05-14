import VideoProductPage from "../../../components/VideoProductPage";
import { invitationVideoProducts } from "./data";

export const metadata = {
  title: "Invitation Videos | Maddheshiya Studio",
  description: "Cinematic animated invitation videos for weddings, engagements, and all celebrations.",
};

export default function InvitationVideoPage() {
  return (
    <VideoProductPage
      title="Invitation Videos"
      subtitle="Cinematic digital wedding invitations"
      description="Stunning animated invitation videos crafted with your photos, names, and event details. Delivered in HD — WhatsApp and Instagram ready. Choose a style, share your photos, and we handle the rest."
      cartCategory="Invitation Video"
      products={invitationVideoProducts}
    />
  );
}

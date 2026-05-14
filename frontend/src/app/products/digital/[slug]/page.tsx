import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Navbar from "../../../components/Navbar";
import Footer from "../../../components/Footer";
import AddToCartButton from "../../../components/AddToCartButton";
import { productData } from "../../../lib/serviceData";
import { waLink } from "../../../lib/siteConfig";
import { Check, ArrowLeft, Clock, MessageCircle } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return Object.entries(productData)
    .filter(([, d]) => d.category === "digital")
    .map(([slug]) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const data = productData[slug];
  if (!data || data.category !== "digital") return {};
  return { title: data.title, description: data.description };
}

export default async function DigitalProductPage({ params }: Props) {
  const { slug } = await params;
  const data = productData[slug];
  if (!data || data.category !== "digital") notFound();

  return (
    <div className="bg-[var(--black)]">
      <Navbar />

      <section className="pt-36 pb-20 px-6">
        <div className="max-w-5xl mx-auto">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-[10px] tracking-widest uppercase text-white/30 hover:text-[var(--gold)]/60 transition-colors mb-10"
          >
            <ArrowLeft size={12} />
            Products
          </Link>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-start">
            {/* Left: product info */}
            <div>
              <span className="text-[10px] tracking-[0.4em] uppercase text-[var(--gold)]/60 block mb-4">
                Digital Product
              </span>
              <h1
                className="text-4xl md:text-6xl font-light text-white mb-2"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {data.title}
              </h1>
              <p
                className="text-lg font-light text-white/50 mb-3"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                {data.subtitle}
              </p>
              <div className="w-12 h-px bg-[var(--gold)]/40 mb-6" />
              <p className="text-sm text-white/50 leading-relaxed mb-8">{data.description}</p>

              {/* Price + Delivery */}
              <div className="flex items-center gap-6 mb-8 p-5 bg-[var(--black-card)] border border-[var(--gold)]/10">
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-white/30 mb-1">Starting From</p>
                  <p
                    className="text-3xl text-[var(--gold)]"
                    style={{ fontFamily: "var(--font-cormorant)" }}
                  >
                    {data.startingPrice}
                  </p>
                </div>
                <div className="w-px h-10 bg-[var(--gold)]/20" />
                <div>
                  <p className="text-[10px] tracking-widest uppercase text-white/30 mb-1">Delivery</p>
                  <div className="flex items-center gap-2">
                    <Clock size={12} className="text-[var(--gold)]/60" />
                    <p className="text-sm text-white/60">{data.deliveryTime}</p>
                  </div>
                </div>
              </div>

              {/* CTA buttons */}
              <div className="flex flex-col sm:flex-row gap-3">
                <AddToCartButton
                  id={slug}
                  title={data.title}
                  category="Digital Product"
                  price={data.price}
                />
                <Link
                  href={waLink(`Hi, I'm interested in ordering ${data.title} (${data.startingPrice}). Please share details.`)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[var(--gold)]/30 text-[var(--gold)]/70 text-xs tracking-widest uppercase hover:border-[var(--gold)] hover:text-[var(--gold)] transition-all"
                >
                  <MessageCircle size={14} />
                  Order via WhatsApp
                </Link>
              </div>
            </div>

            {/* Right: features */}
            <div>
              <h3
                className="text-2xl font-light text-white mb-6"
                style={{ fontFamily: "var(--font-cormorant)" }}
              >
                What&apos;s Included
              </h3>
              <ul className="space-y-4">
                {data.features.map((f) => (
                  <li key={f} className="flex items-start gap-3 pb-4 border-b border-[var(--gold)]/5">
                    <Check size={14} className="text-[var(--gold)]/60 mt-0.5 shrink-0" />
                    <span className="text-sm text-white/50">{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

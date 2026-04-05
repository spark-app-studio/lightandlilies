import Image from "next/image";

interface HeroProps {
  imageSrc?: string;
  title?: string;
  subtitle?: string;
}

export default function Hero({ imageSrc, title, subtitle }: HeroProps) {
  return (
    <section className="relative w-full">
      {imageSrc ? (
        <>
          <div className="relative w-full h-[60vh] min-h-[400px]">
            <Image
              src={imageSrc}
              alt={title || "Light & Lilies"}
              fill
              className="object-cover"
              priority
            />
            {title && (
              <div className="absolute inset-0 bg-purple-dark/20 flex items-center justify-center px-6">
                <h1 className="font-heading text-4xl md:text-5xl text-cream text-center">
                  {title}
                </h1>
              </div>
            )}
          </div>
          {subtitle && (
            <div className="py-10 px-6 bg-cream">
              <p className="text-lg md:text-xl text-text-secondary text-center max-w-2xl mx-auto font-body italic">
                {subtitle}
              </p>
            </div>
          )}
        </>
      ) : (
        <div className="bg-purple-dark/5 py-20 px-6 flex flex-col items-center justify-center">
          {title && (
            <h1 className="font-heading text-4xl md:text-5xl text-purple-dark text-center mb-4">
              {title}
            </h1>
          )}
          {subtitle && (
            <p className="text-lg md:text-xl text-text-secondary text-center max-w-2xl font-body italic">
              {subtitle}
            </p>
          )}
        </div>
      )}
    </section>
  );
}

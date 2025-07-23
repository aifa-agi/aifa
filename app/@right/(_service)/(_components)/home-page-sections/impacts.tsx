import { ArrowRight } from "lucide-react";

// Типы данных для заголовка
interface HeaderData {
  title: string;
  subtitle: string;
  linkText: string;
  linkHref: string;
}

// Типы данных для карточки
interface CardData {
  id: string;
  title: string;
  subtitle: string;
  company: string;
  href: string;
  hoverGradientClass: string; // Полный класс градиента
  hoverGradientTransform?: string; // Трансформация
}

interface ImpactsProps {
  title: string;
  discriptions: string;
  cards: CardData[];
}

export default function Impacts({ title, discriptions, cards }: ImpactsProps) {
  return (
    <section className="w-full pt-20">
      <div className="container w-full mx-auto px-4 flex flex-col items-center ">
        {/* Title */}
        <h2 className="mb-6 max-w-3xl text-center font-serif font-bold leading-tight md:text-2xl lg:text-4xl">
          {title}
        </h2>
        <p className="mb-12 max-w-xl text-base text-muted-foreground text-center">
          {discriptions}
        </p>

        {/* Grid Section - Фоновый градиент с основным цветом бренда */}
        <div
          className="grid grid-cols-2 md:grid-cols-3 gap-[2px]"
          style={{
            background:
              "radial-gradient(circle at center, hsl(263.4,70%,50.4%) 0%, rgba(0,0,0,0) 99%)",
          }}
        >
          {cards.map((card) => (
            <a
              key={card.id}
              className="group relative size-full p-6 sm:p-8 bg-gray-950 flex flex-col justify-between overflow-hidden"
              href={card.href}
            >
              <div className="relative z-10 flex h-full flex-col justify-between">
                <div>
                  <p className="text-2xl font-bold mb-2">{card.title}</p>
                  <p className="text-gray-400 mb-4">{card.subtitle}</p>
                </div>
                <div className="relative flex items-center gap-x-2.5 md:mt-4">
                  <div className="pointer-events-none h-6 w-fit shrink-0 transition-opacity duration-300 opacity-80 md:group-hover:opacity-100">
                    {card.company}
                  </div>
                  <ArrowRight className="pointer-events-none -mb-px shrink-0 transition-opacity duration-300 w-4 h-4 opacity-0 md:group-hover:opacity-100" />
                </div>
              </div>
              {/* Hover gradient для карточки */}
              <span
                className={`pointer-events-none absolute inset-px opacity-0 transition-opacity duration-300 md:group-hover:opacity-100 
                        ${card.hoverGradientClass} ${card.hoverGradientTransform || ""}`}
                aria-hidden="true"
              ></span>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

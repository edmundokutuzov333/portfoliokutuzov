import { PortfolioArchive } from "@/components/portfolio/PortfolioArchive";

export function PortfolioRoutePage() {
  return (
    <section
      data-tone="betao"
      className="relative bg-[#d6d4ce] px-4 pb-28 pt-28 text-black md:px-8 md:pt-40"
      aria-labelledby="portfolio-title"
    >
      <div className="mx-auto max-w-[1600px]">
        <div className="grid grid-cols-4 gap-4 md:grid-cols-12 md:gap-6">
          <div className="col-span-4 md:col-span-12">
            <h1
              id="portfolio-title"
              className="font-cartaz text-[clamp(4rem,11vw,11rem)] font-extrabold leading-[0.82] tracking-[-0.07em]"
            >
              Selected Work.
            </h1>
            <p className="mt-6 max-w-2xl font-livro text-xl leading-[1.55] text-[#3f3e3b]">
              The archive of published work, filtered by discipline, year, client and search.
            </p>
          </div>
          <div className="col-span-4 md:col-span-12">
            <div className="mt-12">
              <PortfolioArchive />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

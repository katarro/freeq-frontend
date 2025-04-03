"use client";
import SiteCard, { SiteStatus } from "@/components/cards/site-card";
import FreeqSearch from "@/components/freeq-search";
import { useHomePage } from "@/hooks/use-home-page";
import Image from "next/image";

export default function HomePage() {

  const { 
    filteredSites, 
    setSearchSite,
    activeFilter,
    toggleInputFilter
  } = useHomePage();

  return (
    <section className="flex flex-col">
      <div className="px-4 pt-8 lg:pb-9 bg-primary flex flex-col gap-2.5 lg:gap-10">
        <h1 className="text-2xl lg:text-3xl font-semibold text-primary-foreground text-center">
          Elige tu lugar y haz fila <br className="lg:hidden" /> sin estrés
        </h1>
        <figure className="w-[240px] h-[179px] mx-auto">
          <Image
            className="aspect-square w-full h-full object-cover"
            src="/images/rafiki.avif"
            alt="Rifiki Que"
            width={240}
            height={179}
          />
        </figure>
      </div>
      <div className="px-4 pb-8 pt-10 bg-primary lg:bg-transparent flex flex-col gap-4 md:gap-6">

        <div className="max-w-[400px]">
        <FreeqSearch 
            onSearchChange={setSearchSite} 
            onToggleFilter={toggleInputFilter}
            filterActive={activeFilter !== 'all'}
          />        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {filteredSites.map((site) => (
            <SiteCard
              key={site.id}
              title={site.title}
              description={site.description}
              status={site.status as SiteStatus}
              waiting={site.waiting}
              isLiked={site.isLiked}
              slug={site.slug}
              siteImage={{
                src: site.image,
                width: 40,
                height: 40,
                blurDataURL: "",
                blurWidth: 0,
                blurHeight: 0,
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}


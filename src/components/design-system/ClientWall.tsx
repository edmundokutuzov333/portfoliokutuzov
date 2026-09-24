import type { DbClient } from "@/lib/cms";

type ClientWallProps = {
  clients: Pick<DbClient, "id" | "name" | "logo_url" | "website_url">[];
};

export function ClientWall({ clients }: ClientWallProps) {
  const visible = clients.filter((client) => client.name.trim());
  if (!visible.length) return null;

  return (
    <div className="mt-10 grid grid-cols-2 border-t-2 border-cal/25 md:grid-cols-4">
      {visible.map((client, index) => {
        const content = client.logo_url ? (
          <img
            src={client.logo_url}
            alt={client.name}
            className="max-h-10 max-w-full object-contain"
            loading="lazy"
          />
        ) : (
          <span>{client.name}</span>
        );

        const inner = (
          <>
            <span className="mr-4 text-fumo tabular-nums">
              {String(index + 1).padStart(2, "0")}
            </span>
            {content}
          </>
        );

        if (!client.website_url) {
          return (
            <div
              key={client.id}
              className="flex min-h-20 items-center border-b-2 border-cal/20 border-r-2 px-4 py-5 text-lg font-semibold text-cal md:px-6 md:py-6 md:text-2xl"
            >
              {inner}
            </div>
          );
        }

        return (
          <a
            key={client.id}
            href={client.website_url}
            target="_blank"
            rel="noreferrer"
            className="flex min-h-20 items-center border-b-2 border-cal/20 border-r-2 px-4 py-5 text-lg font-semibold text-cal hover:bg-cal hover:text-preto focus:outline-none focus-visible:ring-2 focus-visible:ring-work md:px-6 md:py-6 md:text-2xl"
          >
            {inner}
          </a>
        );
      })}
    </div>
  );
}

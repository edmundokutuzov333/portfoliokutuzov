import { useEffect, useMemo, useState } from "react";
import { Toaster as SonnerToaster } from "sonner";
import "@fontsource-variable/archivo/wdth.css";
import "@fontsource-variable/newsreader/opsz.css";
import "@fontsource-variable/newsreader/opsz-italic.css";
import "@/styles/design-system.css";
import { useAdminAuth } from "@/hooks/useAdmin";
import { setWorkColor } from "@/lib/work-color";
import { GridOverlay } from "@/components/design-system/GridOverlay";
import { ContextCursor } from "@/components/design-system/ContextCursor";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Button,
  ClientWall,
  Dialog,
  DialogContent,
  DialogTrigger,
  Field,
  Headline,
  Link,
  Marquee,
  MetaRow,
  Section,
  Sheet,
  SheetContent,
  SheetTrigger,
  Stat,
  Stepper,
  Tag,
  Toast,
  WorkCard,
} from "@/components/design-system/primitives";

const WORK_DEFAULT = "#2f4bff";

export function DesignSystemShowcase() {
  const { session, isAdmin, loading } = useAdminAuth();
  const [workColor, setWorkColorValue] = useState(WORK_DEFAULT);
  const [tagOn, setTagOn] = useState(true);

  useEffect(() => {
    setWorkColor(workColor);
  }, [workColor]);

  const toneRows = useMemo(
    () => [
      { tone: "preto" as const, label: "Preto", detail: "Interface silenciosa e de alto contraste." },
      { tone: "betao" as const, label: "Betão", detail: "Superfície neutra para dar corpo ao conteúdo." },
      { tone: "cal" as const, label: "Cal", detail: "Superfície clara para formulários e leitura." },
      { tone: "cor" as const, label: "Cor do Trabalho", detail: "A cor pertence à peça em foco, não ao chrome." },
    ],
    [],
  );

  if (loading) {
    return (
      <div className="ds-shell grid min-h-screen place-items-center px-6 text-sm">
        Checking admin access…
      </div>
    );
  }

  if (!session || !isAdmin) {
    return (
      <div className="ds-shell grid min-h-screen place-items-center px-6 text-center" data-tone="preto">
        <div className="max-w-lg">
          <p className="text-sm">Protected surface</p>
          <h1 className="mt-4 font-cartaz text-5xl font-extrabold tracking-[-0.04em]">Design System</h1>
          <p className="mt-4 font-livro text-xl leading-8 opacity-75">
            This route uses the same Supabase admin boundary as the Control Room.
          </p>
          <Link className="mt-8 inline-block" href="/admin">Open Control Room</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ds-shell" data-tone="preto">
      <GridOverlay />
      <ContextCursor />
      <SonnerToaster
        position="bottom-right"
        toastOptions={{
          style: {
            borderRadius: 0,
            border: "2px solid #000",
            background: "#f2f2ef",
            color: "#000",
            boxShadow: "none",
            fontFamily: '"Archivo Variable", sans-serif',
          },
        }}
      />

      <Section tone="preto" id="overview">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-end">
          <div className="lg:col-span-8">
            <p className="mb-5 text-sm opacity-70">Kutuzov · Design system · Phase 3</p>
            <Headline
              as="h1"
              text="Concrete and colour make the interface remember the work."
              emphasis="remember the work."
              className="text-[clamp(3.6rem,10vw,9rem)]"
            />
          </div>
          <div className="lg:col-span-4 lg:justify-self-end">
            <MetaRow
              items={[
                { label: "Runtime", value: "Node 24 · browser" },
                { label: "Route", value: "/admin/design-system" },
                { label: "Scope", value: "Infrastructure only" },
              ]}
            />
          </div>
        </div>
      </Section>

      <Section tone="betao">
        <div className="grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-sm opacity-70">Colour system</p>
            <h2 className="mt-3 font-cartaz text-[clamp(2.6rem,7vw,6rem)] font-extrabold tracking-[-0.05em]">
              Tone before decoration.
            </h2>
            <p className="mt-5 max-w-xl font-livro text-[1.2rem] leading-[1.55]">
              Betão, Cal, Preto, Chapa and Fumo establish the interface. Work colour enters only when a work item is in focus.
            </p>
          </div>
          <div className="grid gap-4 lg:col-span-7 lg:grid-cols-2">
            {toneRows.map((row) => (
              <div key={row.tone} data-tone={row.tone} className="min-h-48 border-2 border-current p-5">
                <p className="text-sm font-semibold">{row.label}</p>
                <p className="mt-3 font-livro text-lg leading-7 opacity-80">{row.detail}</p>
              </div>
            ))}
          </div>
        </div>
      </Section>

      <Section tone="cor">
        <div className="grid gap-10 lg:grid-cols-12 lg:items-center">
          <div className="lg:col-span-7">
            <p className="text-sm opacity-75">Work colour</p>
            <h2 className="mt-3 font-cartaz text-[clamp(3rem,8vw,8rem)] font-extrabold tracking-[-0.05em]">
              The work brings the colour.
            </h2>
            <p className="mt-5 max-w-2xl font-livro text-xl leading-[1.55]">
              Change the specimen colour. No public data is written; setWorkColor only updates the root design tokens.
            </p>
          </div>
          <div className="lg:col-span-5">
            <label className="grid gap-3 text-sm font-semibold">
              Work colour
              <input
                type="color"
                value={workColor}
                onChange={(event) => setWorkColorValue(event.target.value)}
                className="h-20 w-full cursor-pointer border-2 border-current bg-transparent p-1"
              />
            </label>
            <p className="mt-3 font-livro text-lg">{workColor}</p>
          </div>
        </div>
      </Section>

      <Section tone="preto">
        <div className="grid gap-12">
          <div>
            <p className="text-sm opacity-70">Typography</p>
            <h2 className="mt-3 font-cartaz text-[clamp(2.8rem,7vw,6rem)] font-extrabold tracking-[-0.05em]">
              Poster + book.
            </h2>
            <p className="mt-4 max-w-2xl font-livro text-xl leading-[1.55]">
              Archivo carries the public voice. Newsreader carries narrative, biography, manifesto and case-study reading.
            </p>
          </div>
          <Headline
            text="A headline has one voice, one emphasis, and one rendered text."
            emphasis="one emphasis"
            className="text-[clamp(3rem,8vw,8rem)]"
          />
          <p className="max-w-3xl font-livro text-3xl italic leading-[1.45]">
            True Newsreader italics remain a typographic style, not a synthetic effect.
          </p>
        </div>
      </Section>

      <Section tone="betao">
        <div className="grid gap-8">
          <div>
            <p className="text-sm opacity-70">Controls</p>
            <h2 className="mt-3 font-cartaz text-[clamp(2.6rem,6vw,5rem)] font-extrabold tracking-[-0.04em]">
              One hierarchy.
            </h2>
          </div>

          <div className="flex flex-wrap gap-3">
            <Button variant="primary" dark>Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="link">Link</Button>
            <Tag pressed={tagOn} onPressedChange={setTagOn}>Retangular tag</Tag>
            <Toast label="System toast" />
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <Field
              label="Project email"
              type="email"
              placeholder="name@domain.com"
              description="The label remains visible; placeholder is never the label."
            />
            <Stepper steps={["Identity", "Project", "Budget"]} current={1} />
          </div>

          <Accordion type="single" collapsible className="ds-accordion" defaultValue="motion">
            <AccordionItem value="motion">
              <AccordionTrigger>Motion rules</AccordionTrigger>
              <AccordionContent>
                Signature motion is reserved for meaningful interaction. Reduced motion removes decorative movement.
              </AccordionContent>
            </AccordionItem>
            <AccordionItem value="colour">
              <AccordionTrigger>Colour rules</AccordionTrigger>
              <AccordionContent>
                Work colour belongs to the work, not the interface chrome.
              </AccordionContent>
            </AccordionItem>
          </Accordion>

          <div className="flex flex-wrap gap-3">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="secondary">Open dialog</Button>
              </DialogTrigger>
              <DialogContent title="Dialog primitive" description="Radix focus management with zero-radius system surfaces.">
                <p className="font-livro text-lg leading-7">
                  Focus returns to the trigger when the dialog closes.
                </p>
              </DialogContent>
            </Dialog>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="secondary">Open sheet</Button>
              </SheetTrigger>
              <SheetContent title="Sheet primitive">
                <p className="font-livro text-lg leading-7">
                  Vaul provides the touch-first sheet interaction without changing the public Studio UI.
                </p>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </Section>

      <Section tone="cal">
        <div className="grid gap-10">
          <div>
            <p className="text-sm opacity-70">Content primitives</p>
            <h2 className="mt-3 font-cartaz text-[clamp(2.6rem,6vw,5rem)] font-extrabold tracking-[-0.05em]">
              Containers support the work.
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <WorkCard title="System work specimen" client="Real project data enters during page phases" year="Phase 5+" />
            <div className="grid gap-6">
              <Stat value="04" label="Tone contexts" />
              <Stat value="02" label="Typographic roles" />
            </div>
          </div>

          <ClientWall items={[]} />
          <Marquee items={["Client mark slot", "Project metadata", "Accessible name"]} />
        </div>
      </Section>
    </div>
  );
}

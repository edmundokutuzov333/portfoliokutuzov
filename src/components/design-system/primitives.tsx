import * as React from "react";
import * as AccordionPrimitive from "@radix-ui/react-accordion";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import * as LabelPrimitive from "@radix-ui/react-label";
import * as TogglePrimitive from "@radix-ui/react-toggle";
import { Slot } from "@radix-ui/react-slot";
import { Drawer as VaulDrawer } from "vaul";
import { cva, type VariantProps } from "class-variance-authority";
import { toast as sonnerToast } from "sonner";
import { cn } from "@/lib/utils";

const buttonVariants = cva("ds-button", {
  variants: {
    variant: {
      primary: "",
      secondary: "",
      link: "",
    },
  },
  defaultVariants: { variant: "primary" },
});

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> &
  VariantProps<typeof buttonVariants> & { asChild?: boolean; dark?: boolean };

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, dark, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        ref={ref}
        className={cn(buttonVariants({ variant, className }))}
        data-variant={variant ?? "primary"}
        data-tone={dark ? "dark" : undefined}
        {...props}
      />
    );
  },
);
Button.displayName = "DesignSystemButton";

export type LinkProps = React.AnchorHTMLAttributes<HTMLAnchorElement> & {
  external?: boolean;
};

export const Link = React.forwardRef<HTMLAnchorElement, LinkProps>(
  ({ className, external = false, target, rel, ...props }, ref) => (
    <a
      ref={ref}
      className={cn("ds-link", className)}
      data-external={external ? "true" : undefined}
      target={external ? target ?? "_blank" : target}
      rel={external ? rel ?? "noreferrer" : rel}
      {...props}
    />
  ),
);
Link.displayName = "DesignSystemLink";

export const Tag = React.forwardRef<
  React.ElementRef<typeof TogglePrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof TogglePrimitive.Root>
>(({ className, ...props }, ref) => (
  <TogglePrimitive.Root ref={ref} className={cn("ds-tag", className)} {...props} />
));
Tag.displayName = "DesignSystemTag";

export type FieldProps = Omit<React.InputHTMLAttributes<HTMLInputElement>, "size"> & {
  label: string;
  error?: string;
  description?: string;
};

export const Field = React.forwardRef<HTMLInputElement, FieldProps>(
  ({ id, label, error, description, className, ...props }, ref) => {
    const generatedId = React.useId();
    const inputId = id ?? generatedId;
    const errorId = error ? inputId + "-error" : undefined;
    return (
      <div className={cn("ds-field", className)}>
        <LabelPrimitive.Root htmlFor={inputId}>{label}</LabelPrimitive.Root>
        {description ? <p className="text-sm opacity-70">{description}</p> : null}
        <input
          ref={ref}
          id={inputId}
          aria-invalid={Boolean(error)}
          aria-describedby={errorId}
          {...props}
        />
        {error ? (
          <p id={errorId} className="ds-field__error" role="alert" aria-live="polite">
            {error}
          </p>
        ) : null}
      </div>
    );
  },
);
Field.displayName = "DesignSystemField";

export function Stepper({
  steps,
  current = 0,
}: {
  steps: readonly string[];
  current?: number;
}) {
  return (
    <ol className="ds-stepper" aria-label="Progress">
      {steps.map((step, index) => (
        <li key={step} className="ds-stepper__step" data-current={index === current}>
          <span className="ds-stepper__index" aria-hidden="true">
            {String(index + 1).padStart(2, "0")}
          </span>
          <span>{step}</span>
        </li>
      ))}
    </ol>
  );
}

export const Accordion = AccordionPrimitive.Root;

export function AccordionItem({
  value,
  children,
}: {
  value: string;
  children: React.ReactNode;
}) {
  return (
    <AccordionPrimitive.Item value={value} className="ds-accordion__item">
      {children}
    </AccordionPrimitive.Item>
  );
}

export const AccordionTrigger = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Trigger>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Trigger>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Header>
    <AccordionPrimitive.Trigger
      ref={ref}
      className={cn("ds-accordion__trigger", className)}
      {...props}
    >
      {children}
      <span aria-hidden="true">+</span>
    </AccordionPrimitive.Trigger>
  </AccordionPrimitive.Header>
));
AccordionTrigger.displayName = "DesignSystemAccordionTrigger";

export const AccordionContent = React.forwardRef<
  React.ElementRef<typeof AccordionPrimitive.Content>,
  React.ComponentPropsWithoutRef<typeof AccordionPrimitive.Content>
>(({ className, children, ...props }, ref) => (
  <AccordionPrimitive.Content
    ref={ref}
    className={cn("ds-accordion__content", className)}
    {...props}
  >
    <div>{children}</div>
  </AccordionPrimitive.Content>
));
AccordionContent.displayName = "DesignSystemAccordionContent";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;

export function DialogContent({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <DialogPrimitive.Portal>
      <DialogPrimitive.Overlay className="ds-overlay" />
      <DialogPrimitive.Content className="ds-dialog">
        <DialogPrimitive.Title className="font-cartaz text-2xl font-bold">
          {title}
        </DialogPrimitive.Title>
        {description ? (
          <DialogPrimitive.Description className="mt-2 text-sm opacity-70">
            {description}
          </DialogPrimitive.Description>
        ) : null}
        <div className="mt-6">{children}</div>
        <DialogPrimitive.Close asChild>
          <Button variant="secondary" type="button" className="absolute right-3 top-3 min-h-11">
            Close
          </Button>
        </DialogPrimitive.Close>
      </DialogPrimitive.Content>
    </DialogPrimitive.Portal>
  );
}

export const Sheet = VaulDrawer.Root;
export const SheetTrigger = VaulDrawer.Trigger;

export function SheetContent({
  children,
  title,
}: {
  children: React.ReactNode;
  title: string;
}) {
  return (
    <VaulDrawer.Portal>
      <VaulDrawer.Overlay className="ds-overlay" />
      <VaulDrawer.Content className="ds-sheet">
        <VaulDrawer.Title className="font-cartaz text-2xl font-bold">
          {title}
        </VaulDrawer.Title>
        <div className="mt-6">{children}</div>
      </VaulDrawer.Content>
    </VaulDrawer.Portal>
  );
}

export function Toast({ label = "Toast specimen" }: { label?: string }) {
  return (
    <Button variant="secondary" type="button" onClick={() => sonnerToast(label)}>
      {label}
    </Button>
  );
}

export function Section({
  tone,
  children,
  className,
  id,
}: {
  tone: "preto" | "betao" | "cal" | "cor";
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} data-tone={tone} className={cn("ds-section", className)}>
      <div className="ds-section__inner">{children}</div>
    </section>
  );
}

export function Headline({
  text,
  emphasis,
  as: Component = "h2",
  className,
}: {
  text: string;
  emphasis?: string;
  as?: "h1" | "h2" | "h3";
  className?: string;
}) {
  const split = emphasis ? text.indexOf(emphasis) : -1;
  const hasEmphasis = split >= 0;
  const before = hasEmphasis ? text.slice(0, split) : text;
  const emphasized = hasEmphasis ? text.slice(split, split + emphasis!.length) : "";
  const after = hasEmphasis ? text.slice(split + emphasis!.length) : "";

  return (
    <Component className={cn("ds-headline", className)} aria-label={text}>
      <span className="ds-headline__visual" aria-hidden="true">
        {before}
        {hasEmphasis ? <span className="ds-headline__emphasis">{emphasized}</span> : null}
        {after}
      </span>
    </Component>
  );
}

export function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div className="ds-stat">
      <div className="ds-stat__value">{value}</div>
      <div className="ds-stat__label">{label}</div>
    </div>
  );
}

export function WorkCard({
  title,
  client,
  year,
  mediaUrl,
  className,
}: {
  title: string;
  client?: string;
  year?: string | number;
  mediaUrl?: string;
  className?: string;
}) {
  return (
    <article className={cn("ds-work-card", className)} data-cursor="View">
      <div className="ds-work-card__media">
        {mediaUrl ? <img src={mediaUrl} alt="" loading="lazy" /> : null}
      </div>
      <div className="ds-work-card__body">
        <h3 className="ds-work-card__title">{title}</h3>
        <div className="ds-work-card__meta">{[client, year].filter(Boolean).join(" · ")}</div>
      </div>
    </article>
  );
}

export function ClientWall({ items }: { items: readonly string[] }) {
  if (items.length === 0) {
    return (
      <div className="border-y-2 border-current py-8 text-sm opacity-70">
        ClientWall connects to real client data in the page phase; this specimen renders no invented names.
      </div>
    );
  }

  return (
    <ul className="ds-client-wall" aria-label="Client wall specimen">
      {items.map((item) => (
        <li key={item} className="ds-client-wall__item">
          {item}
        </li>
      ))}
    </ul>
  );
}

export function Marquee({ items }: { items: readonly string[] }) {
  const loop = [...items, ...items];
  return (
    <div className="ds-marquee" tabIndex={0} aria-label="Paused marquee specimen">
      <div className="ds-marquee__track">
        {loop.map((item, index) => (
          <span className="ds-marquee__item" key={item + index}>
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}

export function MetaRow({
  items,
}: {
  items: readonly { label: string; value: string }[];
}) {
  return (
    <dl className="ds-meta-row">
      {items.map((item) => (
        <div key={item.label} className="ds-meta-row__cell">
          <dt className="ds-meta-row__label">{item.label}</dt>
          <dd className="ds-meta-row__value">{item.value}</dd>
        </div>
      ))}
    </dl>
  );
}

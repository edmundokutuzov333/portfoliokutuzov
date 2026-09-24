import { createFileRoute } from "@tanstack/react-router";
import { CredentialsPage } from "@/components/credentials/CredentialsPagePhase10";
import { createSeo } from "@/lib/seo";

export const Route = createFileRoute("/credentials")({
  head: () =>
    createSeo({
      title: "The Credentials - Edmundo Kutuzov",
      description:
        "Experience, skills and selected brands worked with as art director and graphic designer by Edmundo Kutuzov.",
      path: "/credentials",
    }),
  component: CredentialsPage,
});

export { CredentialsPage };
export default CredentialsPage;

    };
  }, [sessionId]);

  const executeAction = useCallback(
    (action: string, slug?: string | null) => {
      if (action === "open_whatsapp") {
        window.open("https://wa.me/258876013121", "_blank");
      } else if (action === "open_contact") {
        navigate({ to: "/contact" }).catch(() => {});
      } else if (action === "open_portfolio") {
        navigate({ to: "/portfolio", search: {} }).catch(() => {});
      } else if (action === "open_services") {
        navigate({ to: "/services" }).catch(() => {});
      } else if (action === "open_credentials") {
        navigate({ to: "/credentials" }).catch(() => {});
      } else if (action === "open_project" && slug) {
        navigate({ to: "/portfolio/$slug", params: { slug } }).catch(() => {});
      }
    },
    [navigate],
  );
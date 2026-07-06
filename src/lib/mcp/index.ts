import { defineMcp } from "@lovable.dev/mcp-js";
import listProjectsTool from "./tools/list-projects";
import getProjectTool from "./tools/get-project";
import submitBriefTool from "./tools/submit-brief";

export default defineMcp({
  name: "edmundo-kutuzov-mcp",
  title: "Edmundo Kutuzov · Studio MCP",
  version: "0.1.0",
  instructions:
    "Tools for Edmundo Kutuzov's portfolio site. Use `list_projects` to browse recent work, `get_project` to fetch a single case study by slug, and `submit_brief` to send a new project briefing to the studio inbox.",
  tools: [listProjectsTool, getProjectTool, submitBriefTool],
});

import { Bot, FileSearch, Sparkles, type LucideIcon } from "lucide-react";

export const aiData: { title: string; description: string; icon: LucideIcon }[] =
  [
    {
      title: "Building with LLMs",
      description:
        "Integrating the OpenAI API and the Vercel AI SDK into Next.js apps: streaming responses, chat interfaces and structured outputs.",
      icon: Bot,
    },
    {
      title: "Document Q&A",
      description:
        "Apps that let users chat with their own content, like uploading a PDF and asking questions about it.",
      icon: FileSearch,
    },
    {
      title: "AI-assisted workflow",
      description:
        "Using tools like Claude Code day to day to prototype faster, refactor safely and keep the quality bar high.",
      icon: Sparkles,
    },
  ];

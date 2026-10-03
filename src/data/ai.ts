import { Bot, FileSearch, Sparkles, type LucideIcon } from "lucide-react";

export const aiData: {
  title: string;
  description: string;
  icon: LucideIcon;
  tags: string[];
}[] = [
  {
    title: "AI-powered features",
    description:
      "I add LLMs to real products: streaming chat interfaces, smooth loading states and responses the UI can actually rely on.",
    icon: Bot,
    tags: ["OpenAI API", "Vercel AI SDK", "Next.js"],
  },
  {
    title: "Chat with your documents",
    description:
      "Upload a PDF, ask questions, get answers grounded in its content. I built it end to end, from the upload to the conversation.",
    icon: FileSearch,
    tags: ["PDF Q&A", "Streaming", "TypeScript"],
  },
  {
    title: "AI in my daily workflow",
    description:
      "I use AI coding agents to prototype faster and refactor with confidence, while I keep reviewing and owning every line that ships.",
    icon: Sparkles,
    tags: ["Claude Code", "Prototyping", "Code review"],
  },
];

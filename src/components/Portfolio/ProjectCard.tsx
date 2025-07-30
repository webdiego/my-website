import React from "react";
import { BookDashed } from "lucide-react";

export default function ProjectCard({
  title,
  description,
  link,
  githubLink,
  tags,
  template = false,
}: {
  title: string;
  description: string;
  link: string;
  githubLink: string;
  tags: string[];
  template?: boolean;
}) {
  return (
    <div className="rounded-md p-5 bg-gradient-to-l from-slate-100  to-slate-200">
      <div className="flex items-center">
        <h3 className="font-medium text-lg">{title}</h3>
        {template && (
          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-full flex items-center">
            <BookDashed className="w-4 h-4 mr-1" />
            Template
          </span>
        )}
      </div>
      <p className="text-sm">{description}</p>

      <div className="flex flex-wrap mt-2 gap-2">
        {tags.map((tag, index) => (
          <div
            key={index}
            className="bg-slate-400 text-white px-2 py-1 rounded-md text-xs mr-2s"
          >
            {tag}
          </div>
        ))}
      </div>
      <div className=" self-end mt-6">
        <a
          href={githubLink}
          className="text-xs bg-black text-white rounded-full px-3 py-1 inline-block mr-2 "
          target="_blank"
          rel="noopener noreferrer"
        >
          View on GitHub
        </a>

        <a
          href={link}
          className="text-xs bg-black text-white rounded-full px-3 py-1 inline-block "
          target="_blank"
          rel="noopener noreferrer"
        >
          View Live
        </a>
      </div>
    </div>
  );
}

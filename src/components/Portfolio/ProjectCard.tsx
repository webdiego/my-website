import React from "react";
import { BookDashed, Building } from "lucide-react";
import { Hammer } from "lucide-react";
import { Github } from "lucide-react";
import { Globe } from "lucide-react";

export default function ProjectCard({
  title,
  description,
  company,
  link,
  githubLink,
  tags,
  template = false,
  wip = false,
}: {
  title: string;
  description: string;
  company?: string | null;
  link: string;
  githubLink: string | null;
  tags: string[];
  template?: boolean;
  wip?: boolean;
}) {
  return (
    <div className="rounded-md p-5 bg-gradient-to-l from-slate-100  to-slate-200">
      <div className="flex items-center">
        <h3 className="font-medium text-lg">{title}</h3>
        {template && (
          <span className="ml-2 text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded-md flex items-center">
            <BookDashed className="w-4 h-4 mr-1" />
            Template
          </span>
        )}
        {wip && (
          <span className="ml-2 text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-md flex items-center">
            <Hammer className="w-4 h-4 mr-1" />
            <span className="text-xs">Work in Progress</span>
          </span>
        )}
        {company && (
          <span className="ml-2 text-xs bg-green-100 text-green-800 px-2 py-1 rounded-md flex items-center">
            <Building className="w-4 h-4 mr-1" />
            {company}
          </span>
        )}
      </div>
      <p className="text-sm">{description}</p>

      <div className="flex flex-wrap mt-2 gap-2">
        {tags.map((tag, index) => (
          <div
            key={tag}
            className="bg-slate-400 text-white px-2 py-1 rounded-md text-xs mr-2s"
          >
            {tag}
          </div>
        ))}
      </div>
      <div className="flex  self-end mt-6">
        {githubLink && (
          <a
            href={githubLink}
            className="text-xs bg-gray-800 text-white rounded-full px-3 py-1  mr-2 flex hover:opacity-90 transition-all transform duration-300 hover:-translate-y-1"
            target="_blank"
            rel="noopener noreferrer"
          >
            <span className="text-xs inline">View on GitHub</span>
            <Github className="w-4 h-4 ml-1" />
          </a>
        )}
        <a
          href={link}
          className="text-xs bg-gray-800 text-white rounded-full px-3 py-1 flex hover:opacity-90 transition-all transform duration-300 hover:-translate-y-1"
          target="_blank"
          rel="noopener noreferrer"
        >
          <span className="text-xs inline">Live Demo</span>
          <Globe className="w-4 h-4 ml-1" />
        </a>
      </div>
    </div>
  );
}

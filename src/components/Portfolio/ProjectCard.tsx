import React from "react";
import { BookDashed, Building, Github, Globe, Hammer } from "lucide-react";

type ProjectCardProps = {
  title: string;
  description: string;
  company?: string | null;
  link: string;
  githubLink: string | null;
  tags: string[];
  template?: boolean;
  wip?: boolean;
};

export default function ProjectCard({
  title,
  description,
  company,
  link,
  githubLink,
  tags,
  template = false,
  wip = false,
}: ProjectCardProps) {
  const badgeClass =
    "text-xs px-2 py-1 rounded-md flex items-center gap-1 font-medium";
  const linkClass =
    "text-xs bg-slate-800 text-white rounded-full px-3 py-1.5 flex items-center gap-1 transition-all duration-300 hover:-translate-y-0.5 hover:bg-slate-700";

  return (
    <article className="rounded-lg p-5 bg-gradient-to-l from-slate-100 to-slate-200 border border-slate-200 flex flex-col">
      {(template || wip || company) && (
        <div className="mb-3 flex flex-wrap gap-2">
          {template && (
            <span className={`${badgeClass} bg-blue-100 text-blue-800`}>
              <BookDashed className="w-4 h-4" />
              Template
            </span>
          )}
          {wip && (
            <span className={`${badgeClass} bg-yellow-100 text-yellow-800`}>
              <Hammer className="w-4 h-4" />
              Work in Progress
            </span>
          )}
          {company && (
            <span className={`${badgeClass} bg-green-100 text-green-800`}>
              <Building className="w-4 h-4" />
              {company}
            </span>
          )}
        </div>
      )}
      <h3 className="font-semibold text-lg tracking-tight">{title}</h3>
      <p className="mt-1 text-sm text-slate-600 leading-relaxed">
        {description}
      </p>

      <ul className="flex flex-wrap mt-3 gap-1.5">
        {tags.map((tag) => (
          <li
            key={tag}
            className="bg-slate-800/80 text-white px-2 py-0.5 rounded-md text-xs"
          >
            {tag}
          </li>
        ))}
      </ul>
      <div className="flex mt-5 gap-2">
        {githubLink && (
          <a
            href={githubLink}
            className={linkClass}
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
            <Github className="w-4 h-4" />
          </a>
        )}
        <a
          href={link}
          className={linkClass}
          target="_blank"
          rel="noopener noreferrer"
        >
          Live Demo
          <Globe className="w-4 h-4" />
        </a>
      </div>
    </article>
  );
}

import Link from "next/link";
import Image from "next/image";
import type { ReactNode } from "react";
import {
  AboutData,
  educationData,
  experienceData,
  Months,
  ProjectData,
  socialData,
  sortExperienceData,
  sortProjectData,
  type ExperienceInterface,
} from "../../../data.config";
import {
  getPopularToolProjects,
  getPopularTools,
  toToolListItem,
} from "@/lib/tools";
import { WritingSection } from "@/components/portfolio/WritingSection";
import { HomeDesk } from "@/components/desk/HomeDesk";
import { Reveal } from "@/components/fx/Reveal";
import { ToolCard } from "@/components/tools/ToolCard";

function tenureParts(exp: ExperienceInterface): { start: string; end: string } {
  const start = `${exp.start.month ? `${Months[exp.start.month]} ` : ""}${exp.start.year}`;
  if (!exp.end) {
    return { start, end: "Present" };
  }
  const end = `${exp.end.month ? `${Months[exp.end.month]} ` : ""}${exp.end.year}`;
  return { start, end };
}

function SectionLabel({
  children,
  action,
}: {
  children: string;
  action?: ReactNode;
}) {
  return (
    <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 sm:mb-8">
      <p className="tape text-accent">{children}</p>
      <span className="h-px min-w-8 flex-1 bg-gradient-to-r from-accent/50 to-transparent" />
      {action}
    </div>
  );
}

const deskTags = ["Nubra", "OMS", "Go", "RPC"];

export function HomeView() {
  const experience = sortExperienceData(experienceData);
  const archive = sortProjectData(ProjectData);
  const liveTools = getPopularToolProjects(8);
  const tools = getPopularTools(4).map(toToolListItem);
  const socials = Object.entries(socialData);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-8 sm:px-6 sm:py-16">
      <section className="grid items-center gap-8 border-b border-border/70 pb-10 sm:gap-12 sm:pb-16 lg:grid-cols-[1.05fr_0.95fr]">
        <Reveal>
          <p className="tape mb-5 text-accent">index / prayas jain</p>
          <h1 className="font-display text-gradient text-[2.35rem] font-semibold leading-[1.05] sm:text-5xl lg:text-7xl lg:leading-[0.95]">
            {AboutData.name}
          </h1>
          <p className="mt-5 text-base font-medium text-ink sm:mt-6 sm:text-lg">
            {AboutData.byline}
            <span className="caret" aria-hidden="true" />
          </p>
          <p className="mt-4 max-w-xl text-base leading-7 text-muted sm:text-lg sm:leading-8">{AboutData.about}</p>
          <ul className="mt-7 flex flex-wrap gap-2">
            {deskTags.map((tag) => (
              <li key={tag} className="chip">
                {tag}
              </li>
            ))}
          </ul>
          <div className="mt-8 grid grid-cols-1 gap-3 min-[400px]:grid-cols-2 sm:flex sm:flex-wrap sm:items-center">
            <Link
              href="/#desk"
              className="btn btn-primary h-11 px-5 text-sm tracking-normal normal-case"
            >
              Trade the tape
            </Link>
            {AboutData.resume ? (
              <a
                href={AboutData.resume}
                className="btn btn-secondary h-11 px-5 text-sm tracking-normal normal-case"
                target="_blank"
                rel="noopener noreferrer"
              >
                Résumé
              </a>
            ) : null}
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm">
            {socials.map(([key, social]) => (
              <li key={key}>
                <a href={social.url} className="text-muted hover:text-accent" rel="noopener noreferrer">
                  {key}
                </a>
              </li>
            ))}
          </ul>
        </Reveal>
        <Reveal delay={120}>
          <div id="desk" className="scroll-mt-28">
            <HomeDesk />
          </div>
        </Reveal>
      </section>

      <section id="about" className="scroll-mt-28 border-b border-border/70 py-10 sm:py-16">
        <Reveal>
          <SectionLabel>01 / about</SectionLabel>
          <div className="max-w-2xl whitespace-pre-wrap text-base leading-8 text-muted">
            {AboutData.description}
          </div>
        </Reveal>
      </section>

      <section id="work" className="scroll-mt-28 border-b border-border/70 py-10 sm:py-16">
        <Reveal>
          <SectionLabel>02 / work</SectionLabel>
          <ol className="timeline">
            {experience.map((job) => {
              const { start, end } = tenureParts(job);
              const current = !job.end;
              return (
                <li
                  key={`${job.company}-${job.start.year}`}
                  className={current ? "timeline-item is-now" : "timeline-item"}
                >
                  <p className="timeline-time">
                    <span className="timeline-time-start">{start}</span>
                    <span className="timeline-time-end">{end}</span>
                  </p>
                  <span className="timeline-rail" aria-hidden="true">
                    <span className="timeline-dot" />
                  </span>
                  <div className="timeline-body">
                    <h2 className="text-lg font-semibold text-ink">
                      {job.title_full ?? job.title}
                      <span className="text-muted"> · </span>
                      {job.url ? (
                        <a href={job.url} className="hover:text-accent" rel="noopener noreferrer">
                          {job.company}
                        </a>
                      ) : (
                        job.company
                      )}
                    </h2>
                    {job.description ? (
                      <p className="mt-2 text-sm leading-7 text-muted">{job.description}</p>
                    ) : null}
                    {job.links && job.links.length > 0 ? (
                      <p className="mt-3 flex flex-wrap gap-x-4 gap-y-1 font-mono text-xs">
                        {job.links.map((link) => (
                          <a
                            key={link.url}
                            href={link.url}
                            className="text-accent hover:underline"
                            rel="noopener noreferrer"
                          >
                            {link.text}
                          </a>
                        ))}
                      </p>
                    ) : null}
                    {job.skills && job.skills.length > 0 ? (
                      <p className="mt-3 font-mono text-[11px] tracking-wide text-muted uppercase">
                        {job.skills.join("  ·  ")}
                      </p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </Reveal>
      </section>

      <section id="education" className="scroll-mt-28 border-b border-border/70 py-10 sm:py-16">
        <Reveal>
          <SectionLabel>03 / education</SectionLabel>
          <ol className="timeline">
            {educationData.map((item) => (
              <li key={item.title} className="timeline-item">
                <p className="timeline-time">
                  <span className="timeline-time-start">{item.year ?? "—"}</span>
                </p>
                <span className="timeline-rail" aria-hidden="true">
                  <span className="timeline-dot" />
                </span>
                <div className="timeline-body">
                  <h2 className="text-lg font-semibold text-ink">
                    {item.title}
                    <span className="text-muted"> · </span>
                    {item.url ? (
                      <a href={item.url} className="hover:text-accent" rel="noopener noreferrer">
                        {item.org}
                      </a>
                    ) : (
                      item.org
                    )}
                  </h2>
                  {item.detail ? (
                    <p className="mt-2 text-sm leading-7 text-muted">{item.detail}</p>
                  ) : null}
                </div>
              </li>
            ))}
          </ol>
        </Reveal>
      </section>

      <section id="projects" className="scroll-mt-28 border-b border-border/70 py-10 sm:py-16">
        <Reveal>
          <SectionLabel>04 / projects</SectionLabel>
          {liveTools.length > 0 ? (
            <>
              <p className="mb-4 font-mono text-xs tracking-wide text-muted uppercase">
                Live on this site
              </p>
              <ul className="mb-4 grid gap-4 md:grid-cols-2">
                {liveTools.map((project) => (
                  <li key={project.title} className="min-w-0">
                    <Link
                      href={project.url}
                      className="panel panel-hover flex h-full flex-col p-5"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <h2 className="text-base font-semibold text-ink">{project.title}</h2>
                        <span className="chip">live</span>
                      </div>
                      <p className="mt-2 flex-1 text-sm leading-6 text-muted">{project.description}</p>
                      <p className="mt-4 text-sm text-accent">Open {project.title} →</p>
                    </Link>
                  </li>
                ))}
              </ul>
              <p className="mb-10 text-sm text-muted">
                <Link href="/tools" className="text-accent hover:underline">
                  Browse all tools →
                </Link>
              </p>
            </>
          ) : null}
          <p className="mb-4 font-mono text-xs tracking-wide text-muted uppercase">
            Archive
          </p>
          <ul className="grid gap-4 md:grid-cols-2">
            {archive.map((project) => (
              <li key={project.title} className="panel overflow-hidden">
                {project.imagePath ? (
                  <Image
                    src={project.imagePath}
                    alt=""
                    width={640}
                    height={360}
                    className="h-40 w-full object-cover"
                  />
                ) : null}
                <div className="p-5">
                  <div className="flex items-baseline justify-between gap-3">
                    {project.url ? (
                      <a href={project.url} className="text-base font-semibold text-ink hover:text-accent" rel="noopener noreferrer">
                        {project.title}
                      </a>
                    ) : (
                      <h2 className="text-base font-semibold text-ink">{project.title}</h2>
                    )}
                    <span className="font-mono text-xs text-muted">{project.year}</span>
                  </div>
                  {project.description ? (
                    <p className="mt-2 text-sm leading-6 text-muted">{project.description}</p>
                  ) : null}
                  {project.links && project.links.length > 0 ? (
                    <p className="mt-3 flex flex-wrap gap-x-4 font-mono text-xs">
                      {project.links.map((link) => (
                        <a
                          key={link.url}
                          href={link.url}
                          className="text-accent hover:underline"
                          rel="noopener noreferrer"
                        >
                          {link.text}
                        </a>
                      ))}
                    </p>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        </Reveal>
      </section>

      <section id="tools" className="scroll-mt-28 border-b border-border/70 py-10 sm:py-16">
        <Reveal>
          <SectionLabel
            action={
              <Link
                href="/tools"
                className="shrink-0 whitespace-nowrap text-xs font-semibold text-accent hover:underline sm:text-sm"
              >
                Open the desk →
              </Link>
            }
          >
            05 / tools
          </SectionLabel>
          <p className="mb-8 max-w-2xl text-base leading-7 text-muted">
            Browser tools that stay on this machine. JSON, hashes, timestamps,
            and the same toy tape that sits on the homepage. Popular tools are
            listed below — the full desk is on /tools.
          </p>
          {tools.length > 0 ? (
            <ul
              className={`tool-grid ${
                tools.length === 3 ? "is-three" : ""
              }`}
            >
              {tools.map((tool, index) => (
                <li key={tool.slug} className="min-w-0">
                  <ToolCard tool={tool} index={index} />
                </li>
              ))}
            </ul>
          ) : null}
        </Reveal>
      </section>

      <WritingSection />
    </div>
  );
}

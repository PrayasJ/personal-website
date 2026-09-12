"use client";

import { useState } from "react";
import { BlogData, sortBlogs } from "../../../data.config";
import { Reveal } from "@/components/fx/Reveal";
import { Modal } from "@/components/ui/Modal";

type MarkdownEntry = {
  html: string;
  summary: string;
};

type MarkdownMap = Record<string, MarkdownEntry>;

import markDownHTML from "../../../loadedMarkdown.json";

const posts = markDownHTML as MarkdownMap;

export function WritingSection() {
  const blogs = sortBlogs(BlogData);
  const [openTitle, setOpenTitle] = useState<string | null>(null);
  const open = openTitle ? posts[openTitle] : null;

  return (
    <section id="writing" className="scroll-mt-28 py-10 sm:py-16">
      <Reveal>
        <div className="mb-6 flex flex-wrap items-center gap-x-4 gap-y-2 sm:mb-8">
          <p className="tape text-accent">06 / writing</p>
          <span className="h-px min-w-8 flex-1 bg-gradient-to-r from-accent/50 to-transparent" />
        </div>
        <p className="mb-6 max-w-xl text-base leading-7 text-muted sm:mb-8">
          Notes from Google Summer of Code 2022 and one piece on shipping Node
          packages. Click a row to read it here.
        </p>
        <ul className="list-stack">
          {blogs.map((blog) => (
            <li key={blog.title}>
              <button
                type="button"
                className="list-row grid w-full gap-2 px-4 py-4 text-left sm:px-5 sm:py-5 md:grid-cols-[11rem_1fr] md:gap-8"
                onClick={() => setOpenTitle(blog.title)}
              >
                <span className="font-mono text-xs tracking-wide text-muted uppercase">
                  {blog.date}
                </span>
                <span>
                  <span className="block text-lg font-semibold text-ink">{blog.title}</span>
                  {posts[blog.title]?.summary ? (
                    <span className="mt-1 block text-sm leading-6 text-muted">
                      {posts[blog.title].summary}…
                    </span>
                  ) : null}
                </span>
              </button>
            </li>
          ))}
        </ul>
      </Reveal>

      <Modal
        open={Boolean(openTitle && open)}
        onClose={() => setOpenTitle(null)}
        title={openTitle ?? "Writing"}
      >
        {open ? (
          <div
            className="blog-html"
            dangerouslySetInnerHTML={{ __html: open.html }}
          />
        ) : null}
      </Modal>
    </section>
  );
}

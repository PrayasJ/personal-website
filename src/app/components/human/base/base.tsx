"use client";
import Image from "next/image";
import styles from "./base.module.scss";

import {
  AboutData,
  BlogData,
  ExperienceInterface,
  Months,
  ProjectData,
  experienceData,
  socialData,
  sortBlogs,
  sortExperienceData,
  sortProjectData,
} from "../../../../../data.config.tsx";

import useMousePosition from "../../../../lib/useMousePosition.js";
interface BlogMarkdownInterface {
  [key: string]: {
    html: string
    summary: string
  }
}

import markDownHTML from "../../../../../loadedMarkdown.json"

import { ReactElement, RefObject, useEffect, useRef, useState } from "react";

let markDownHTMLTS = markDownHTML as BlogMarkdownInterface

export default function Base() {
  interface Section {
    title: string;
    sectionRef: RefObject<HTMLDivElement>;
  }

  type SectionList = Record<string, Section>;

  const section_list: SectionList = {
    about: {
      title: "About",
      sectionRef: useRef<HTMLDivElement>(null),
    },
    experience: {
      title: "Experience",
      sectionRef: useRef<HTMLDivElement>(null),
    },
    projects: {
      title: "Projects",
      sectionRef: useRef<HTMLDivElement>(null),
    },
    blogs: {
      title: "Blogs",
      sectionRef: useRef<HTMLDivElement>(null),
    },
  };

  const observationContainerRef: RefObject<HTMLDivElement> =
    useRef<HTMLDivElement>(null);

  const scrollTo = (ref: RefObject<HTMLDivElement>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const getTimelineString = (exp: ExperienceInterface): string => {
    let generatedString = "";
    if (exp.start.month) generatedString += `${Months[exp.start.month]} `;
    generatedString += exp.start.year;
    generatedString += " - ";
    if (exp.end) {
      if (exp.end.month) generatedString += `${Months[exp.end.month]} `;
      generatedString += exp.end.year;
    } else generatedString += "Present";
    return generatedString;
  };

  const getBlogSummary = (title: string): ReactElement => {
    
    let summary = markDownHTMLTS[title].summary;
    return (
    <div className={styles.description_blog}>
       {/* <div dangerouslySetInnerHTML={{__html: markDownHTMLTS[title]}}></div> */}
       {summary}...
    </div>
    )
  }

  const [activeSection, setActiveSection] = useState<string | null>(null); // State to track the active section
  const mousePosition = useMousePosition({ includeTouch: true });

  useEffect(() => {
    const handleScroll = () => {
      const sectionOffsets = Object.keys(section_list).map((section_key) => {
        const sectionRef = section_list[section_key].sectionRef;
        if (sectionRef && sectionRef.current) {
          const rect = sectionRef.current.getBoundingClientRect();
          return {
            id: section_key,
            top: rect.top,
          };
        }
        return null;
      });

      const visibleSections = sectionOffsets.filter(
        (offset) => offset && offset.top <= 96
      );
      if (visibleSections.length > 0) {
        const activeSectionId = visibleSections[visibleSections.length - 1]?.id;
        setActiveSection(activeSectionId || null);
      }
    };

    window.addEventListener("scroll", handleScroll);
    handleScroll(); // Initial call to set the active section on mount

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  });

  return (
    <div className={styles.human_container}>
      <div
        className={styles.cursor_follower}
        style={{
          left: `${mousePosition.x || 0}px`,
          top: `${mousePosition.y || 0}px`,
        }}
      ></div>
      <div className={styles.about_section}>
        <div className={styles.profile_detail}>
          <div className={styles.name}>{AboutData.name}</div>
          <div className={styles.byline}>{AboutData.byline}</div>
          <div className={styles.about}>{AboutData.about}</div>
        </div>

        <div className={styles.section_controller}>
          {Object.keys(section_list).map((section_key, index) => (
            <div
              key={index}
              onClick={() => {
                scrollTo(section_list[section_key].sectionRef);
              }}
              className={`${styles.controller} ${
                activeSection === section_key ? styles.active : ""
              }`} // Add 'active' class if the section is active
            >
              <div className={styles.highlighter}></div>
              <div className={styles.title_controller}>
                {section_list[section_key].title}
              </div>
            </div>
          ))}
        </div>

        <div className={styles.social_section}>
          {Object.keys(socialData).map((socialKey, index) => {
            const social = socialData[socialKey];
            return (
              <a
                key={index}
                href={social.url}
                target="_blank"
                rel="noopener noreferrer"
                className={styles.social_btn}
              >
                <Image
                  src={social.logoPath}
                  alt={socialKey}
                  width={30} // Adjust the width as needed
                  height={30} // Adjust the height as needed
                  layout="fixed"
                />
              </a>
            );
          })}
        </div>
      </div>

      <div className={styles.main_section} ref={observationContainerRef}>
        <div className={styles.section_title}>About</div>
        <div
          className={styles.description}
          ref={section_list.about.sectionRef}
          id="about"
        >
          {AboutData.description}
        </div>

        <div className={styles.section_title}>Experience</div>
        <div
          className={styles.experience_section}
          ref={section_list.experience.sectionRef}
          id="experience"
        >
          {sortExperienceData(experienceData).map((experience, index) => (
            <div
              key={index}
              className={styles.experience}
              onClick={() => {
                if (experience.url) {
                  window.open(experience.url, "_blank");
                }
              }}
            >
              <div className={styles.timeline}>
                {getTimelineString(experience)}
              </div>
              <div className={styles.experience_detail}>
                <div className={styles.title_exp}>
                  {experience.title + " · " + experience.company}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={styles.title_exp_image}
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div className={styles.title_full}>{experience.title_full}</div>
                <div className={styles.description_exp}>
                  {experience.description}
                </div>
                <div className={styles.link_container}>
                  {experience.links?.map((link, index) => (
                    <a
                      key={index}
                      className={styles.link}
                      href={link.url}
                      target="_blank"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={styles.link_image}
                        aria-hidden="true"
                      >
                        <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z"></path>
                        <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z"></path>
                      </svg>
                      {link.text}
                    </a>
                  ))}
                </div>
                <div className={styles.skill_container}>
                  {experience.skills?.map((skill, index) => (
                    <div key={index} className={styles.skill}>
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
          {AboutData.resume && (
            <a
              className={styles.resume_link}
              href={AboutData.resume}
              target="_blank"
            >
              View Full Résumé
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className={styles.resume_image}
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                  clip-rule="evenodd"
                ></path>
              </svg>
            </a>
          )}
        </div>
        <div className={styles.section_title}>Projects</div>
        <div
          className={styles.project_section}
          ref={section_list.projects.sectionRef}
          id="projects"
        >
          {sortProjectData(ProjectData).map((project, index) => (
            <div key={index} className={styles.project}>
              <div className={styles.timeline}>{project.year}</div>
              <div className={styles.project_detail}>
                <div className={styles.title_proj}>
                  {project.title}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={styles.title_proj_image}
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M5.22 14.78a.75.75 0 001.06 0l7.22-7.22v5.69a.75.75 0 001.5 0v-7.5a.75.75 0 00-.75-.75h-7.5a.75.75 0 000 1.5h5.69l-7.22 7.22a.75.75 0 000 1.06z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                <div className={styles.description_proj}>
                  {project.description}
                </div>
                <div className={styles.link_container}>
                  {project.links?.map((link, index) => (
                    <a
                      key={index}
                      className={styles.link}
                      href={link.url}
                      target="_blank"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        className={styles.link_image}
                        aria-hidden="true"
                      >
                        <path d="M12.232 4.232a2.5 2.5 0 013.536 3.536l-1.225 1.224a.75.75 0 001.061 1.06l1.224-1.224a4 4 0 00-5.656-5.656l-3 3a4 4 0 00.225 5.865.75.75 0 00.977-1.138 2.5 2.5 0 01-.142-3.667l3-3z"></path>
                        <path d="M11.603 7.963a.75.75 0 00-.977 1.138 2.5 2.5 0 01.142 3.667l-3 3a2.5 2.5 0 01-3.536-3.536l1.225-1.224a.75.75 0 00-1.061-1.06l-1.224 1.224a4 4 0 105.656 5.656l3-3a4 4 0 00-.225-5.865z"></path>
                      </svg>
                      {link.text}
                    </a>
                  ))}
                </div>
                <div className={styles.skill_container}>
                  {project.skills?.map((skill, index) => (
                    <div key={index} className={styles.skill}>
                      {skill}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
        <div className={styles.section_title}>Blogs</div>
        <div
          className={styles.blog_section}
          ref={section_list.blogs.sectionRef}
          id="blogs"
        >
          {sortBlogs(BlogData).map((blog, index) => (
            <div key={index} className={styles.blog}>
              <div className={styles.timeline}>{blog.date}</div>
              <div className={styles.blog_detail}>
                <div className={styles.title_blog}>
                  {blog.title}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className={styles.blog_image}
                    aria-hidden="true"
                  >
                    <path
                      fill-rule="evenodd"
                      d="M3 10a.75.75 0 01.75-.75h10.638L10.23 5.29a.75.75 0 111.04-1.08l5.5 5.25a.75.75 0 010 1.08l-5.5 5.25a.75.75 0 11-1.04-1.08l4.158-3.96H3.75A.75.75 0 013 10z"
                      clip-rule="evenodd"
                    ></path>
                  </svg>
                </div>
                {getBlogSummary(blog.title)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

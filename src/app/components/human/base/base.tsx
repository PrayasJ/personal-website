"use client";
import Image from "next/image";
import styles from "./base.module.scss";

import {
  AboutData,
  ExperienceInterface,
  Months,
  ProjectData,
  experienceData,
  socialData,
  sortExperienceData,
  sortProjectData,
} from "../../../../../data.config.tsx";
import { RefObject, useEffect, useRef, useState } from "react";

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

  const [activeSection, setActiveSection] = useState<string | null>(null); // State to track the active section

  useEffect(() => {
    const observerOptions = {
      rootMargin: "25% 0px 25% 0px", // Adjust this margin as needed
      threshold: 0,
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id); // Set active section when it's in view
        }
      });
    }, observerOptions);

    // Observe each section's ref
    Object.keys(section_list).forEach((section_key) => {
      const sectionRef = section_list[section_key].sectionRef;
      if (sectionRef.current) {
        sectionObserver.observe(sectionRef.current);
      }
    });

    // Clean up the observer
    return () => {
      sectionObserver.disconnect();
    };
  }, []); // Empty dependency array to run once on mount

  return (
    <div className={styles.human_container}>
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

      <div className={styles.main_section}>
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
            <div key={index} className={styles.experience}>
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
                    <a key={index} className={styles.link} href={link.url}>
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
        </div>
        <div className={styles.section_title}>Projects</div>
        <div
          className={styles.project_section}
          ref={section_list.projects.sectionRef}
          id="project"
        >
          {sortProjectData(ProjectData).map((project, index) => (
            <div key={index} className={styles.project}>
              <div className={styles.timeline}>
                {project.year}
              </div>
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
                    <a key={index} className={styles.link} href={link.url}>
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
      </div>
    </div>
  );
}

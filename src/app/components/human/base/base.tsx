import Image from "next/image";
import styles from "./base.module.scss";

import {
	AboutData,
	experienceData,
	socialData,
	sortExperienceData,
} from "../../../../../data.config.tsx";

const section_list = ["About", "Experience", "Projects", "Blogs"];

export default function Base() {

	return (
		<div className={styles.human_container}>
			<div className={styles.about_section}>
				<div className={styles.profile_detail}>
					<div className={styles.name}>{AboutData.name}</div>
					<div className={styles.byline}>{AboutData.byline}</div>
					<div className={styles.about}>{AboutData.about}</div>
				</div>

				<div className={styles.secton_controller}>
					{section_list.map((section_title, index) => (
						<div key={index} className={styles.controller}>
							<div className={styles.highlighter}></div>
							<div className={styles.title}>{section_title}</div>
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
								className={styles.social_link}
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
				<div className={styles.description}>{AboutData.description}</div>

				<div className={styles.experience_section}>
					{sortExperienceData(experienceData).map((experience, index) => (
						<div key={index} className={styles.experience}>
							<div className={styles.timeline}>
								{experience.start + ' - ' + (experience.end || 'Present')}
							</div>
							<div className={styles.experience_detail}>
								<div className={styles.title}>{experience.title}</div>
								<div className={styles.title_full}>{experience.title_full}</div>
								<div className={styles.description}>{experience.description}</div>
								<div className={styles.link_container}>
									{experience.links?.map((link, index) => (
										<a key={index} className={styles.link} href={link.url}>
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
			</div>
		</div>
	);
}

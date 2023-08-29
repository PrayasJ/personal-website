/*

INTERFACE DEFINITIONS

*/

interface AboutInterface {
    name: any
    byline?: any
    about?: any
    description: any
}

interface UrlImage {
    logoPath: string
    url: string
}

interface UrlText {
    text?: string
    url: string
}

interface SocialInterface {
    [key: string]: UrlImage
}

interface ExperienceInterface {
    start: number
    end?: number
    url?: string
    title: string
    title_full?: string
    company: string
    description?: string
    links?: UrlText[]
    skills?: string[]
}

interface ProjectInterface {
    url?: string
    title: string
    description?: string
    links?: UrlText[]
    skills?: string[]
    image?: UrlImage
    year: number
}

interface BlogInterface {
    title: string
    date: string
    filePath: string
}

/*

DATA DEFINITIONS

*/

export const AboutData: AboutInterface = {
    name: 'Prayas Jain',
    byline: 'Lorem Ipsum1',
    about: 'Lorem Ipsum2',
    description: `Back in 2012, I decided to try my hand at creating custom Tumblr themes and tumbled head first into the rabbit hole of coding and web development. Fast-forward to today, and I’ve had the privilege of building software for an advertising agency, a start-up, a student-led design studio, and a huge corporation.
    My main focus these days is building products and leading projects for our clients at Upstatement. In my free time I've also released an online video course that covers everything you need to know to build a web app with the Spotify API. 
    When I’m not at the computer, I’m usually rock climbing, hanging out with my wife and two cats, or running around Hyrule searching for Korok seeds.`
}

export const socialData: SocialInterface = {
    github: {
        url: 'https://github.com/PrayasJ',
        logoPath: require('./public/social_icons/github.svg'),
    },
    linkedin: {
        url: 'https://www.linkedin.com/in/prayasj',
        logoPath: require('./public/social_icons/linkedin.svg'),
    },
    instagram: {
        url: 'https://instagram.com/_.prayas._',
        logoPath: require('./public/social_icons/instagram.svg'),
    }
}

export const experienceData: ExperienceInterface[] = [
    {
        start: 2022,
        company: 'Apricot Planet',
        title: 'Senior Fullstack Developer',
        skills: ['a', 'b', 'c', 'd'],
    }
]

export const ProjectData: ProjectInterface[] = [
    {
        title: 'DataToolBelt',
        description: '',
        year: 2022
    }
]

export const BlogData: BlogInterface[] = [
    {
        title: 'Selection to GSoC',
        filePath: './blogs/GSoC - Week 1.md',
        date: 'May 22, 2022'
    },
    {
        title: 'Understanding Portal Project',
        filePath: './blogs/GSoC - Week 2-3.md',
        date: 'June 13, 2022'
    },
    {
        title: 'Parallel Processing in R',
        filePath: './blogs/GSoC - Week 4-5.md',
        date: 'June 25, 2022'
    },
    {
        title: 'Parallel Casting Function',
        filePath: './blogs/GSoC - Week 6.md',
        date: 'July 2, 2022'
    },
    {
        title: 'Creating Node.js Packages',
        filePath: './blogs/Creating Node.js packages.md',
        date: 'July 11, 2022'
    },
    {
        title: 'Add Windows Support',
        filePath: './blogs/GSoC - Week 7-8.md',
        date: 'July 16, 2022'
    },
    {
        title: 'Testing the Project\'s Performance',
        filePath: './blogs/GSoC - Week 9-10.md',
        date: 'August 5, 2022'
    },
    {
        title: 'Adding Documentation',
        filePath: './blogs/GSoC - Week 11-12.md',
        date: 'August 18, 2022'
    },
    {
        title: 'GSoC Final Report',
        filePath: './blogs/GSoC Final Report.md',
        date: 'August September 11, 2022'
    }
]

function compareExperience(a: ExperienceInterface, b: ExperienceInterface): number {
    if (a.end === undefined && b.end === undefined) {
        // Both have no end date, sort by descending start date
        return b.start - a.start;
    }
    if (a.end === undefined) {
        // Only a has no end date, place it before b
        return -1;
    }
    if (b.end === undefined) {
        // Only b has no end date, place it before a
        return 1;
    }
    // Both have end dates, sort by descending end date, then by descending start date
    if (a.end !== b.end) {
        return b.end - a.end;
    }
    return b.start - a.start;
}

export function sortExperienceData(data: ExperienceInterface[]): ExperienceInterface[] {
    return data.slice().sort(compareExperience);
}
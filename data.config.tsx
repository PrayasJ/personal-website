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

export interface ExperienceInterface {
    start: {
        year: number
        month?: number
    }
    end?: {
        year: number
        month?: number
    }
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

export const Months: { [key: number]: string } = {
    1: 'January',
    2: 'February',
    3: 'March',
    4: 'April',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'August',
    9: 'September',
    10: 'October',
    11: 'November',
    12: 'December'
}

/*

DATA DEFINITIONS

*/

export const AboutData: AboutInterface = {
    name: 'Prayas Jain',
    byline: 'Senior Fullstack Developer',
    about: 'I love creating fullstack applications and am very passionate about it.',
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
        start: {
            year: 2023,
            month: 3,
        },
        company: 'Apricot Planet',
        title: 'SDE',
        title_full: 'Senior Fullstack Developer',
        links: [],
        skills: ['React', 'React Native', 'SCSS', 'Wordpress', 'Javascript', 'Typescript', 'PHP'],
    },
    {
        start: {
            year: 2022,
            month: 6
        },
        end: {
            year: 2023,
            month: 3
        },
        company: 'Imarticus Learning',
        title: 'SDE',
        title_full: 'Fullstack Developer',
        description: 'Accessible through the Imarticus Learning mobile app for iOS and Android as well as the website, Pegasus supports classes and assessment schedules for multiple time zones.',
        skills: ['React.js', 'Angular.js', 'SCSS', 'Mongo', 'Express', 'RabbitMQ', 'Redis'],
    },
    {
        start: {
            year: 2022,
            month: 5,
        },
        end: {
            year: 2022,
            month: 9
        },
        company: 'Google Summer of Code',
        title: 'Intern',
        title_full: 'Student Developer - Weecology',
        description: 'The aim of this project is to make the currently running forecasting system capable of parallelization.',
        skills: ['R', 'Multiprocessing', 'git']
    },
    {
        start: {
            year: 2021,
            month: 9,
        },
        end: {
            year: 2021,
            month: 12,
        },
        company: 'Codecrust',
        title: 'Game Developer',
        title_full: 'Pixi.js Game Developer',
        description: 'CodeCrust is a Game development company specializing in Multiplayer Mobile and HTML5 game development.',
        skills: ['Node.js', 'Pixi.js'],
    },
    {
        start: {
            year: 2020,
            month: 2,
        },
        end: {
            year: 2020,
            month: 5,
        },
        company: 'Dev-up',
        title: 'Fullstack Developer',
        description: 'evUp is an In-house tech team quality development, at the price and time of no-code platforms.',
        skills: ['Python', 'Node.js', 'Flutter']
    },
    {
        start: {
            year: 2019,
            month: 12,
        },
        end: {
            year: 2020,
            month: 5,
        },
        company: 'GeeksForGeeks',
        title: 'Intern',
        title_full: 'Technical Content Writer',
        description: 'Content writing focused over multiple areas of graphical programming. Mostly revolving around the common topic of fractals and optimized methods to make them.',
        skills: ['C++', 'Fractals']
    }
]

export const ProjectData: ProjectInterface[] = [
    {
        title: 'DataToolBelt',
        description: `The DataToolBelt frontend provides the following features:
        A file manager for uploading, downloading, and deleting files
        A table viewer for displaying data in a tabular format
        A charting tool for creating charts and graphs from data
        A SQL editor for writing and executing SQL queries
        A machine learning tool for training and deploying machine learning models`,
        year: 2022,
        skills: ['Python', 'Flask', 'Numpy', 'Matplotlib', 'Node.js', 'React.js', 'SASS', 'Typescript', 'Jquery', 'LottieFiles', 'Nginx'],
    },
    {
        title: 'Poll Analysis',
        description: 'Goal behind this project is to collect the social media tweets from a month before the poll and to analyze it through various perspectives.',
        year: 2022,
        skills: ['Python', 'Pickle', 'NLTK', 'Matplotlib', 'Tweepy'],
    },
    {
        title: 'MyVirtualStream',
        description: `MyVirtualStream is a Flask powered web application which utilizes the capabilities
        of FFmpeg to bring about a 24/7 Streaming scheduler similar to those that are
        used by TV channels.
        It’s capable of modifying videos and scheduling them to stream over RTMP`,
        year: 2021,
        skills: ['Python', 'Flask', 'FFmpeg', 'Jquery', 'Shell', 'Nginx', 'Firebase']
    },
    {
        title: 'Diiju',
        description: `This Diiju is utility Link is to convert all UI based elements into the our own Diiju
        format (dju).`,
        year: 2021,
        skills: ['Node.js', 'Typescript', 'Python'],
    },
    {
        title: 'Project Seek',
        description: `Implemented using Godot as the Game Engine, OAuth and Firebase while Python with Websockets for game server while Heroku for deploying the server.
        Top Down Strategic Shooter with a PvP model.
        Room creation with users equally divided on the basis of level.`,
        year: 2021,
        skills: ['Godot', 'Websocket', 'Python', 'Flask', 'OAuth2', 'Heroku', 'Firebase'],
    },
    {
        title: 'Admissio',
        description: 'With Admissio, you can compile a list of colleges that will allow you to explore all options and find the right college and course.',
        year: 2020,
        skills: ['Node.js', 'React.js'],
    },
    {
        title: 'SafeSIS',
        description: `SafeSIS is an android app made with the usage of Flutter and Firebase. A
        server was also generated using python which handled multiple requests.
        The motive of the app was to generate an SOS application.`,
        year: 2020,
        skills: ['Python', 'Flutter', 'Firebase'],
    },
    {
        title: 'Rainbow Dash',
        description: 'Rainbow Dash is an indie game developed solo. It\'s a casual game with a procedural level generator.',
        year: 2020,
        skills: ['Godot'],
    },
    {
        title: 'Blinded',
        description: 'Blinded was a solo project with a procedural map generation with action and gore in a top down environment.',
        year: 2020,
        skills: ['Godot'],
    },
    {
        title: 'Bouncy Walls Vs. Ninja',
        description: `Game powered by Godot Engine. The 2D game had used the physics capabilities of Godot to make a pocket tank like functionality`,
        year: 2019,
        skills: ['Godot'],
    },
    {
        title: 'Greenable',
        description: `Greenable was a project which allowed it's users to generate event tags geologically and add them to a common database for everyone.`,
        year: 2019,
        skills: ['Python', 'Flask', 'Heroku'],
    },
    {
        title: 'Symbiosis',
        description: `A 2D game with Asteroids-like mechanism made completely with C. The engine was made from scratch by me.`,
        year: 2018,
        skills: ['C', 'MS-DOS'],
    },
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
    if (!a.end && !b.end) {
        // Both have no end date, sort by descending start date
        return b.start.year - a.start.year || (b.start.month || 0) - (a.start.month || 0);
    }
    if (!a.end) {
        // Only a has no end date, place it before b
        return -1;
    }
    if (!b.end) {
        // Only b has no end date, place it before a
        return 1;
    }
    // Both have end dates, sort by descending end date, then by descending start date
    if (a.end.year !== b.end.year) {
        return b.end.year - a.end.year || (b.end.month || 0) - (a.end.month || 0);
    }
    if (a.end.month !== b.end.month) {
        return (b.end.month || 0) - (a.end.month || 0);
    }
    return b.start.year - a.start.year || (b.start.month || 0) - (a.start.month || 0);
}

export function sortExperienceData(data: ExperienceInterface[]): ExperienceInterface[] {
    return data.slice().sort(compareExperience);
}

function compareProjects(a: ProjectInterface, b: ProjectInterface): number {
    return b.year - a.year || (b.title.localeCompare(a.title));
}

export function sortProjectData(data: ProjectInterface[]): ProjectInterface[] {
    return data.slice().sort(compareProjects);
}
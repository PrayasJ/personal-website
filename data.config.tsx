/*

INTERFACE DEFINITIONS

*/

interface AboutInterface {
    name: any
    byline?: any
    about?: any
    description: any
    resume?: any
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
    year: number
    imagePath?: string
}

interface BlogInterface {
    title: string
    date: string
    filePath: string
}

export const Months: { [key: number]: string } = {
    1: 'Jan',
    2: 'Feb',
    3: 'Mar',
    4: 'Apr',
    5: 'May',
    6: 'June',
    7: 'July',
    8: 'Aug',
    9: 'Sept',
    10: 'Oct',
    11: 'Nov',
    12: 'Dec'
}

/*

DATA DEFINITIONS

*/

export const AboutData: AboutInterface = {
    name: 'Prayas Jain',
    byline: 'Senior Fullstack Developer',
    about: 'I build accessible, inclusive products & digital experiences for web and mobile.',
    description: `In 2018, I embarked on my developer journey with a deep dive into the intricacies of the C programming language, where I initially recreated the classic game, Asteroids, using just a few lines of code.\n\n` +
    `This endeavor ignited my passion for software development and led me on a path where I constantly seek to simplify and automate various aspects of my life. Since then, I've honed my skills and expanded my toolkit. I've delved into modern web and mobile app development, mastering technologies such as React and React Native to build intuitive user interfaces. In the realm of web application frameworks, I've become proficient in Django, a robust Python framework, as well as Next.js and Express, JavaScript frameworks that have enabled me to craft dynamic and responsive web applications.\n\n` + 
    `Yet, despite my ongoing quest for perfection, I've learned to balance the pursuit of excellence with practicality, recognizing that completion is as vital as perfection. My journey as a developer is marked by a continuous commitment to mastering new skills and creating solutions that are both elegant and functional.`,
    resume: '/resume.pdf',
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
    },
    email: {
        url: 'mailto:prayas.jn24@gmail.com',
        logoPath: require('./public/social_icons/email.svg'),
    }
}

export const experienceData: ExperienceInterface[] = [
    {
        start: {
            year: 2035,
            month: 7,
        },
        company: 'Zanskar Research Pvt. Ltd.',
        title: 'SDE',
        title_full: 'Software Developer',
        url: 'https://www.nubra.io',
        description: 'Develop and maintain OMS service for Nubra platform.',
        links: [
            {
                url: 'https://www.nubra.io', 
                text: 'Nubra - Homepage'
            },
            {
                url: 'https://play.google.com/store/apps/details?id=com.zanskar.nubra', 
                text: 'Nubra - Android'
            },
            {
                url: 'https://apps.apple.com/in/app/nubra-stocks-option-trading/id6746636699', 
                text: 'Nubra - iOS'
            }
        ],
        skills: ['git', 'golang', 'rpc', 'hft', 'rdp', 'oms', 'shell'],
    },
    {
        start: {
            year: 2023,
            month: 3,
        },
        end: {
            year: 2205,
            month: 7,
        },
        company: 'Apricot Planet',
        title: 'SDE',
        title_full: 'Senior Fullstack Developer',
        url: 'https://www.workjapan.jp',
        description: 'Develop and maintain frontend apps and backend server for Workjapan, including periodic mobile app releases and implementing redesigns.',
        links: [
            {
                url: 'https://www.workjapan.jp/foreigners-home/', 
                text: 'WJ - Webapp'
            },
            {
                url: 'https://play.google.com/store/apps/details?id=jp.workjapan.home', 
                text: 'WJ - Android'
            },
            {
                url: 'https://apps.apple.com/in/app/work-japan-jobs-in-japan/id1303011529/', 
                text: 'WJ - iOS'
            },
            {
                url: 'https://employer.workjapan.jp/',
                text: 'WJ - Employer Dashboard'
            }
        ],
        skills: ['git', 'Python', 'Django', 'Docker', 'React', 'React Native', 'SCSS', 'Wordpress', 'Javascript', 'Typescript', 'PHP'],
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
        url: 'https://imarticus.org/',
        description: 'Accessible through the Imarticus Learning mobile app for iOS and Android as well as the website, Pegasus supports classes and assessment schedules for multiple time zones.',
        links: [
            {
                url: 'https://pegasus.imarticus.org/', 
                text: 'Imarticus - Pegasus'
            },
            {
                url: 'https://teach.pegasus.imarticus.org/',
                text: 'Imarticus - Admin Panel'
            }
        ],
        skills: ['git', 'Next.js', 'React.js', 'Angular.js', 'SCSS', 'Mongo', 'Express', 'RabbitMQ', 'Redis'],
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
        url: 'https://summerofcode.withgoogle.com/archive/2022/projects/qBazQsVJ',
        description: 'This project would involve the parallelization of the code base to allow for running on multiple cores both on individual machines and HPCs.',
        links: [
            {
                url: 'https://github.com/weecology/retriever', 
                text: 'Organization - NumFOCUS (Data Retriever)'
            },
            {
                url: 'https://github.com/weecology/retriever/wiki/GSoC-2022-Project-Ideas#high-performance-parallel-computing-for-model-fitting-and-prediction-in-portalcasting',
                text: 'Project Link'
            }
        ],
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
        url: 'https://www.linkedin.com/company/codecrust/',
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
        company: 'Dev-Up',
        title: 'Fullstack Developer',
        description: 'Dev-Up is an In-house tech team quality development, at the price and time of no-code platforms.',
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
        url: 'https://datatoolbelt.netlify.app/',
        links: [
            {
                url: 'https://github.com/dassaniansh/Datatoolbelt',
                text: 'Github - Backend'
            },
            {
                url: 'https://github.com/PrayasJ/DataToolBelt-Frontend',
                text: 'Github - Frontend'
            }
        ],
        imagePath: require('./public/images/datatoolbelt.png'),
        title: 'DataToolBelt',
        description: `The DataToolBelt frontend provides the following features:
        A file manager for uploading, downloading, and deleting files
        A table viewer for displaying data in a tabular format
        A charting tool for creating charts and graphs from data`,
        year: 2023,
        skills: ['Python', 'Flask', 'Numpy', 'Matplotlib', 'Node.js', 'React.js', 'SASS', 'Typescript', 'Jquery', 'LottieFiles', 'Nginx'],
    },
    {
        url: 'https://github.com/PrayasJ/PollAnalysis',
        links: [
            {
                url: 'https://github.com/PrayasJ/PollAnalysis',
                text: 'Project Repository'
            }
        ],
        title: 'Poll Analysis',
        description: 'Goal behind this project is to collect the social media tweets from a month before the poll and to analyze it through various perspectives.',
        year: 2022,
        skills: ['Python', 'Pickle', 'NLTK', 'Matplotlib', 'Tweepy'],
    },
    {
        url: 'https://drive.google.com/file/d/1zyMI9JaOi4W_ennCHtPcRsrBdkFrkn8f/view?usp=sharing',
        links: [
            {
                url: 'https://drive.google.com/file/d/1zyMI9JaOi4W_ennCHtPcRsrBdkFrkn8f/view?usp=sharing',
                text: 'Demo Video'
            }
        ],
        imagePath: require('./public/images/mvs.png'),
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
        url: 'https://github.com/PrayasJ/Project_Seek',
        links: [
            {
                text: 'Github - Client & Server',
                url: 'https://github.com/PrayasJ/Project_Seek'
            }
        ],
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
        url: 'https://percyx.itch.io/rainbow-dash',
        links: [
            {
                url: 'https://percyx.itch.io/rainbow-dash',
                text: 'Itch.io - Game'
            },
            {
                url: 'https://drive.google.com/file/d/1o8lGmyV0qnf4KNJsOJOI70PMSBQaSs0k/view?usp=sharing',
                text: 'Rainbow Dash - Gameplay'
            }
        ],
        imagePath: require('./public/images/rainbow-dash.png'),
        title: 'Rainbow Dash',
        description: 'Rainbow Dash is an indie game developed solo. It\'s a casual game with a procedural level generator.',
        year: 2020,
        skills: ['Godot'],
    },
    {
        url: 'https://drive.google.com/file/d/1F5iAgaruyq3_5J9_6ugMVVmD4rDYUXPU/view?usp=sharing',
        links: [
            {
                url: 'https://drive.google.com/file/d/1F5iAgaruyq3_5J9_6ugMVVmD4rDYUXPU/view?usp=sharing',
                text: 'Demo Video'
            }
        ],
        imagePath: require('./public/images/blinded.png'),
        title: 'Blinded',
        description: 'Blinded was a solo project with a procedural map generation with action and gore in a top down environment.',
        year: 2020,
        skills: ['Godot'],
    },
    {
        url: 'https://drive.google.com/file/d/1ij2WKLJ67rh6uvSPmytjzUIeqBIX9hjU/view?usp=sharing',
        links: [
            {
                url: 'https://drive.google.com/file/d/1ij2WKLJ67rh6uvSPmytjzUIeqBIX9hjU/view?usp=sharing',
                text: 'Demo Video'
            }
        ],
        imagePath: require('./public/images/bwvn.png'),
        title: 'Bouncy Walls Vs. Ninja',
        description: `Game powered by Godot Engine. The 2D game had used the physics capabilities of Godot to make a pocket tank like functionality`,
        year: 2019,
        skills: ['Godot'],
    },
    {
        url: 'https://drive.google.com/file/d/1pP-xzrS43DePO-Hj5r0vqoJ_C37NWrFP/view?usp=sharing',
        links: [
            {
                url: 'https://drive.google.com/file/d/1pP-xzrS43DePO-Hj5r0vqoJ_C37NWrFP/view?usp=sharing',
                text: 'Demo Video'
            }
        ],
        imagePath: require('./public/images/greenable.png'),
        title: 'Greenable',
        description: `Greenable was a project which allowed it's users to generate event tags geologically and add them to a common database for everyone.`,
        year: 2019,
        skills: ['Python', 'Flask', 'Heroku'],
    },
    {
        url: 'https://drive.google.com/file/d/1HHFBt5CboWZ3yN5w9dL430IXHe-NYD6n/view?usp=sharing',
        links: [
            {
                url: 'https://drive.google.com/file/d/1HHFBt5CboWZ3yN5w9dL430IXHe-NYD6n/view?usp=sharing',
                text: 'Demo Video'
            }
        ],
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
        date: 'September 11, 2022'
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

function compareBlogsDescending(blog1: BlogInterface, blog2: BlogInterface): number {
    const date1 = new Date(blog1.date);
    const date2 = new Date(blog2.date);
    
    if (date1 > date2) {
        return -1;
    } else if (date1 < date2) {
        return 1;
    }
    
    return 0;
}

export function sortBlogs(data: BlogInterface[]): BlogInterface[] {
    return data.slice().sort(compareBlogsDescending);
}

/**
 * Single source of truth for all portfolio content.
 * Only information explicitly provided by Avika lives here.
 * Missing information is intentionally marked "To be added" / "Coming soon".
 */

export const PLACEHOLDER = "To be added" as const;
export const COMING_SOON = "Coming soon" as const;

export const profile = {
  name: "Avika Nigam",
  shortName: "AVIKA",
  initials: "AN",
  label: "AI • BUILDING • CREATING",
  greeting: "Hi, I'm Avika.",
  headline: "AI Engineer in the Making.",
  supporting:
    "I learn by building, experiment with emerging technology, and turn ideas into practical AI-powered products.",
  avatarHelper: "Ask me about my projects, skills, journey or goals.",
  motto: ["I BUILD.", "I LEARN.", "I LEAD."],
  seoTitle: "Avika Nigam — AI Engineer in the Making",
  seoDescription:
    "Interactive portfolio of Avika Nigam — BCA student and AI/ML learner building practical AI-powered products. Explore projects, skills and journey.",
} as const;

export const navLinks = [
  { id: "about", label: "About" },
  { id: "skills", label: "Skills" },
  { id: "projects", label: "Projects" },
  { id: "journey", label: "Journey" },
  { id: "contact", label: "Contact" },
] as const;

export const aboutStatement = "Learning technology by building with it.";

export type AboutCard = {
  title: string;
  body: string;
  icon: "book" | "school" | "brain" | "code" | "box" | "trophy" | "users" | "rocket";
};

export const aboutCards: AboutCard[] = [
  {
    title: "BCA Student",
    body: "Currently pursuing a Bachelor of Computer Applications, building my core computer science foundation.",
    icon: "book",
  },
  {
    title: "PSIT College of Higher Education",
    body: "Studying at PSIT College of Higher Education, where most of my building and team work happens.",
    icon: "school",
  },
  {
    title: "2nd Year",
    body: "Early in the journey — deliberately using these years to build, break and rebuild real things.",
    icon: "rocket",
  },
  {
    title: "AI / ML Focus",
    body: "My main learning direction: machine learning, NLP and the fundamentals behind modern AI systems.",
    icon: "brain",
  },
  {
    title: "Software Development",
    body: "Writing code across Python, C/C++ and the web so my AI ideas can actually ship as usable software.",
    icon: "code",
  },
  {
    title: "AI Product Development",
    body: "Thinking in products, not just models — problem, user, interface and the smallest useful version.",
    icon: "box",
  },
  {
    title: "Hackathons & Ideathons",
    body: "I use hackathons and ideathons as deadlines that force ideas into working prototypes.",
    icon: "trophy",
  },
  {
    title: "Leadership",
    body: "I've led teams and taken responsibility in college technology activities and events.",
    icon: "users",
  },
  {
    title: "Looking Ahead",
    body: "Long-term interest in AI engineering and, eventually, building an AI-focused venture of my own.",
    icon: "rocket",
  },
];

export type Proficiency = "Foundation" | "Building" | "Learning";

export type SkillGroupData = {
  id: string;
  title: string;
  caption: string;
  accent: "pink" | "magenta" | "violet" | "orange" | "yellow";
  skills: { name: string; level: Proficiency }[];
};

export const skillGroups: SkillGroupData[] = [
  {
    id: "programming",
    title: "Programming",
    caption: "Core languages I write and think in.",
    accent: "pink",
    skills: [
      { name: "Python", level: "Building" },
      { name: "C", level: "Foundation" },
      { name: "C++", level: "Foundation" },
    ],
  },
  {
    id: "web",
    title: "Web",
    caption: "How I put interfaces in front of ideas.",
    accent: "magenta",
    skills: [
      { name: "HTML", level: "Foundation" },
      { name: "CSS", level: "Foundation" },
      { name: "JavaScript", level: "Building" },
      { name: "Streamlit", level: "Building" },
      { name: "React", level: "Learning" },
    ],
  },
  {
    id: "ai-ml",
    title: "AI / ML",
    caption: "The technical core of my learning direction.",
    accent: "violet",
    skills: [
      { name: "Machine Learning", level: "Building" },
      { name: "Scikit-learn", level: "Building" },
      { name: "NLP", level: "Learning" },
      { name: "Neural Networks", level: "Learning" },
      { name: "Deep Learning fundamentals", level: "Learning" },
    ],
  },
  {
    id: "genai",
    title: "Generative AI",
    caption: "Where most of my current experimentation happens.",
    accent: "orange",
    skills: [
      { name: "LLMs", level: "Building" },
      { name: "Generative AI", level: "Building" },
      { name: "Prompt Engineering", level: "Building" },
      { name: "Conversational AI", level: "Building" },
      { name: "AI Agents", level: "Learning" },
      { name: "RAG concepts", level: "Learning" },
      { name: "Embeddings concepts", level: "Learning" },
    ],
  },
  {
    id: "data",
    title: "Data",
    caption: "Reading the data before trusting the model.",
    accent: "yellow",
    skills: [
      { name: "SQL", level: "Foundation" },
      { name: "Excel", level: "Foundation" },
      { name: "Power BI", level: "Learning" },
      { name: "EDA fundamentals", level: "Building" },
      { name: "Data visualization", level: "Building" },
    ],
  },
  {
    id: "tools",
    title: "Tools",
    caption: "The workbench I build and ship from.",
    accent: "pink",
    skills: [
      { name: "Git", level: "Building" },
      { name: "GitHub", level: "Building" },
      { name: "VS Code", level: "Building" },
      { name: "PyCharm", level: "Building" },
      { name: "Cursor", level: "Building" },
      { name: "Lovable", level: "Building" },
      { name: "Canva", level: "Building" },
      { name: "Streamlit Cloud", level: "Foundation" },
    ],
  },
];

export type Project = {
  id: string;
  name: string;
  category: string;
  status: string;
  problem: string;
  solution: string;
  tech: string[];
  learned: string;
  githubUrl: string | null;
  liveUrl: string | null;
  accent: "pink" | "magenta" | "violet" | "orange" | "yellow";
};

export const projects: Project[] = [
  {
    id: "ai-hospital-triage",
    name: "AI Hospital Triage & Health Assistant",
    category: "AI / ML • Healthcare",
    status: "Prototype / MVP",
    problem:
      "People arriving at a hospital rarely know how urgent their condition is or which department they should go to, which slows down the people who need help fastest.",
    solution:
      "A machine learning assistant that reads patient information and symptoms to predict an urgency category — Emergency, Urgent or Routine — recommends the relevant department, and provides basic first-aid guidance while help is arranged.",
    tech: ["Python", "Machine Learning", "Scikit-learn", "Streamlit"],
    learned:
      "How to frame a real-world problem as a classification task, and how much careful data handling and honest evaluation matter when the output is health-related.",
    githubUrl: null,
    liveUrl: null,
    accent: "pink",
  },
  {
    id: "career-compass",
    name: "Career Compass",
    category: "AI / Career Guidance",
    status: "Project / prototype development",
    problem:
      "Students often choose career directions from pressure and guesswork instead of a clear view of their own interests, skills and strengths.",
    solution:
      "A guidance tool that helps users explore possible career directions based on their interests, skills, strengths and goals, turning a vague question into structured options worth exploring.",
    tech: ["AI", "ML concepts", "GenAI / LLM concepts", "Web app concepts"],
    learned:
      "Designing for guidance rather than answers — the interface has to stay honest about uncertainty instead of pretending to predict someone's future.",
    githubUrl: null,
    liveUrl: null,
    accent: "violet",
  },
  {
    id: "grahni-sakhi",
    name: "Grahni Sakhi",
    category: "AI / Voice AI / Smart Home",
    status: "Currently developing",
    problem:
      "A lot of household work in Indian homes is invisible mental load — grocery lists, refills, bills, gas bookings, budgets — and most software for it assumes English and a comfortable relationship with apps.",
    solution:
      "A voice companion for Indian homemakers: grocery lists, refill, task, bill and gas-booking reminders, recipe suggestions from available ingredients, and household expense and budget tracking — with multilingual support for Hindi, Marathi, Tamil and Bengali. The longer-term vision is a mobile app, and eventually a smart-home device direction.",
    tech: [
      "AI",
      "Voice AI",
      "Conversational AI",
      "NLP",
      "Generative AI",
      "Multilingual AI",
    ],
    learned:
      "That voice-first and multilingual design is a product decision before it is a technical one, and that the people you build for should shape the interface.",
    githubUrl: null,
    liveUrl: null,
    accent: "orange",
  },
];

export type Milestone = {
  id: string;
  title: string;
  detail: string;
  tag?: string;
  state: "past" | "current" | "future";
};

export const milestones: Milestone[] = [
  {
    id: "bca",
    title: "BCA",
    detail:
      "Started a Bachelor of Computer Applications at PSIT College of Higher Education — the starting point for everything else here.",
    state: "past",
  },
  {
    id: "programming",
    title: "Programming Foundations",
    detail:
      "Built up the basics with C, C++ and Python: logic, structure, and getting comfortable being wrong before being right.",
    state: "past",
  },
  {
    id: "ai-ml-learning",
    title: "AI / ML Learning",
    detail:
      "Moved into machine learning, Scikit-learn, NLP and deep learning fundamentals as my main learning direction.",
    state: "past",
  },
  {
    id: "ai-ml-projects",
    title: "AI / ML Projects",
    detail:
      "Started turning what I learned into working prototypes instead of notebooks that stop at accuracy scores.",
    state: "past",
  },
  {
    id: "tech-expo",
    title: "College Tech Expo",
    detail:
      "Led a team at the college tech expo — scoping the idea, splitting the work and presenting the build.",
    tag: "Team Leader",
    state: "past",
  },
  {
    id: "top-10",
    title: "Top 10 Teams",
    detail: "Our team was placed among the top 10 teams.",
    state: "past",
  },
  {
    id: "iks-cell",
    title: "Technical Head, IKS Cell",
    detail:
      "Served as Technical Head of the IKS Cell, taking responsibility for the technical side of activities.",
    tag: "Former",
    state: "past",
  },
  {
    id: "sih-2026",
    title: "Smart India Hackathon 2026",
    detail:
      "Currently participating — using the hackathon as a deadline to push an idea into something real.",
    tag: "Currently Participating",
    state: "current",
  },
  {
    id: "ideathon-2026",
    title: "Ideathon 2026",
    detail:
      "Currently participating, working on framing problems worth solving before jumping to solutions.",
    tag: "Currently Participating",
    state: "current",
  },
  {
    id: "ai-engineering",
    title: "AI Engineering",
    detail:
      "Where I'm heading: becoming an AI engineer who can take a system from data to a deployed, usable product.",
    tag: "Next",
    state: "future",
  },
  {
    id: "ai-product-building",
    title: "AI Product Building",
    detail:
      "The longer horizon: building AI products of my own, with an eye on entrepreneurship.",
    tag: "Next",
    state: "future",
  },
];

export const whatIBring = [
  {
    number: "01",
    title: "BUILD",
    body: "I turn ideas into practical prototypes.",
    accent: "pink" as const,
  },
  {
    number: "02",
    title: "LEARN",
    body: "I continuously strengthen my technical foundation.",
    accent: "magenta" as const,
  },
  {
    number: "03",
    title: "LEAD",
    body: "I've led teams and taken responsibility in technology activities.",
    accent: "violet" as const,
  },
  {
    number: "04",
    title: "ADAPT",
    body: "I use modern AI tools to learn, prototype and build faster.",
    accent: "orange" as const,
  },
];

export const contact = {
  headline: "LET'S BUILD SOMETHING.",
  supporting:
    "Interested in AI, technology, products, or building something meaningful?",
  links: {
    github: { label: "GitHub", url: "https://github.com/avikanigam01" },
    linkedin: {
  label: "LinkedIn",
  url: "https://www.linkedin.com/in/avika-nigam-1b443a381/",
},

email: {
  label: "Email",
  url: "mailto:avikanigam01@gmail.com",
},
  },
} as const;

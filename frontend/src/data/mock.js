// Mock data for AI Career Pathfinder
export const mockCareerPaths = {
  "technology and innovation": [
    {
      id: 1,
      title: "AI/Machine Learning Engineer",
      persona: {
        title: "Meet Your Future Self",
        description: "You're Maya Chen, a 28-year-old AI Engineer at Google DeepMind. You spend your days designing neural networks that can understand human emotions and help doctors diagnose mental health conditions. Your breakthrough algorithm for early depression detection has already helped thousands of patients worldwide."
      },
      dayInLife: {
        title: "A Day in Your Life",
        description: "7:00 AM: Start with coffee and the latest AI research papers. 9:00 AM: Team standup discussing your emotion recognition model. 11:00 AM: Deep coding session optimizing transformer architectures. 2:00 PM: Lunch with the ethics team discussing AI bias. 4:00 PM: Presenting your findings to healthcare partners. 6:00 PM: Mentoring junior engineers and reviewing code."
      },
      weekendQuest: {
        title: "Your Weekend Quest",
        description: "This weekend, create a simple chatbot using Python and OpenAI's API. Build something that can help students with homework questions. Document your process and share it on GitHub. This project will give you hands-on experience with the tools you'll use daily as an AI engineer."
      },
      realityCheck: {
        title: "The Reality Check",
        description: "AI engineering requires strong math skills (linear algebra, statistics) and 4+ years of intensive study. The field is highly competitive with constant learning required. However, starting salaries range from $120,000-$180,000, and you'll be solving humanity's biggest challenges."
      },
      skills: ["Python Programming", "Machine Learning", "Mathematics", "Problem Solving"],
      timeToMastery: "4-6 years",
      averageSalary: "$140,000 - $200,000"
    },
    {
      id: 2,
      title: "UX/UI Designer",
      persona: {
        title: "Meet Your Future Self",
        description: "You're Alex Rivera, a 26-year-old Senior UX Designer at Spotify. You design interfaces that millions use daily to discover music. Your recent redesign of the playlist creation flow increased user engagement by 40% and won a prestigious design award."
      },
      dayInLife: {
        title: "A Day in Your Life",
        description: "8:30 AM: Review user feedback and analytics from yesterday's release. 10:00 AM: Sketching new interface concepts for the mobile app. 12:00 PM: User interviews with music lovers aged 16-24. 2:00 PM: Collaborating with developers on implementation details. 4:00 PM: Creating high-fidelity prototypes in Figma. 6:00 PM: Design critique session with the team."
      },
      weekendQuest: {
        title: "Your Weekend Quest",
        description: "Redesign a popular app's interface that frustrates you. Choose something like your school's website or a social media app. Create before/after mockups showing your improvements. Focus on user flow and accessibility. Share your redesign on Behance or Dribbble."
      },
      realityCheck: {
        title: "The Reality Check",
        description: "UX design is more research and testing than just 'making things pretty.' You'll need to understand psychology, conduct user interviews, and justify every design decision with data. Portfolio development takes years, but entry-level positions start around $65,000-$85,000."
      },
      skills: ["Design Thinking", "User Research", "Prototyping", "Psychology"],
      timeToMastery: "2-3 years",
      averageSalary: "$75,000 - $130,000"
    }
  ],
  "helping people and healthcare": [
    {
      id: 3,
      title: "Clinical Psychologist",
      persona: {
        title: "Meet Your Future Self",
        description: "You're Dr. Sarah Johnson, a 32-year-old Clinical Psychologist running your own practice. You specialize in helping teenagers navigate anxiety and depression. Your innovative group therapy programs have been adopted by three school districts, helping hundreds of students build resilience."
      },
      dayInLife: {
        title: "A Day in Your Life",
        description: "8:00 AM: Reviewing session notes and treatment plans. 9:00 AM: Individual therapy session with a teen struggling with social anxiety. 11:00 AM: Family therapy helping parents understand their child's needs. 1:00 PM: Lunch break for self-care and reflection. 2:30 PM: Group therapy session for anxiety management. 4:30 PM: Updating treatment plans and notes. 6:00 PM: Reading latest research on adolescent mental health."
      },
      weekendQuest: {
        title: "Your Weekend Quest",
        description: "Volunteer at a local crisis hotline or mental health organization. Many accept high school volunteers with basic training. Alternatively, start a mental health awareness club at your school. This experience will show you the real impact of psychological support work."
      },
      realityCheck: {
        title: "The Reality Check",
        description: "Becoming a psychologist requires 8-10 years of education including a doctorate. The work can be emotionally demanding, and you'll often take client concerns home with you. However, salaries range from $80,000-$120,000, and the personal fulfillment is immense."
      },
      skills: ["Active Listening", "Empathy", "Critical Thinking", "Research Methods"],
      timeToMastery: "8-10 years",
      averageSalary: "$80,000 - $120,000"
    }
  ],
  "business and entrepreneurship": [
    {
      id: 4,
      title: "Product Manager",
      persona: {
        title: "Meet Your Future Self",
        description: "You're Jordan Park, a 29-year-old Senior Product Manager at Netflix. You lead the team responsible for the recommendation algorithm that helps 200+ million users find their next favorite show. Your data-driven approach to feature development has increased viewing time by 25%."
      },
      dayInLife: {
        title: "A Day in Your Life",
        description: "7:30 AM: Checking global user metrics and overnight A/B test results. 9:00 AM: Strategy meeting with engineering and design teams. 10:30 AM: User research sessions watching how people browse content. 1:00 PM: Stakeholder presentation on quarterly OKRs. 3:00 PM: Sprint planning and feature prioritization. 5:00 PM: Market research on competitor features and trends."
      },
      weekendQuest: {
        title: "Your Weekend Quest",
        description: "Pick a product you use daily (could be an app, website, or physical product) and write a detailed improvement proposal. Include user research, competitive analysis, and success metrics. Present your idea to friends/family and gather feedback. This mirrors real PM work."
      },
      realityCheck: {
        title: "The Reality Check",
        description: "Product management sits at the intersection of business, technology, and design. You'll need strong analytical skills and the ability to influence without authority. Competition for PM roles is fierce, but salaries range from $110,000-$180,000 with significant growth potential."
      },
      skills: ["Strategic Thinking", "Data Analysis", "Communication", "User Research"],
      timeToMastery: "3-5 years",
      averageSalary: "$110,000 - $180,000"
    }
  ]
};

export const loadingMessages = [
  "Analyzing your passions...",
  "Charting your potential...",
  "Mapping career opportunities...",
  "Discovering your future paths...",
  "Connecting dreams to reality...",
  "Crafting your personalized roadmap..."
];

export const getCareerPathsForInput = (input) => {
  const lowercaseInput = input.toLowerCase();
  
  if (lowercaseInput.includes('tech') || lowercaseInput.includes('computer') || 
      lowercaseInput.includes('coding') || lowercaseInput.includes('programming') ||
      lowercaseInput.includes('ai') || lowercaseInput.includes('design')) {
    return mockCareerPaths["technology and innovation"];
  }
  
  if (lowercaseInput.includes('help') || lowercaseInput.includes('people') || 
      lowercaseInput.includes('health') || lowercaseInput.includes('therapy') ||
      lowercaseInput.includes('psychology') || lowercaseInput.includes('medicine')) {
    return mockCareerPaths["helping people and healthcare"];
  }
  
  if (lowercaseInput.includes('business') || lowercaseInput.includes('management') || 
      lowercaseInput.includes('entrepreneur') || lowercaseInput.includes('startup') ||
      lowercaseInput.includes('leader') || lowercaseInput.includes('product')) {
    return mockCareerPaths["business and entrepreneurship"];
  }
  
  // Default to showing a mix
  return [
    ...mockCareerPaths["technology and innovation"].slice(0, 1),
    ...mockCareerPaths["helping people and healthcare"].slice(0, 1),
    ...mockCareerPaths["business and entrepreneurship"].slice(0, 1)
  ];
};
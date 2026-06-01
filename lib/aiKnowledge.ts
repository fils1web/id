export const knowledgeBase: Record<string, string> = {
  "who is bizimana fils": `BIZIMANA FILS is a Rwandan innovator, founder of BIA CO (Bizimana Idea Agency Company), 
    based in Kigali, Rwanda. He is an Electric Vehicle Technician, AI Prompt Engineer, Web Developer, and 
    Automotive Technology Consultant. He holds an A2 Certificate in Automobile Technology from 
    Ecole Technique de Kabgayi. His slogan is "Bwangu Nk'Intore". Contact: +250 783 444 370, bmbcodev@gmail.com.`,

  "what is bia co": `BIA CO stands for Bizimana Idea Agency Company. It is the brand and agency founded by 
    BIZIMANA FILS. The company focuses on electric vehicle technology, AI solutions, web development, 
    and technology research. Based in Kigali, Rwanda. Slogan: "Bwangu Nk'Intore".`,

  "what are your skills": `BIZIMANA FILS has expertise in: Electric Vehicle Diagnostics (95%), 
    Vehicle Diagnostics (90%), AI Prompt Engineering (85%), Web Development (80%), 
    Automotive Repair (90%), and Technology Research (85%).`,

  "services": `BIA CO offers these services:
    1. Electric Vehicle Diagnostics & Repair — battery health, motor control systems
    2. AI Prompt Engineering & Automation — workflow automation, intelligent systems
    3. Web Development & UI Design — full-stack, responsive, modern frameworks
    4. Automotive Technology Consulting — diagnostics, telematics, EV integration
    5. Technology Research & Innovation — feasibility studies, innovation strategy`,

  "contact": `You can reach BIZIMANA FILS via:
    📞 Phone: +250 783 444 370 / +250 795 914 094
    📧 Email: bmbcodev@gmail.com
    📍 Location: Kigali, Rwanda
    Also find him on LinkedIn, Instagram, X, TikTok, Threads, Twitch, and ORCID.`,

  "location": `BIZIMANA FILS is based in Kigali, Rwanda.`,

  "education": `BIZIMANA FILS studied at Ecole Technique de Kabgayi, earning an A2 Certificate in Automobile Technology.`,

  "slogan": `The slogan of BIA CO is "Bwangu Nk'Intore". It represents excellence and speed in the Rwandan cultural context.`,

  "projects": `BIA CO has worked on various projects in Electric Vehicle technology, AI, Web Development, 
    and Automotive innovation. You can view them on the Projects page of this website.`,

  "social media": `BIZIMANA FILS is active on:
    • LinkedIn: https://www.linkedin.com/in/bizimana-fils-fils-8b94883b9
    • Instagram: https://www.instagram.com/1to3to7
    • X (Twitter): https://x.com/1to3to7
    • TikTok: https://tiktok.com/@1to3to7
    • Threads: https://www.threads.com/@1to3to7
    • Twitch: https://www.twitch.tv/1to3to7
    • ORCID: https://orcid.org/0009-0006-4474-9648`,

  "what is bwangu nk intore": `"Bwangu Nk'Intore" is the slogan of BIA CO. It is a Rwandan/Kinyarwanda phrase 
    that conveys excellence, speed, and warrior spirit — inspired by the "Intore" (warrior) tradition in Rwandan culture.`,

  "default": `I'm the BIA CO AI Assistant, trained with knowledge about BIZIMANA FILS and BIA CO. 
    I can answer questions about skills, services, projects, contact info, education, social media, 
    and more. Try asking: "Who is BIZIMANA FILS?", "What are your services?", "Contact info", etc. 
    I also have a built-in translator — use the Translate tab to translate text between 190+ languages!`,
};

export function findAnswer(query: string): string {
  const q = query.toLowerCase().trim();

  if (/^(hi|hello|hey|good morning|good evening|greetings|yo|sup)/.test(q)) {
    return `Hello! I'm the BIA CO AI Assistant. How can I help you today? Ask me about BIZIMANA FILS, BIA CO services, projects, or use the Translate tab to translate text between 190+ languages!`;
  }

  if (/thank|thanks|appreciate/i.test(q)) {
    return `You're welcome! If you have any more questions about BIA CO or need help with translations, feel free to ask.`;
  }

  if (/bye|goodbye|see you/i.test(q)) {
    return `Goodbye! Feel free to come back anytime. BIA CO is always here to help. Bwangu Nk'Intore!`;
  }

  const keys = Object.keys(knowledgeBase).filter((k) => k !== "default");
  for (const key of keys) {
    const keywords = key.split(" ");
    const matchCount = keywords.filter((kw) => q.includes(kw)).length;
    if (matchCount >= Math.min(2, keywords.length)) {
      return knowledgeBase[key];
    }
  }

  return knowledgeBase["default"];
}

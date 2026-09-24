export interface Project {
  id: string;
  title: string;
  tag: string;
  problem: string;
  solution: string;
  technology: string[];
  result: string;
}

export interface Skill {
  name: string;
  level: number;
}

export interface SkillGroup {
  category: string;
  skills: Skill[];
}

export interface TimelineItem {
  year: string;
  title: string;
  description: string;
}

export interface HoroscopeType {
  config: Config;
  content: Content[];
}

export interface Config {
  sign_id: string;
  sign_title: string;
}

export interface Content {
  day: string;
  timestamp: Date;
  date_title: string;
  section: Section[];
}

export interface Section {
  section_order: string;
  section_title: SectionTitle;
  section_content: string;
  section_rate: string;
}
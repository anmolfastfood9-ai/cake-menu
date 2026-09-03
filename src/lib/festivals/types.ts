export type OccasionType = "FESTIVAL" | "CELEBRATION" | "SEASONAL";

export interface FestivalDateResolution {
  eventDate: Date;
  displayStartOverride?: Date;
  displayEndOverride?: Date;
  confidence: "EXACT" | "OBSERVATION_DEPENDENT" | "ALGORITHMIC";
  notes?: string;
}

export interface ICalendarProvider {
  resolveOccurrence(
    calendarKey: string,
    year: number
  ): Promise<FestivalDateResolution | null> | FestivalDateResolution | null;
}

export interface DefaultOccasionSeed {
  name: string;
  slug: string;
  type: OccasionType;
  calendarKey: string;
  badgeText: string;
  description: string;
  accentColor: string;
  priority: number;
  daysBefore: number;
  daysAfter: number;
}

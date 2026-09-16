import { useState, useMemo } from 'react';
import { astronomyService } from '../services/astronomyService';
import { AstronomicalEvent } from '../services/astronomy/types';

export interface Mission {
  id: string;
  title: string;
  description: string;
  progress: number;
  reward: string;
  badge: string;
}

export const EDUCATIONAL_MISSIONS: Mission[] = [
  {
    id: '1',
    title: 'Messier Marathon',
    description: 'Observe and log 110 Messier deep-sky objects using telescope',
    progress: 23,
    reward: '2000 XP',
    badge: 'Deep Space Pioneer'
  },
  {
    id: '2',
    title: 'Lunar Phase Photographer',
    description: 'Capture detailed photos of all 8 major lunar phases',
    progress: 6,
    reward: '1200 XP',
    badge: 'Luna Observer'
  },
  {
    id: '3',
    title: 'ISS Tracking Challenge',
    description: 'Successfully predict and observe 25 ISS overhead passes',
    progress: 12,
    reward: '1500 XP',
    badge: 'ISS Spotter'
  },
  {
    id: '4',
    title: 'Planetary Details Quest',
    description: 'Observe and sketch surface features of Mars, Jupiter, and Saturn',
    progress: 1,
    reward: '1800 XP',
    badge: 'Planetary Photographer'
  },
  {
    id: '5',
    title: 'Variable Star Monitor',
    description: 'Track brightness changes of 5 variable stars over 30 days',
    progress: 2,
    reward: '2500 XP',
    badge: 'Stellar Scientist'
  },
  {
    id: '6',
    title: 'Meteor Shower Logger',
    description: 'Document hourly rates for 10 different annual meteor showers',
    progress: 4,
    reward: '1000 XP',
    badge: 'Meteor Master'
  }
];

export function useAstronomicalEvents() {
  const [missions] = useState<Mission[]>(EDUCATIONAL_MISSIONS);
  const [currentDate] = useState<Date>(() => new Date());

  const events: AstronomicalEvent[] = useMemo(() => {
    return astronomyService.getEvents(currentDate);
  }, [currentDate]);

  return {
    events,
    missions
  };
}

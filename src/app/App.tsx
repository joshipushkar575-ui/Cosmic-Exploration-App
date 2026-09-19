import { useState } from 'react';

import { AuthScreen } from './components/AuthScreen';
import { HomeScreen } from './components/HomeScreen';
import { ChatScreen } from './components/ChatScreen';
import { ExplorerScreen } from './components/ExplorerScreen';
import { EventsScreen } from './components/EventsScreen';
import { ProfileScreen } from './components/ProfileScreen';
import { GameScreen } from './components/GameScreen';
import { KidsSection } from './components/KidsSection';
import { TeenagerSection } from './components/TeenagerSection';
import { AdultSection } from './components/AdultSection';
import { SeniorSection } from './components/SeniorSection';
import { ISROScreen } from './components/ISROScreen';
import SatelliteTrackerScreen from './components/SatelliteTrackerScreen';
import EarthExplorerScreen from './components/EarthExplorerScreen';
import SpacecraftTrackerScreen from './components/SpacecraftTrackerScreen';

type Screen =
  | 'auth'
  | 'home'
  | 'chat'
  | 'explorer'
  | 'events'
  | 'profile'
  | 'game'
  | 'kids'
  | 'teenager'
  | 'adult'
  | 'senior'
  | 'isro'
  | 'satellite'
  | 'earth'
  | 'spacecraft';

interface UserData {
  name: string;
  email: string;
  age: number;
}

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('auth');
  const [userData, setUserData] = useState<UserData | null>(null);

  const getAgeBasedScreen = (age: number): Screen => {
    if (age >= 1 && age <= 12) return 'kids';
    if (age >= 13 && age <= 18) return 'teenager';
    if (age >= 19 && age <= 35) return 'adult';
    if (age >= 36 && age <= 80) return 'senior';
    return 'home';
  };

  const handleAuthComplete = () => {
    const storedUserData = localStorage.getItem('userData');

    if (storedUserData) {
      const user = JSON.parse(storedUserData) as UserData;
      setUserData(user);
      setCurrentScreen(getAgeBasedScreen(user.age));
    } else {
      setCurrentScreen('home');
    }
  };

  const handleNavigate = (screen: string) => {
    if (screen === 'auth') {
      setUserData(null);
      localStorage.removeItem('userData');
      setCurrentScreen('auth');
      return;
    }

    setCurrentScreen(screen as Screen);
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'auth':
        return <AuthScreen onAuthComplete={handleAuthComplete} />;

      case 'home':
        return <HomeScreen onNavigate={handleNavigate} />;

      case 'chat':
        return <ChatScreen onNavigate={handleNavigate} />;

      case 'explorer':
        return <ExplorerScreen onNavigate={handleNavigate} />;

      case 'events':
        return <EventsScreen onNavigate={handleNavigate} />;

      case 'profile':
        return <ProfileScreen onNavigate={handleNavigate} />;

      case 'game':
        return <GameScreen onNavigate={handleNavigate} />;

      case 'kids':
        return <KidsSection onNavigate={handleNavigate} />;

      case 'teenager':
        return <TeenagerSection onNavigate={handleNavigate} />;

      case 'adult':
        return <AdultSection onNavigate={handleNavigate} />;

      case 'senior':
        return <SeniorSection onNavigate={handleNavigate} />;
      case 'satellite':
        return <SatelliteTrackerScreen onNavigate={handleNavigate} />;

      case 'earth':
        return <EarthExplorerScreen onNavigate={handleNavigate} />;

      case 'spacecraft':
        return <SpacecraftTrackerScreen onNavigate={handleNavigate} />;

      case 'isro':
        return <ISROScreen onNavigate={handleNavigate} />;

      default:
        return <AuthScreen onAuthComplete={handleAuthComplete} />;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden">
      {renderScreen()}
    </div>
  );
}

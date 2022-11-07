import './App.css'
import { useAppState } from './context';
import { useState } from 'react';
import { Schedule } from './components/Schedule';
import { ChoiceModal } from './components/Modals/ChoiceModal';
import { LessonModal } from './components/Modals/LessonModal';
import { Settings } from './components/Settings';
import { Announcements } from './components/Announcements';
import { Nav } from './components/Nav';
import { Header } from './components/Header';

const App = () => {
  const { isDesktop, accounts, currentAccount, settings, announcementsLoad } = useAppState();
  const [announcements, setAnnouncements] = useState<Announcement[]>(announcementsLoad);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [choiceModalOpen, setChoiceModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Appointment | null>();
  const currentDay = new Date();

  const openLessonModal = (lesson: Appointment) => {
    setSelectedLesson(lesson);
    setLessonModalOpen(true);
  }

  const closeLessonModal = () => {
    setLessonModalOpen(false);
    setTimeout(() => {
      setSelectedLesson(null);
    }, 150)
  }

  const openChoiceModal = (lesson: Appointment) => {
    setSelectedLesson(lesson);
    setChoiceModalOpen(true);
  }

  const closeChoiceModal = () => {
    setChoiceModalOpen(false);
    setTimeout(() => {
      setSelectedLesson(null);
    }, 150)
  }

  return (
    <div className={`${menuOpen ? "show-menu " : ""}app`}>
        <Nav isDesktop={isDesktop} lng={settings.lng} setMenuOpen={setMenuOpen} showSettings={showSettings} showAnnouncements={showAnnouncements} setShowSettings={setShowSettings} setShowAnnouncements={setShowAnnouncements}/>

        {(isDesktop || showAnnouncements) && (
          <Announcements lng={settings.lng} isDesktop={isDesktop} announcements={announcements}/>
        )}

        {showSettings && (
          <Settings />
        )}

        <main className="schedule">
          <Header currentDay={currentDay} isDesktop={isDesktop} lng={settings.lng} showAnnouncements={showAnnouncements} showSettings={showSettings} setMenuOpen={setMenuOpen}/>

          <Schedule currentDay={currentDay} isDesktop={isDesktop} setAnnouncements={setAnnouncements} choiceModalOpen={choiceModalOpen} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal} />

          <LessonModal lng={settings.lng} lessonModalOpen={lessonModalOpen} closeLessonModal={closeLessonModal} selectedLesson={selectedLesson}/>
          <ChoiceModal lng={settings.lng} currentAccount={accounts[currentAccount]} choiceModalOpen={choiceModalOpen} closeChoiceModal={closeChoiceModal} isDesktop={isDesktop} selectedLesson={selectedLesson}/>
        </main>
    </div>
  );
}

export default App

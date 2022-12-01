import { useAppState } from '../../context';
import { useEventListener } from '../../hooks';
import { useState } from 'preact/hooks';
import { Schedule } from '../../components/Schedule';
import { ChoiceModal } from '../../components/Modals/ChoiceModal';
import { LessonModal } from '../../components/Modals/LessonModal';
import { Settings } from '../../components/Settings';
import { Announcements } from '../../components/Announcements';
import { Nav } from '../../components/Nav';
import { Header } from '../../components/Header';

export const App = () => {
  const { isDesktop, announcementsLoad: announcements } = useAppState();
  const [offset, setOffset] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [showAnnouncements, setShowAnnouncements] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [lessonModalOpen, setLessonModalOpen] = useState(false);
  const [choiceModalOpen, setChoiceModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState<Appointment | null>();
  const currentDay = new Date();

  useEventListener('keydown', keyHandler);

  function keyHandler(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowLeft":
        setOffset(prev => prev - 1);
        break;
      case "ArrowRight":
        setOffset(prev => prev + 1);
        break;
    }
  }

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
        <Nav setMenuOpen={setMenuOpen} showSettings={showSettings} showAnnouncements={showAnnouncements} setShowSettings={setShowSettings} setShowAnnouncements={setShowAnnouncements}/>

        {(isDesktop || showAnnouncements) && (
          <Announcements announcements={announcements}/>
        )}

        {showSettings && (
          <Settings />
        )}

        <main className="schedule">
          <Header offset={offset} setOffset={setOffset} currentDay={currentDay} showAnnouncements={showAnnouncements} showSettings={showSettings} setMenuOpen={setMenuOpen}/>

          <Schedule offset={offset} currentDay={currentDay} choiceModalOpen={choiceModalOpen} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal} />

          <LessonModal lessonModalOpen={lessonModalOpen} closeLessonModal={closeLessonModal} selectedLesson={selectedLesson}/>
          <ChoiceModal choiceModalOpen={choiceModalOpen} closeChoiceModal={closeChoiceModal} selectedLesson={selectedLesson}/>
        </main>
    </div>
  );
}
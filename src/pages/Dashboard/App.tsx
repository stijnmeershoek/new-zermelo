import { createSignal, Show } from "solid-js";
import { Announcements } from "../../components/Announcements";
import { Header } from "../../components/Header";
import { ChoiceModal } from "../../components/Modals/ChoiceModal";
import { LessonModal } from "../../components/Modals/LessonModal";
import { Nav } from "../../components/Nav";
import { Schedule } from "../../components/Schedule";
import { Settings } from "../../components/Settings";
import { useAppState } from "../../context";
import { useEventListener } from "../../hooks";

export const App = () => {
  const { isDesktop, announcementsLoad: announcements } = useAppState();
  const [offset, setOffset] = createSignal(0);
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [showAnnouncements, setShowAnnouncements] = createSignal(false);
  const [showSettings, setShowSettings] = createSignal(false);
  const [lessonModalOpen, setLessonModalOpen] = createSignal(false);
  const [choiceModalOpen, setChoiceModalOpen] = createSignal(false);
  const [selectedLesson, setSelectedLesson] = createSignal<Appointment | undefined>();

  useEventListener('keydown', keyHandler);

  function keyHandler(event: KeyboardEvent) {
    switch (event.key) {
      case "ArrowLeft":
        setOffset(offset() - 1);
        break;
      case "ArrowRight":
        setOffset(offset() + 1);
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
      setSelectedLesson(undefined);
    }, 150)
  }

  const openChoiceModal = (lesson: Appointment) => {
    setSelectedLesson(lesson);
    setChoiceModalOpen(true);
  }

  const closeChoiceModal = () => {
    setChoiceModalOpen(false);
    setTimeout(() => {
      setSelectedLesson(undefined);
    }, 150)
  }

  return (
    <div class={`${menuOpen() ? "show-menu " : ""}app`}>
        <Nav setMenuOpen={setMenuOpen} showSettings={showSettings} showAnnouncements={showAnnouncements} setShowSettings={setShowSettings} setShowAnnouncements={setShowAnnouncements}/>

        <Show when={isDesktop() || showAnnouncements()}>
          <Announcements announcements={announcements}/>
        </Show>

        <Show when={showSettings()}>
          <Settings />
        </Show>

        <main class="schedule">
          <Header offset={offset} setOffset={setOffset} showAnnouncements={showAnnouncements} showSettings={showSettings} menuOpen={menuOpen} setMenuOpen={setMenuOpen}/>

          <Schedule offset={offset} choiceModalOpen={choiceModalOpen} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal} />

          <LessonModal lessonModalOpen={lessonModalOpen} closeLessonModal={closeLessonModal} selectedLesson={selectedLesson}/>
          <ChoiceModal choiceModalOpen={choiceModalOpen} closeChoiceModal={closeChoiceModal} selectedLesson={selectedLesson}/>
        </main>
    </div>
  );
};
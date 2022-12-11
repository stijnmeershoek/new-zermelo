import { createMemo, createSignal, Show } from "solid-js";
import { Settings } from "../../components/Settings";
import { Announcements } from "../../components/Announcements";
import { Nav } from "../../components/Nav";
import { Header } from "../../components/Header";
import { Schedule } from "../../components/Schedule";

import { useAppState } from "../../context";
import { useEventListener } from "../../hooks";

export default function App() {
  const { isDesktop, announcementsLoad: announcements } = useAppState();
  const defaultOffset = createMemo(() => (new Date().getDay() === 6 || new Date().getDay() === 0) ? 1 : 0);
  const [offset, setOffset] = createSignal(defaultOffset());
  const [menuOpen, setMenuOpen] = createSignal(false);
  const [showAnnouncements, setShowAnnouncements] = createSignal(false);
  const [showSettings, setShowSettings] = createSignal(false);

  useEventListener({eventName: 'keydown', handler: keyHandler, element: window});

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
          <Header offset={offset} setOffset={setOffset} showAnnouncements={showAnnouncements} showSettings={showSettings} menuOpen={menuOpen} setMenuOpen={setMenuOpen} />

          <Schedule offset={offset} defaultOffset={defaultOffset} />
        </main>
    </div>
  );
};
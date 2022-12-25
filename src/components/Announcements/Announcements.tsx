import { Accessor, For, Show } from "solid-js";
import { useAppState } from "../../context"
import { Translate } from "../Translate";
import './Announcements.css'

type Props = {
  announcements: Accessor<Announcement[]>
}

export const Announcements = (props: Props) => {
  const {isDesktop} = useAppState();

    return (
        <aside aria-labelledby='announcements-header' class={`${!isDesktop() ? "mobile " : ""}announcements`}>
          <h1 id='announcements-header'><Translate nlString="Mededelingen" enString="Announcements" /></h1>
            <Show when={props.announcements().length !== 0} fallback={<h2><Translate nlString="Geen actuele mededelingen" enString="No current announcements" /></h2>}>
              <For each={props.announcements()}>{(announcement) => (
                <article class='announcement'>
                  <header>
                    <h1>{announcement.title}</h1>
                    <div>
                      <div class='plusminus'>
                        <span></span>
                        <span></span>
                      </div>
                    </div>
                  </header>
                  <div>
                    {announcement.text}
                  </div>
                </article>
              )}</For>
            </Show>
        </aside>
    )
}
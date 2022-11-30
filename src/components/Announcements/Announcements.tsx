import { useAppState } from "../../context"
import './Announcements.css'

interface Props {
  announcements: Announcement[]
}

export const Announcements = ({announcements}: Props) => {
  const {isDesktop, settings} = useAppState();

    return (
        <aside aria-labelledby='announcements-header' className={`${!isDesktop ? "mobile " : ""}announcements`}>
          <h1 id='announcements-header'>{settings.lng === "nl" ? "Mededelingen" : settings.lng === "en" ? "Announcements" : "Announcements"}</h1>
            {announcements.length !== 0 ? announcements.map((announcement) => {
              return (
              <article key={announcement.id} className='announcement'>
                <header>
                  <h1>{announcement.title}</h1>
                  <div>
                    <div className='plusminus'>
                      <span></span>
                      <span></span>
                    </div>
                  </div>
                </header>
                <div>
                  {announcement.text}
                </div>
              </article>)
            }) : <h2>{settings.lng === "nl" ? "Geen actuele mededelingen" : settings.lng === "en" ? "No current announcements" : "No current announcements"}</h2>}
        </aside>
    )
}
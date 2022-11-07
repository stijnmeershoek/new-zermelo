export const Announcements = ({lng, announcements, isDesktop}: {lng: string, announcements: Announcement[], isDesktop: boolean}) => {
    return (
        <section aria-labelledby='announcements-header' className={`${!isDesktop ? "mobile " : ""}announcements`}>
          <h1 id='announcements-header'>{lng === "nl" ? "Mededelingen" : lng === "en" ? "Announcements" : "Announcements"}</h1>
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
            }) : <h2>{lng === "nl" ? "Geen actuele mededelingen" : lng === "en" ? "No current announcements" : "No current announcements"}</h2>}
        </section>
    )
}
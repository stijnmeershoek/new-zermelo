import { useAppState } from "../../context";

export const Settings = () => {
    const { settings, setSettings, isDesktop } = useAppState();

    return (
        <section className='settings' aria-labelledby='settings-header'>
          <h1 id='settings-header'>{settings.lng === "nl" ? "Instellingen" : settings.lng === "en" ? "Settings" : "Settings"}</h1>
          <div>
            <label htmlFor="lng">{settings.lng === "nl" ? "Taal" : settings.lng === "en" ? "Language" : "Language"}:</label>
            <select id="lng" value={settings.lng} onChange={(e) => {setSettings(prev => prev = {...prev, lng: e.target.value})}}>
              <option value="nl">NL</option>
              <option value="en">EN</option>
            </select>
          </div>
          <div>
            <label htmlFor="theme">{settings.lng === "nl" ? "Thema" : settings.lng === "en" ? "Theme" : "Theme"}:</label>
            <select id="theme" value={settings.theme} onChange={(e) => {setSettings(prev => prev = {...prev, theme: e.target.value})}}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div>
            <label htmlFor="choices">{settings.lng === "nl" ? "Toon Inschrijvingen" : settings.lng === "en" ? "Show Enrollments" : "Show Enrollments"}:</label>
            <select id="choices" value={settings.showChoices.toString()} onChange={(e) => {setSettings(prev => prev = {...prev, showChoices: e.target.value === "true"})}}>
              <option value="false">{settings.lng === "nl" ? "Nee" : settings.lng === "en" ? "No" : "No"}</option>
              <option value="true">{settings.lng === "nl" ? "Ja" : settings.lng === "en" ? "Yes" : "Yes"}</option>
            </select>
          </div>
          {!isDesktop && (
            <div>
              <label htmlFor="perWeek">{settings.lng === "nl" ? "Weergave" : settings.lng === "en" ? "View" : "View"}:</label>
              <select id="perWeek" value={settings.perWeek.toString()} onChange={(e) => {setSettings(prev => prev = {...prev, perWeek: e.target.value === "true"})}}>
                <option value="true">{settings.lng === "nl" ? "Week" : settings.lng === "en" ? "Week" : "Week"}</option>
                <option value="false">{settings.lng === "nl" ? "Dag" : settings.lng === "en" ? "Day" : "Day"}</option>
              </select>
            </div>
          )}
        </section>
    )
}
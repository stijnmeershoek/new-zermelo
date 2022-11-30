import { useAppState } from "../../context";
import './Settings.css'

export const Settings = () => {
    const { settings, setSettings } = useAppState();

    return (
        <aside className='settings' aria-labelledby='settings-header'>
          <h1 id='settings-header'>{settings.lng === "nl" ? "Instellingen" : settings.lng === "en" ? "Settings" : "Settings"}</h1>
          <div>
            <label htmlFor="lng">{settings.lng === "nl" ? "Taal" : settings.lng === "en" ? "Language" : "Language"}:</label>
            <select id="lng" value={settings.lng} onChange={({target}) => {setSettings(prev => prev = {...prev, lng: (target as HTMLSelectElement).value})}}>
              <option value="nl">NL</option>
              <option value="en">EN</option>
            </select>
          </div>
          <div>
            <label htmlFor="theme">{settings.lng === "nl" ? "Thema" : settings.lng === "en" ? "Theme" : "Theme"}:</label>
            <select id="theme" value={settings.theme} onChange={({target}) => {setSettings(prev => prev = {...prev, theme: (target as HTMLSelectElement).value})}}>
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>
          <div>
            <label htmlFor="choices">{settings.lng === "nl" ? "Toon Inschrijvingen" : settings.lng === "en" ? "Show Enrollments" : "Show Enrollments"}:</label>
            <select id="choices" value={settings.showChoices.toString()} onChange={({target}) => {setSettings(prev => prev = {...prev, showChoices: (target as HTMLSelectElement).value === "true"})}}>
              <option value="false">{settings.lng === "nl" ? "Nee" : settings.lng === "en" ? "No" : "No"}</option>
              <option value="true">{settings.lng === "nl" ? "Ja" : settings.lng === "en" ? "Yes" : "Yes"}</option>
            </select>
          </div>
        </aside>
    )
}
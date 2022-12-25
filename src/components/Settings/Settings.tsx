import { Show } from "solid-js";
import { useAppState } from "../../context";
import { Translate } from "../Translate";
import './settings.css'

export const Settings = () => {
    const { settings, updateSettings, isDesktop } = useAppState();

    return (
        <aside class='settings' aria-labelledby='settings-header'>
          <h1 id='settings-header'><Translate nlString="Instellingen" enString="Settings"/></h1>
          <div>
            <label for="lng"><Translate nlString="Taal" enString="Language" />:</label>
            <select id="lng" value={settings.lng} onInput={updateSettings('lng')}>
              <option value="nl">NL</option>
              <option value="en">EN</option>
            </select>
          </div>
          <div>
            <label for="theme"><Translate nlString="Thema" enString="Theme"/>:</label>
            <select id="theme" value={settings.theme} onInput={updateSettings('theme')}>
              <option value="light"><Translate nlString="Licht" enString="Light" /></option>
              <option value="dark"><Translate nlString="Donker" enString="Dark" /></option>
            </select>
          </div>
          <div>
            <label for="choices"><Translate nlString="Toon Inschrijvingen" enString="Show Enrollments" />:</label>
            <select id="choices" value={settings.showChoices} onInput={updateSettings('showChoices')}>
              <option value="false"><Translate nlString="Nee" enString="No" /></option>
              <option value="true"><Translate nlString="Ja" enString="Yes" /></option>
            </select>
          </div>
          <Show when={isDesktop()}>
            <div>
              <label for="custom"><Translate nlString="Eigen afspraken" enString="Personal Appointments" />:</label>
              <select id="custom" value={settings.enableCustom} onInput={updateSettings('enableCustom')}>
                <option value="false"><Translate nlString="Nee" enString="No" /></option>
                <option value="true"><Translate nlString="Ja" enString="Yes" /></option>
              </select>
            </div>
          </Show>
        </aside>
    )
}
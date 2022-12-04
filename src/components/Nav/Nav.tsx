import { Accessor, For, Setter, Show } from "solid-js";
import { useAppState } from "../../context";
import { Translate } from "../Translate";
import './Nav.css'

interface Props {
  setMenuOpen: Setter<boolean>, 
  showSettings: Accessor<boolean>, 
  showAnnouncements: Accessor<boolean>, 
  setShowSettings: Setter<boolean>, 
  setShowAnnouncements: Setter<boolean>
}

export const Nav = (props: Props) => {
    const { isDesktop, accounts, currentAccount, switchAccount, addNewAccount, logOut} = useAppState();

    return (
        <nav class="navbar" aria-label='primary' id="primary-navigation">
          <svg class="logo" viewBox="0 0 512 512">
            <title>Logo</title>
            <g>
              <rect width="512" height="512" rx="100" ry="100" />
              <path d="M374.75,217.71c21.32-33.81,28.64-70.97,29.03-110.31h9.99c0,6.54,.42,13.31-.07,20.01-1.98,26.96-7.88,52.96-19.48,77.55-.98,2.07-.74,5.17-.06,7.51,9.42,32.52,8.61,64.75-2.16,96.83-1.28,3.8-3.08,4.96-7.09,4.94-38.32-.18-76.65-.22-114.97,.03-5.18,.03-8.14-1.11-8.93-6.43-.26-1.77-1.03-3.47-1.69-5.63,1.93-.77,3.73-1.53,5.56-2.23,30.95-11.75,59.96-26.93,83.58-50.55,9.59-9.59,17.46-20.9,26.31-31.73Z"/>
              <path d="M112.28,256.06c.29-16.74,2.97-32.59,7.96-48.07,.94-2.92,2.25-4.14,5.57-4.13,36.81,.14,73.61,.14,110.42,0,3.34-.01,4.81,1.1,5.42,4.19,.47,2.41,1.29,4.76,2.08,7.59-87.66,33.62-135.85,95.31-135.71,191.4h-10.74c0-2.29-.06-4.53,0-6.78,.98-32.12,6.84-63.12,20.88-92.31,.89-1.84,.93-4.55,.36-6.57-4.17-14.67-6.26-29.61-6.25-45.33Z"/>
              <path d="M188,151.87h-32.71c52.4-59.33,150.04-59.57,202.3,0H188Z"/>
              <path d="M289.47,403.52c-55.31,13.05-104.8-8.89-131.52-37.35h197.71c-19.13,18.65-40.75,30.94-66.19,37.35Z"/>
              <path d="M255.45,290.03c-1.12-2.54-1.95-4.88-2.94-7.71,2.02-.8,3.81-1.56,5.63-2.24,29.66-11.04,56.95-25.91,79.34-48.8,25.19-25.77,38.74-57.01,43.43-92.35,1.37-10.36,1.83-20.84,2.73-31.61h8.12c-.18,35.83-6.67,70.09-25.59,101.12-25.69,42.13-64.92,66.25-110.71,81.59Z"/>
              <path d="M167.44,290.48c-28.59,33.73-38.59,73.33-38.85,116.54h-8.58c.03-35.29,6.74-68.83,24.65-99.76,19.52-33.71,55.88-63.25,102.72-79.87,.78,2.65,1.54,5.27,2.42,8.26-31.45,12.38-59.88,28.85-82.36,54.82Z"/>
            </g>
          </svg>
          <hr class="separator"></hr>
          <ul class="accounts">
            <Show when={accounts().length !== 0}>
              <For each={accounts()}>{(acc, i) => (
                <li>
                  <button class={`${(!props.showSettings() && !props.showAnnouncements()) && currentAccount() === i() ? "active" : ""}`} aria-label={`switch to ${acc.accountName}`} onClick={() => {props.setMenuOpen(false); switchAccount(i()); props.setShowSettings(false); props.setShowAnnouncements(false)}}>
                    {acc.accountName.substring(0,2)}
                    <span>{acc.accountName}</span>
                  </button>
                </li>
              )}</For>
            </Show>
          </ul>
          <section class="buttons">
            <Show when={accounts().length < 5}>
              <button aria-label='add account' class='add-account' onClick={() => {addNewAccount(); props.setShowSettings(false); props.setShowAnnouncements(false)}}>
                  <svg viewBox="0 0 1024 1024"><path d="M960 448H576V64a64 64 0 0 0-128 0v384H64a64 64 0 0 0 0 128h384v384a64 64 0 0 0 128 0V576h384a64 64 0 0 0 0-128z" fill="currentColor" /></svg>
                  <span><Translate nlString="Account Toevoegen" enString="Add Account" /></span>
              </button>
            </Show>
            <Show when={!isDesktop()}>
              <button aria-label='announcements' class={`${props.showAnnouncements() ? "active " : ""}announcements-btn`} onClick={() => {props.setMenuOpen(false); props.setShowSettings(false); props.setShowAnnouncements(prev => !prev)}}>
                <svg viewBox="0 0 1024 1024"><path d="M853.333333 85.333333H170.666667C123.52 85.333333 85.76 123.52 85.76 170.666667L85.333333 938.666667l170.666667-170.666667h597.333333c47.146667 0 85.333333-38.186667 85.333334-85.333333V170.666667c0-47.146667-38.186667-85.333333-85.333334-85.333334zM554.666667 469.333333h-85.333334V213.333333h85.333334v256z m0 170.666667h-85.333334v-85.333333h85.333334v85.333333z"  fill="currentColor"/></svg>
                <span><Translate nlString="Mededelingen" enString="Announcements" /></span>
              </button>
            </Show>
            <button aria-label='settings' class={`${props.showSettings() ? "active " : ""}settings-btn`} onClick={() => {props.setMenuOpen(false); props.setShowSettings(prev => !prev); props.setShowAnnouncements(false)}}>
              <svg viewBox="0 0 48 48"><path d="M0 0h48v48h-48z" fill="none"/><path d="M38.86 25.95c.08-.64.14-1.29.14-1.95s-.06-1.31-.14-1.95l4.23-3.31c.38-.3.49-.84.24-1.28l-4-6.93c-.25-.43-.77-.61-1.22-.43l-4.98 2.01c-1.03-.79-2.16-1.46-3.38-1.97l-.75-5.3c-.09-.47-.5-.84-1-.84h-8c-.5 0-.91.37-.99.84l-.75 5.3c-1.22.51-2.35 1.17-3.38 1.97l-4.98-2.01c-.45-.17-.97 0-1.22.43l-4 6.93c-.25.43-.14.97.24 1.28l4.22 3.31c-.08.64-.14 1.29-.14 1.95s.06 1.31.14 1.95l-4.22 3.31c-.38.3-.49.84-.24 1.28l4 6.93c.25.43.77.61 1.22.43l4.98-2.01c1.03.79 2.16 1.46 3.38 1.97l.75 5.3c.08.47.49.84.99.84h8c.5 0 .91-.37.99-.84l.75-5.3c1.22-.51 2.35-1.17 3.38-1.97l4.98 2.01c.45.17.97 0 1.22-.43l4-6.93c.25-.43.14-.97-.24-1.28l-4.22-3.31zm-14.86 5.05c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" fill="currentColor"/></svg>
              <span><Translate nlString="Instellingen" enString="Settings" /></span>
            </button>
          </section>
          <button aria-label='logout' class='logout' onClick={logOut}>
            <svg viewBox="0 0 490.3 490.3"><path d="M0,121.05v248.2c0,34.2,27.9,62.1,62.1,62.1h200.6c34.2,0,62.1-27.9,62.1-62.1v-40.2c0-6.8-5.5-12.3-12.3-12.3s-12.3,5.5-12.3,12.3v40.2c0,20.7-16.9,37.6-37.6,37.6H62.1c-20.7,0-37.6-16.9-37.6-37.6v-248.2c0-20.7,16.9-37.6,37.6-37.6h200.6c20.7,0,37.6,16.9,37.6,37.6v40.2c0,6.8,5.5,12.3,12.3,12.3s12.3-5.5,12.3-12.3v-40.2c0-34.2-27.9-62.1-62.1-62.1H62.1C27.9,58.95,0,86.75,0,121.05z" fill="currentColor"/><path d="M385.4,337.65c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6l83.9-83.9c4.8-4.8,4.8-12.5,0-17.3l-83.9-83.9c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l63,63H218.6c-6.8,0-12.3,5.5-12.3,12.3c0,6.8,5.5,12.3,12.3,12.3h229.8l-63,63C380.6,325.15,380.6,332.95,385.4,337.65z" fill="currentColor"/></svg>
          </button>
        </nav>
    )
}
import { useAppState } from "../../context";

interface Props {
  setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>, 
  showSettings: boolean, 
  showAnnouncements: boolean, 
  setShowSettings: React.Dispatch<React.SetStateAction<boolean>>, 
  setShowAnnouncements: React.Dispatch<React.SetStateAction<boolean>>
}

export const Nav = ({setMenuOpen, showSettings, showAnnouncements, setShowSettings, setShowAnnouncements}: Props) => {
    const { isDesktop, settings, accounts, currentAccount, switchAccount, addNewAccount, logOut} = useAppState();

    return (
        <nav className="navbar" aria-label='primary'>
          <img draggable="false" width={56} height={56} className='logo' src={new URL('/favicon.png', import.meta.url).href} alt="logo"/>
          <div className="separator"></div>
          <div className="accounts">
            {accounts && accounts.map((acc, i) => {
              return <button className={`${(!showSettings && !showAnnouncements) && currentAccount === i ? "active" : ""}`} aria-label='switch to account' key={i}  onClick={() => {setMenuOpen(false); switchAccount(i); setShowSettings(false); setShowAnnouncements(false)}}>
                {acc.accountName.substring(0,2)}

                <span>{acc.accountName}</span>
              </button>
            })}
            {accounts.length <= 5 && <button aria-label='add account' className='add-account' onClick={() => {addNewAccount(); setShowSettings(false); setShowAnnouncements(false)}}>
              <svg viewBox="0 0 1024 1024"><path d="M960 448H576V64a64 64 0 0 0-128 0v384H64a64 64 0 0 0 0 128h384v384a64 64 0 0 0 128 0V576h384a64 64 0 0 0 0-128z" fill="currentColor" /></svg>
              
              <span>{settings.lng === "nl" ? "Account Toevoegen" : settings.lng === "en" ? "Add Account" : "Add Account"}</span>
            </button>}
            {!isDesktop && <button aria-label='announcements' className={`${showAnnouncements ? "active " : ""}announcements-btn`} onClick={() => {setMenuOpen(false); setShowSettings(false); setShowAnnouncements(prev => !prev)}}>
              <svg viewBox="0 0 1024 1024"><path d="M853.333333 85.333333H170.666667C123.52 85.333333 85.76 123.52 85.76 170.666667L85.333333 938.666667l170.666667-170.666667h597.333333c47.146667 0 85.333333-38.186667 85.333334-85.333333V170.666667c0-47.146667-38.186667-85.333333-85.333334-85.333334zM554.666667 469.333333h-85.333334V213.333333h85.333334v256z m0 170.666667h-85.333334v-85.333333h85.333334v85.333333z"  fill="currentColor"/></svg>
              
              <span>{settings.lng === "nl" ? "Mededelingen" : settings.lng === "en" ? "Announcements" : "Announcements"}</span>
            </button>}
            <button aria-label='settings' className={`${showSettings ? "active " : ""}settings-btn`} onClick={() => {setMenuOpen(false); setShowSettings(prev => !prev); setShowAnnouncements(false)}}>
            <svg viewBox="0 0 48 48">
              <path d="M0 0h48v48h-48z" fill="none"/>
              <path d="M38.86 25.95c.08-.64.14-1.29.14-1.95s-.06-1.31-.14-1.95l4.23-3.31c.38-.3.49-.84.24-1.28l-4-6.93c-.25-.43-.77-.61-1.22-.43l-4.98 2.01c-1.03-.79-2.16-1.46-3.38-1.97l-.75-5.3c-.09-.47-.5-.84-1-.84h-8c-.5 0-.91.37-.99.84l-.75 5.3c-1.22.51-2.35 1.17-3.38 1.97l-4.98-2.01c-.45-.17-.97 0-1.22.43l-4 6.93c-.25.43-.14.97.24 1.28l4.22 3.31c-.08.64-.14 1.29-.14 1.95s.06 1.31.14 1.95l-4.22 3.31c-.38.3-.49.84-.24 1.28l4 6.93c.25.43.77.61 1.22.43l4.98-2.01c1.03.79 2.16 1.46 3.38 1.97l.75 5.3c.08.47.49.84.99.84h8c.5 0 .91-.37.99-.84l.75-5.3c1.22-.51 2.35-1.17 3.38-1.97l4.98 2.01c.45.17.97 0 1.22-.43l4-6.93c.25-.43.14-.97-.24-1.28l-4.22-3.31zm-14.86 5.05c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z" fill="currentColor"/>
            </svg>
              
              <span>{settings.lng === "nl" ? "Instellingen" : settings.lng === "en" ? "Settings" : "Settings"}</span>
            </button>
          </div>
          <button aria-label='logout' className='logout' onClick={logOut}>
            <svg viewBox="0 0 490.3 490.3"><path d="M0,121.05v248.2c0,34.2,27.9,62.1,62.1,62.1h200.6c34.2,0,62.1-27.9,62.1-62.1v-40.2c0-6.8-5.5-12.3-12.3-12.3s-12.3,5.5-12.3,12.3v40.2c0,20.7-16.9,37.6-37.6,37.6H62.1c-20.7,0-37.6-16.9-37.6-37.6v-248.2c0-20.7,16.9-37.6,37.6-37.6h200.6c20.7,0,37.6,16.9,37.6,37.6v40.2c0,6.8,5.5,12.3,12.3,12.3s12.3-5.5,12.3-12.3v-40.2c0-34.2-27.9-62.1-62.1-62.1H62.1C27.9,58.95,0,86.75,0,121.05z" fill="currentColor"/><path d="M385.4,337.65c2.4,2.4,5.5,3.6,8.7,3.6s6.3-1.2,8.7-3.6l83.9-83.9c4.8-4.8,4.8-12.5,0-17.3l-83.9-83.9c-4.8-4.8-12.5-4.8-17.3,0s-4.8,12.5,0,17.3l63,63H218.6c-6.8,0-12.3,5.5-12.3,12.3c0,6.8,5.5,12.3,12.3,12.3h229.8l-63,63C380.6,325.15,380.6,332.95,385.4,337.65z" fill="currentColor"/></svg>
          </button>
        </nav>
    )
}
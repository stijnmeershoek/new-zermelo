import { Setter, Accessor, Show, createMemo } from "solid-js";
import { useAppState } from "../../context";
import { getCurrentDate, getMonday } from "../../utils/functions";
import './Header.css'

interface Props {
  offset: Accessor<number>,
  setOffset: Setter<number>,
  showAnnouncements: Accessor<boolean>, 
  showSettings: Accessor<boolean>, 
  menuOpen: Accessor<boolean>,
  setMenuOpen: Setter<boolean>,
  addAppointmentOpen: Accessor<boolean>,
  setAddAppointmentOpen: Setter<boolean>
}

export const Header = (props: Props) => {
    const { settings, isDesktop } = useAppState();
    const currentDate = createMemo(() => getCurrentDate(new Date(), props.offset()))

    return (
        <header class="header">
            <Show when={!isDesktop()}>
              <button tabIndex={0} aria-label="menu" aria-controls="primary-navigation" aria-expanded={`${props.menuOpen()}`} class='menu-hamburger' onClick={() => props.setMenuOpen(!props.menuOpen())}><svg viewBox="0 0 32 32" aria-hidden="true"><path fill='currentColor' d="M4,10h24c1.104,0,2-0.896,2-2s-0.896-2-2-2H4C2.896,6,2,6.896,2,8S2.896,10,4,10z M28,14H4c-1.104,0-2,0.896-2,2  s0.896,2,2,2h24c1.104,0,2-0.896,2-2S29.104,14,28,14z M28,22H4c-1.104,0-2,0.896-2,2s0.896,2,2,2h24c1.104,0,2-0.896,2-2  S29.104,22,28,22z"/></svg></button>
            </Show>
            <section aria-label='date'>
              <time dateTime={`${new Date()}`}>{<><span>{getMonday(currentDate()).toLocaleString(settings.lng || "default", { month: `${isDesktop() ? "long" : "short"}`})}</span><span>{getMonday(currentDate()).toLocaleString(settings.lng || "default", { year: 'numeric'})}</span></>}</time>
              <hr class="line"></hr>
              <h1>W{Math.ceil(Math.floor((Number(currentDate()) - Number(new Date(currentDate().getFullYear(), 0, 1))) / (24 * 60 * 60 * 1000)) / 7)}</h1>
            </section>
            <Show when={(!props.showAnnouncements() && !props.showSettings()) || isDesktop()}>
              <nav aria-label='change view' class="right">
                  <button class='prev' aria-label='previous week' onClick={() => props.setOffset(props.offset() - 1)}><svg viewBox="0, 0, 400,400" aria-hidden="true"><g><path id="path0" d="M133.594 60.920 C 129.853 62.938,1.851 191.233,0.820 193.996 C -0.234 196.823,-0.234 203.177,0.820 206.004 C 1.904 208.909,129.973 337.146,133.758 339.116 C 143.576 344.226,154.799 337.317,154.799 326.163 C 154.799 319.823,155.717 320.847,101.220 266.406 L 49.995 215.234 219.724 214.844 L 389.453 214.453 392.740 212.697 C 402.651 207.400,402.463 192.009,392.427 187.024 C 389.545 185.593,384.190 185.535,219.724 185.156 L 49.995 184.766 101.564 133.203 C 155.745 79.028,154.953 79.923,154.813 72.963 C 154.604 62.544,142.897 55.899,133.594 60.920 " stroke="none" fill="currentColor" fill-rule="evenodd"></path></g></svg></button>
                  <button class='next' aria-label='next week' onClick={() => props.setOffset(props.offset() + 1)}><svg viewBox="0, 0, 400,400" aria-hidden="true"><g><path id="path0" d="M133.594 60.920 C 129.853 62.938,1.851 191.233,0.820 193.996 C -0.234 196.823,-0.234 203.177,0.820 206.004 C 1.904 208.909,129.973 337.146,133.758 339.116 C 143.576 344.226,154.799 337.317,154.799 326.163 C 154.799 319.823,155.717 320.847,101.220 266.406 L 49.995 215.234 219.724 214.844 L 389.453 214.453 392.740 212.697 C 402.651 207.400,402.463 192.009,392.427 187.024 C 389.545 185.593,384.190 185.535,219.724 185.156 L 49.995 184.766 101.564 133.203 C 155.745 79.028,154.953 79.923,154.813 72.963 C 154.604 62.544,142.897 55.899,133.594 60.920 " stroke="none" fill="currentColor" fill-rule="evenodd"></path></g></svg></button>
              </nav>
              <button class="add-appointment" aria-label="add appointment" onClick={() => props.setAddAppointmentOpen(!props.addAppointmentOpen())}><svg viewBox="0 0 1024 1024"><path d="M960 448H576V64a64 64 0 0 0-128 0v384H64a64 64 0 0 0 0 128h384v384a64 64 0 0 0 128 0V576h384a64 64 0 0 0 0-128z" fill="currentColor" /></svg></button>
            </Show>
          </header>
    )
}
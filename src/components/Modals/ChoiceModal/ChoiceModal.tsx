import { Accessor, createSignal, For, Show  } from "solid-js";
import { request } from "../../../api/requests";
import { useAppState } from "../../../context";
import { LessonBlock } from "../../LessonBlock";
import { Translate } from "../../Translate";

interface Props { 
  closeChoiceModal: () => void, 
  choiceModalOpen: Accessor<boolean>, 
  selectedLesson: Accessor<Appointment | undefined>
}

export const ChoiceModal = (props: Props) => {
    const {accounts, currentAccount} = useAppState();
    const [currentValue, setCurrentValue] = createSignal("");
  
    const postChoice = (e: Event) => {
      e.preventDefault();
      if(!currentValue) return;
      const {school, accessToken} = accounts()[currentAccount()];
      const abortController = new AbortController();
      const signal = abortController.signal
  
      request("POST", currentValue(), accessToken, school, signal).then(() => {
        props.closeChoiceModal();
      });
    }  
    return ( 
        <dialog onClick={(e) => {(e.target as HTMLElement).classList.contains("choice-modal") && props.closeChoiceModal()}} aria-modal="true" open={props.choiceModalOpen()} class={`${(props.choiceModalOpen() && props.selectedLesson()) ? "open " : ""}choice-modal`} aria-label='choice info'>
          <form onSubmit={postChoice} class={`${props.selectedLesson ? (props.selectedLesson()?.appointmentType + " ") : ""}${props.selectedLesson()?.cancelled ? "cancelled " : ""}content`}>
            <Show when={props.selectedLesson()}>
              <div class='form-scroller'>
              <Show when={props.selectedLesson()?.appointmentType !== "conflict"}>
                <div><LessonBlock isDesktop={() => true} lesson={props.selectedLesson()!} onClick={() => {}} /></div>
              </Show>
                <Show when={(props.selectedLesson() && props.selectedLesson()?.actions && props.selectedLesson()?.actions?.length !== 0)}>
                  <For each={props.selectedLesson()?.actions}>{(action) => (
                    <div>
                      <Show when={props.selectedLesson()?.appointmentType === "choice"}>
                        <input type="radio" name="enroll" id="enroll" value={action.post} checked={currentValue() === action.post} onChange={() => {setCurrentValue(action.post)}}/>
                      </Show>
                      <LessonBlock isDesktop={() => true} lesson={action.appointment} onClick={() => {}} />
                    </div>
                  )}</For>
                </Show>
              </div>
              <Show when={props.selectedLesson()?.appointmentType === "choice"}>
                <button disabled={!currentValue} type='submit' aria-label='enroll'>
                  <Show when={props.selectedLesson()?.studentEnrolled} fallback={<Translate nlString="Inschrijven" enString="Enroll" />}>
                    <Translate nlString="Uitschrijven" enString="Disenroll" />
                  </Show>
                </button>
              </Show>          
            </Show>
          </form>
        </dialog>
    )
  }
  
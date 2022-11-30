import { useState } from "preact/hooks";
import { request } from "../../../api/requests";
import { useAppState } from "../../../context";
import { LessonBlock } from "../../LessonBlock";

interface Props { 
  closeChoiceModal: () => void, 
  choiceModalOpen: boolean, 
  selectedLesson: Appointment | null | undefined}

export const ChoiceModal = ({closeChoiceModal, choiceModalOpen, selectedLesson}: Props) => {
    const [currentValue, setCurrentValue] = useState<string>();
    const {accounts, currentAccount, settings} = useAppState();
    const {school, accessToken} = accounts[currentAccount];
  
    const postChoice = (e: Event) => {
      e.preventDefault();
      if(!currentValue) return;
      const abortController = new AbortController();
      const signal = abortController.signal
  
      request("POST", currentValue, accessToken, school, signal).then(() => {
        closeChoiceModal();
      });
    }
  
    return ( <>
      <dialog onClick={(e) => {(e.target as HTMLElement).classList.contains("choice-modal") && closeChoiceModal()}} aria-modal="true" open={choiceModalOpen} className={`${(choiceModalOpen && selectedLesson) ? "open " : ""}choice-modal`} aria-label='choice info'>
        <form onSubmit={postChoice} className={`${selectedLesson ? (selectedLesson.appointmentType + " ") : ""}${selectedLesson?.cancelled ? "cancelled " : ""}content`}>
          {selectedLesson && <><div className='form-scroller'>{(selectedLesson && selectedLesson.actions && selectedLesson.actions.length !== 0) && (
            selectedLesson.actions.map((action) => {
              return <div key={action.appointment.id}>
                {selectedLesson.appointmentType === "choice" && <input type="radio" name="enroll" id="enroll" value={action.post} checked={currentValue === action.post} onChange={() => {setCurrentValue(action.post)}}/>}
                <LessonBlock lesson={action.appointment} onClick={() => {}} />
              </div>
            })
          )}</div>
          {selectedLesson.appointmentType === "choice" && <button disabled={!currentValue} type='submit' aria-label='enroll'>{!selectedLesson.studentEnrolled ? settings.lng === "nl" ? "Inschrijven" : settings.lng === "en" ? "Enroll" : "Enroll" : settings.lng === "nl" ? "Uitschrijven" : settings.lng === "en" ? "Disenroll" : "Disenroll"}</button>}</>}
        </form>
      </dialog>
      </>
    )
  }
  
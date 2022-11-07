import { FormEvent, useState } from "react";
import { postEnroll } from "../../../api/Zermelo";
import { LessonBlock } from "../../LessonBlock";

export const ChoiceModal = ({currentAccount, closeChoiceModal, choiceModalOpen, isDesktop, lng, selectedLesson}: {currentAccount: {accountName: string,school: string,accessToken: string}, closeChoiceModal: () => void, choiceModalOpen: boolean, isDesktop: boolean, lng: string, selectedLesson: Appointment | null | undefined}) => {
    const [currentValue, setCurrentValue] = useState<string>();
    const school = currentAccount.school, token = currentAccount.accessToken;
  
    const enrollInChoice = async (e: FormEvent) => {
      e.preventDefault();
      if(!currentValue) return;
      const abortController = new AbortController();
      const signal = abortController.signal
  
      await postEnroll(token, school, currentValue, signal);
      closeChoiceModal();
    }
  
    return ( <>
      <dialog onClick={(e) => {(e.target as HTMLElement).classList.contains("choice-modal") && closeChoiceModal()}} aria-modal="true" open={choiceModalOpen} className={`${(choiceModalOpen && selectedLesson) ? "open " : ""}choice-modal`} aria-label='choice info'>
        <form onSubmit={enrollInChoice} className={`${selectedLesson ? (selectedLesson.appointmentType + " ") : ""}${selectedLesson?.cancelled ? "cancelled " : ""}content`}>
          {selectedLesson && <><div className='form-scroller'>{(selectedLesson && selectedLesson.actions && selectedLesson.actions.length !== 0) && (
            selectedLesson.actions.map((action) => {
              return <div key={action.appointment.id}>
                <input type="radio" name="enroll" id="enroll" value={action.post} checked={currentValue === action.post} onChange={() => {setCurrentValue(action.post)}}/>
                <LessonBlock lng={lng} lesson={action.appointment} onClick={() => {}} isDesktop={isDesktop} />
              </div>
            })
          )}</div>
          <button disabled={!currentValue} type='submit' aria-label='enroll'>{lng === "nl" ? "Inschrijven" : lng === "en" ? "Enroll" : "Enroll"}</button></>}
        </form>
      </dialog>
      </>
    )
  }
  
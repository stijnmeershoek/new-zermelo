export const LessonModal = ({closeLessonModal, lessonModalOpen, lng, selectedLesson}: {closeLessonModal: () => void, lessonModalOpen: boolean, lng: string, selectedLesson: Appointment | null | undefined}) => {
    return (
      <dialog onClick={closeLessonModal} aria-modal="true" open={lessonModalOpen} className={`${(lessonModalOpen && selectedLesson) ? "open " : ""}lesson-modal`} aria-label='lesson info'>
        <div className={`${selectedLesson ? (selectedLesson.appointmentType + " ") : ""}${selectedLesson?.cancelled ? "cancelled " : ""}content`}>
          {selectedLesson && (
            <>
              <span>{selectedLesson.appointmentType}</span>
              <div><span>{lng === "nl" ? "Vak" : lng === "en" ? "Subject" : "Subject"}</span>: <span>{selectedLesson.subjects.length <= 1 ? selectedLesson!.subjects[0] : `${selectedLesson.subjects[0]}, ${selectedLesson.subjects[1]}${selectedLesson!.subjects.length > 2 ? "+" : ""}`}<span className='change'>{selectedLesson.status?.some((status) => status.code === 3014)}</span></span></div>
              <div><span>{lng === "nl" ? "Docent" : lng === "en" ? "Teacher" : "Teacher"}</span>: {selectedLesson.teachers!.length > 0 && <span aria-label='teacher'>{selectedLesson.teachers!.length <= 1 ? selectedLesson.teachers![0].toUpperCase() : `${selectedLesson.teachers![0].toUpperCase()}, ${selectedLesson.teachers![1].toUpperCase()}${selectedLesson.teachers!.length > 2 ? "+" : ""}`}<span className='change'>{selectedLesson.status?.some((status) => status.code === 3011)}</span></span>}</div>
              <div><span>{lng === "nl" ? "Lokaal" : lng === "en" ? "Classroom" : "Classroom"}</span>: {selectedLesson.locations!.length > 0 && <span aria-label='location'>{selectedLesson.locations!.length <= 1 ? selectedLesson.locations![0] : `${selectedLesson.locations![0]}, ${selectedLesson.locations![1]}${selectedLesson.locations!.length > 2 ? "+" : ""}`}<span className='change'>{selectedLesson.status?.some((status) => status.code === 3012)}</span></span>}</div>
              <div><span>{lng === "nl" ? "Tijden" : lng === "en" ? "Times" : "Times"}</span>: <span className='times'><time aria-label='lesson start' dateTime={`${new Date(selectedLesson.start * 1000)}`}>{String(new Date(selectedLesson.start * 1000).getHours())}:{String(new Date(selectedLesson.start * 1000).getMinutes()).padStart(2,'0')}</time>-<time aria-label='lesson end' dateTime={`${new Date(selectedLesson.end * 1000)}`}>{String(new Date(selectedLesson.end * 1000).getHours())}:{String(new Date(selectedLesson.end * 1000).getMinutes()).padStart(2,'0')}</time><span className='change'>{selectedLesson.status?.some((status) => status.code === 3015)}</span></span></div>
              {(selectedLesson.changeDescription || selectedLesson.schedulerRemark) &&<div className='remarks'>
              <span className='title'>{lng === "nl" ? "Opmerking" : lng === "en" ? "Remark" : "Remark"}:</span>
              {selectedLesson.changeDescription && <span>{selectedLesson.changeDescription}</span>}
              {selectedLesson.schedulerRemark && <span>{selectedLesson.schedulerRemark}</span>}
              </div>}
            </>
          )}
        </div>
      </dialog>
    )
  }
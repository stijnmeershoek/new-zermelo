import { Accessor, Show } from "solid-js";
import { Translate } from "../../Translate";

interface Props {
  closeLessonModal: () => void, 
  lessonModalOpen: Accessor<boolean>, 
  selectedLesson: Accessor<Appointment | undefined>
}

export const LessonModal = (props: Props) => {
    return (
      <dialog onClick={(e) => (e.target as HTMLElement).classList.contains('lesson-modal') && props.closeLessonModal()} aria-modal="true" open={props.lessonModalOpen()} class='lesson-modal' aria-label='lesson info'>
        <div class={`${props.selectedLesson() ? (props.selectedLesson()?.appointmentType + " ") : ""}${props.selectedLesson()?.cancelled ? "cancelled " : ""}content`}>
          <Show when={props.selectedLesson()}>
          <>
              <span>{props.selectedLesson()?.appointmentType}</span>
              <div>
                <span><Translate nlString="Vak" enString="Subject" />: </span>
                <span>
                  <Show when={props.selectedLesson()!.subjects.length <= 1} fallback={`${props.selectedLesson()?.subjects[0]}, ${props.selectedLesson()?.subjects[1]}${props.selectedLesson()!.subjects.length > 2 ? "+" : ""}`}>
                    {props.selectedLesson()!.subjects[0] }
                  </Show>
                  <span class='change'>{props.selectedLesson()?.status?.some((status) => status.code === 3014)}</span>
                </span>
              </div>
              <div>
                <span><Translate nlString="Docent" enString="Teacher" />: </span>
                <Show when={props.selectedLesson()!.teachers.length > 0}>
                  <span aria-label='teacher'>
                    <Show when={props.selectedLesson()!.teachers.length <= 1 } fallback={`${props.selectedLesson()?.teachers![0].toUpperCase()}, ${props.selectedLesson()?.teachers![1].toUpperCase()}${props.selectedLesson()!.teachers!.length > 2 ? "+" : ""}`}>
                      {props.selectedLesson()?.teachers![0].toUpperCase()}
                    </Show>
                    <span class='change'>{props.selectedLesson()?.status?.some((status) => status.code === 3011)}</span>
                  </span>
                </Show>
              </div>
              <div>
                <span><Translate nlString="Lokaal" enString="Classroom" />: </span>
                <Show when={props.selectedLesson()?.locations.length !== 0}>
                  <span aria-label='location'>
                    <Show when={props.selectedLesson()!.locations.length <= 1} fallback={`${props.selectedLesson()?.locations![0]}, ${props.selectedLesson()?.locations![1]}${props.selectedLesson()!.locations!.length > 2 ? "+" : ""}`}>
                      {props.selectedLesson()!.locations[0]}
                    </Show>
                    <span class='change'>{props.selectedLesson()?.status?.some((status) => status.code === 3012)}</span>
                  </span>
                </Show>
              </div>
              <div>
                <span><Translate nlString="Tijden" enString="Times" />: </span> 
                <span class='times'>
                  <time aria-label='lesson start' dateTime={`${new Date(props.selectedLesson()!.start * 1000)}`}>
                    {String(new Date(props.selectedLesson()!.start * 1000).getHours())}:{String(new Date(props.selectedLesson()!.start * 1000).getMinutes()).padStart(2,'0')}
                  </time>
                  <span>-</span>
                  <time aria-label='lesson end' dateTime={`${new Date(props.selectedLesson()!.end * 1000)}`}>
                    {String(new Date(props.selectedLesson()!.end * 1000).getHours())}:{String(new Date(props.selectedLesson()!.end * 1000).getMinutes()).padStart(2,'0')}
                  </time>
                  <span class='change'>
                    {props.selectedLesson()?.status?.some((status) => status.code === 3015)}
                  </span>
                </span>
              </div>
              <Show when={(props.selectedLesson()?.changeDescription || props.selectedLesson()?.schedulerRemark)}>
                <div class='remarks'>
                  <span class='title'><Translate nlString="Opmerking" enString="Remark" />:</span>
                  <Show when={props.selectedLesson()?.changeDescription}>
                    <span>{props.selectedLesson()?.changeDescription}</span>
                  </Show>
                  <Show when={props.selectedLesson()?.schedulerRemark}>
                    <span>{props.selectedLesson()?.changeDescription}</span>
                  </Show>
                </div>
              </Show>
            </>
          </Show>
        </div>
      </dialog>
    )
  }
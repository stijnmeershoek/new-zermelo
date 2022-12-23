import { Accessor, createSignal, createEffect, on, onCleanup, Show, For, createMemo, Suspense, lazy } from 'solid-js';
const LessonModal = lazy(() => import('../Modals/LessonModal').then(module => ({ default: module.LessonModal })));
const ChoiceModal = lazy(() => import('../Modals/ChoiceModal').then(module => ({ default: module.ChoiceModal })));
import { Day } from './Day';
import { LinesAndTimes } from './LinesAndTimes';
import { useAppState } from '../../context';
import { getDates } from '../../utils/functions';
import './Schedule.css'

interface Props {
  offset: Accessor<number>,
  defaultOffset: Accessor<number>,
}

export const Schedule = (props: Props) => {
    const {user, settings, fetchLiveSchedule, scheduleLoad, datesLoad, scheduleHours} = useAppState()
    const [loading, setLoading] = createSignal(false);
    const [schedule, setSchedule] = createSignal<Appointment[][]>(scheduleLoad());
    const [dates, setDates] = createSignal<Date[]>(datesLoad());
    const currentDayNumber = createMemo(() => dates().findIndex(date => date.toDateString() === new Date().toDateString()));
    const rowAmount = createMemo(() => (scheduleHours()[scheduleHours().length - 1] - scheduleHours()[0]) * 12 + 3);
    const [lessonModalOpen, setLessonModalOpen] = createSignal(false);
    const [choiceModalOpen, setChoiceModalOpen] = createSignal(false);
    const [selectedLesson, setSelectedLesson] = createSignal<Appointment | undefined>();
    let scheduleRef: HTMLDivElement | undefined;
    let timeIndicatorRef: HTMLDivElement | undefined;
    let showChoicesRef = settings.showChoices;
    let enableCustomRef = settings.enableCustom;
    let choiceModalOpenRef = choiceModalOpen();

    createEffect(on(() => [props.offset(), settings.showChoices, settings.enableCustom, choiceModalOpen()], () => {
      if(choiceModalOpen() !== false) return;

      if(props.offset() === props.defaultOffset()) {
        setDates(datesLoad);
        if(props.offset() === props.defaultOffset() && showChoicesRef === settings.showChoices && enableCustomRef === settings.enableCustom && choiceModalOpenRef === choiceModalOpen()) {
          setSchedule(scheduleLoad);
          return;
        }
      }
            
      setLoading(true)
      
      const abortController = new AbortController();
      const signal = abortController.signal;
  
      const fetchData = async () => {
        const dates = await getDates(new Date(), props.offset());
        fetchLiveSchedule(user(), dates, props.offset(), signal).then((res) => {
          setDates(dates)
          setSchedule(res);
          setLoading(false);
        })
      }
  
      fetchData();

      onCleanup(() => abortController.abort())
    }));

    createEffect(on(() => [loading()], () => {
      if(!timeIndicatorRef || !scheduleRef) return;
      let date = new Date();

      if(date.getHours() > scheduleHours()[scheduleHours().length - 1] || date.getHours() < scheduleHours()[0]) {
        timeIndicatorRef.classList.add('!hidden');
        return;
      } else {
        timeIndicatorRef.classList.remove("!hidden");
      }

      let dayStart = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 8, 0);

      const changeTimePosition = () => {
        if(!scheduleRef || !timeIndicatorRef) return;
        let diff = (new Date().getTime() - dayStart.getTime());
        let diffMins = Math.floor((diff/1000/60) << 0);
        
        if(diffMins > rowAmount() * 5 || diffMins < 0) {
          timeIndicatorRef.classList.add("!hidden");
        } else {
          timeIndicatorRef.classList.remove("!hidden");
          const percent = (diffMins / (rowAmount() * 5)) * 100;
          const correction = scheduleRef.offsetHeight / rowAmount();
          timeIndicatorRef.style.cssText = `top: calc(${percent}% + ${correction}px);`
        }
      }

      changeTimePosition();

      const interval = setInterval(() => {
          changeTimePosition();
      }, 1000 * 30)

      onCleanup(() => clearInterval(interval))
    }))

    const openLessonModal = (lesson: Appointment) => {
      setSelectedLesson(lesson);
      setLessonModalOpen(true);
    }
  
    const closeLessonModal = () => {
        setLessonModalOpen(false);
        setSelectedLesson(undefined);
    }
  
    const openChoiceModal = (lesson: Appointment) => {
      setSelectedLesson(lesson);
      setChoiceModalOpen(true);
    }
  
    const closeChoiceModal = () => {
        setChoiceModalOpen(false);
        setSelectedLesson(undefined);
    }

    return (
      <>
        <section aria-label='schedule container' class='schedule-container'>
        <Show when={dates().length > 0}>
          <section aria-label='dates' class="dates">
              <div class="space">10:00</div>
              <div>
                <Show when={dates().length !== 0}>
                  <For each={dates()}>{(date, i) => (
                    <time dateTime={`${date}`} class={`date ${i() === currentDayNumber() ? "current" : ""}`}>
                      <span>{date.getDate().toString().padStart(2, '0')}</span>
                      <span>{date.toLocaleDateString(settings.lng || "default", {weekday: 'short'})}</span>
                      <div></div>
                  </time>
                  )}</For>
                </Show>
              </div>
          </section>
        </Show>

        <Show when={!loading()} fallback={<span class="loader"></span>}>
          <section  aria-label='schedule' class="scroller">
            <div ref={scheduleRef} aria-label='schedule grid' class="schedule-grid" style={{"grid-template-rows": ` auto repeat(${rowAmount()},minmax(0,1fr))`}}>
              <LinesAndTimes scheduleHours={scheduleHours}/>
              <div class="highlight" style={currentDayNumber() !== -1 ? {'grid-row': "1 / -1", 'grid-column': `${currentDayNumber() + 2}/${currentDayNumber() + 3}`} : {display: "none"}}></div>
      
              <Day schedule={schedule} scheduleMin={scheduleHours()[0]} dayNumber={0} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal}/>
      
              <Day schedule={schedule} scheduleMin={scheduleHours()[0]} dayNumber={1} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal}/>
      
              <Day schedule={schedule} scheduleMin={scheduleHours()[0]} dayNumber={2} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal}/>
      
              <Day schedule={schedule} scheduleMin={scheduleHours()[0]} dayNumber={3} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal}/>
      
              <Day schedule={schedule} scheduleMin={scheduleHours()[0]} dayNumber={4} openLessonModal={openLessonModal} openChoiceModal={openChoiceModal}/>
      
              <div ref={timeIndicatorRef} class="time-indicator">
                <div></div>
                <div></div>
              </div>
            </div>
          </section>
        </Show>
      </section>

      <Suspense>
        <Show when={lessonModalOpen()}><LessonModal closeModal={closeLessonModal} selectedLesson={selectedLesson}/></Show>
        <Show when={choiceModalOpen()}><ChoiceModal closeModal={closeChoiceModal} selectedLesson={selectedLesson}/></Show>
      </Suspense>
    </>
    )
  }
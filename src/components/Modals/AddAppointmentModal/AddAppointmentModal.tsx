import { Accessor, Setter } from "solid-js"
import { createStore } from "solid-js/store";
import { useAppState } from "../../../context";
import { Translate } from "../../Translate";
import './AddAppointmentModal.css'

interface Props {
    addAppointmentOpen: Accessor<boolean>,
    setAddAppointmentOpen: Setter<boolean>
}

type MakeAppointment = {
    start: string,
    end: string,
    appointmentType: string,
    title: string,
    location: string,
}

export const AddAppointmentModal = (props: Props) => {
    const {scheduleHours} = useAppState();

    const [form, setForm] = createStore<MakeAppointment>({
        start: new Date().toISOString().slice(0,16),
        end: new Date().toISOString().slice(0,16),
        appointmentType: "lesson",
        title: "",
        location: "",
    });

    const updateFormField = (fieldName: string) => (event: Event) => {
        const inputElement = event.currentTarget as HTMLInputElement;
        if(inputElement.name === "start" && new Date(inputElement.value) > new Date(form.end)) return;
        if(inputElement.name === "end" && new Date(inputElement.value) < new Date(form.start)) return;

        setForm({
            [fieldName]: inputElement.value
        });
    };

    const onSubmit = (e: Event) => {
        e.preventDefault();
        if(!form.start || !form.end || !form.title) return;
        const appointment: Appointment = {
            start: Math.floor(new Date(form.start).getTime() / 1000),
            end: Math.floor(new Date(form.end).getTime() / 1000),
            cancelled: false,
            appointmentType: form.appointmentType,
            online: false,
            optional: false,
            subjects: [`${form.title}`],
            groups: [],
            teachers: [],
            locations: [`${form.location}`]
        }
        console.log(appointment);
    }

    return (
        <dialog onClick={(e) => {(e.target as HTMLElement).classList.contains("add-appointment-modal") && props.setAddAppointmentOpen(false)}} aria-modal="true" open={props.addAppointmentOpen()} class='add-appointment-modal' aria-label='add appointment'>
            <div class={`content ${form.appointmentType}`}>
                <h2><Translate nlString="Maak een nieuwe afspraak" enString="Create a new appointment"/></h2>
                <form onSubmit={onSubmit}>
                    <label for="appointmentType"><Translate nlString="Afspraak type" enString="Appointment type" />:</label>
                    <select name="appointmentType" id="appointmentType" value={form.appointmentType} onInput={updateFormField('appointmentType')}>
                        <option value="lesson"><Translate nlString="Les" enString="Lesson" /></option>
                        <option value="activity"><Translate nlString="Activiteit" enString="Activity" /></option>
                        <option value="meeting"><Translate nlString="Vergadering" enString="Meeting" /></option>
                        <option value="talk"><Translate nlString="Gesprek" enString="Talk" /></option>
                        <option value="exam"><Translate nlString="Examen" enString="Exam" /></option>
                        <option value="other"><Translate nlString="Anders" enString="Other" /></option>
                    </select>
                    <label for="start"><Translate nlString="Begin" enString="Start"/>:</label>
                    <input type="datetime-local" name="start" id="start" value={form.start} onChange={updateFormField("start")} min={`${new Date(new Date().setHours(scheduleHours()[0])).toISOString().slice(0,16)}`} required />
                    <label for="end"><Translate nlString="Einde" enString="End" />:</label>
                    <input type="datetime-local" name="end" id="end" onChange={updateFormField("end")} min={`${form.start}`} required/>
                    <label for="title"><Translate nlString="Titel" enString="Title" />:</label>
                    <input type="text" name="title" id="title" value={form.title} onInput={updateFormField("title")} required/>
                    <label for="location"><Translate nlString="Locatie" enString="Location" />:</label>
                    <input type="text" name="location" id="location" value={form.location} onInput={updateFormField("location")}/>
                    <button type="submit"><Translate nlString="Toevoegen" enString="Add" /></button>
                </form>
            </div>
        </dialog>
    )
}
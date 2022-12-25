import { createEffect, createSignal, Setter, createMemo } from "solid-js"
import { createStore } from "solid-js/store";
import { useAppState } from "../../../context";
import { Translate } from "../../Translate";
import './AddAppointmentModal.css'

type Props = {
    setAddAppointmentOpen: Setter<boolean>
}

type MakeAppointment = {
    day: string,
    start: string,
    end: string,
    appointmentType: string,
    title: string,
    location: string,
}

export const AddAppointmentModal = (props: Props) => {
    const {user,scheduleHours,localPREFIX} = useAppState();
    const [err, setErr] = createSignal({nlString: "", enString: ""});
    const [open, setOpen] = createSignal(false);
    const minString = createMemo(() => `${scheduleHours()[0]}:00`.padStart(5, "0"))
    const maxString =  createMemo(() => `${scheduleHours()[scheduleHours().length - 1]}:00`.padStart(5, "0"))
    const min =  createMemo(() => Number(minString().replace(/:\s*/g, "")));
    const max = createMemo(() => Number(maxString().replace(/:\s*/g, "")));

    createEffect(() => {
        setTimeout(() => {
            setOpen(true)
        }, 1)
    })

    const closeModal = () => {
        setOpen(false);
        setTimeout(() => {
            props.setAddAppointmentOpen(false);
        }, 150)
    }

    const [form, setForm] = createStore<MakeAppointment>({
        day: "",
        start: "",
        end: "",
        appointmentType: "lesson",
        title: "",
        location: "",
    });

    const updateFormField = (fieldName: string) => (event: Event) => {
        const inputElement = event.currentTarget as HTMLInputElement;;
        if(inputElement.name === "start" || inputElement.name === "end") {
            setErr({nlString: "", enString: ""})
            const value = Number(inputElement.value.replace(/:\s*/g, "").padStart(4, "0"));
            if((value < min() || value > max())) {
                setErr({nlString: `Tijden moeten tussen ${minString} en ${maxString} zijn.`, enString: `Times must be between ${minString} and ${maxString}`})
                return;
            };
            if(inputElement.name === "end" && value < Number(form.start.replace(/:\s*/g, "").padStart(4, "0"))) {
                setErr({nlString: `Einde mag niet voor het begin zijn`, enString: `End mustn't be before start`})
                return;
            }
        }

        setForm({
            [fieldName]: inputElement.value
        });
    };

    const onSubmit = (e: Event) => {
        e.preventDefault();
        if(!form.day || !form.start || !form.end || !form.title) return;
        const appointment: Appointment = {
            start: Math.floor(new Date(`${form.day}T${form.start}`).getTime() / 1000),
            end: Math.floor(new Date(`${form.day}T${form.end}`).getTime() / 1000),
            cancelled: false,
            appointmentType: form.appointmentType,
            online: false,
            optional: false,
            subjects: [`${form.title}`],
            groups: [],
            teachers: [],
            locations: [`${form.location}`]
        }
        addCustomAppointment(appointment)
    }

    const addCustomAppointment = (appointment: Appointment) => {
        if(!user) return;
        const obj: CustomAppointments = JSON.parse(localStorage.getItem(`${localPREFIX}-customappointments`) || "{}");
        if(!obj[user()]) obj[user()] = [];
        const overlap = obj[user()].some(app => (appointment.start > app.start && appointment.start < app.end) || (appointment.end < app.end && appointment.end > app.start));
        if(overlap) {
            setErr({nlString: "Afspraken mogen niet overlappen.", enString: "Appointments mustn't overlap."});
            return;
        }
        obj[user()].push(appointment);
        localStorage.setItem(`${localPREFIX}-customappointments`, JSON.stringify(obj))
        closeModal();
      }

    return (
        <dialog onClick={(e) => {(e.target as HTMLElement).classList.contains("add-appointment-modal") && closeModal()}} aria-modal="true" open={open()} class='add-appointment-modal' aria-label='add appointment'>
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
                    <label for="day"><Translate nlString="Dag" enString="Day"/>:</label>
                    <input type="date" name="day" id="day" onChange={updateFormField("day")} min={`${new Date().toISOString().slice(0,10)}`} required />
                    
                    <label for="start"><Translate nlString="Begin" enString="Start"/>:</label>
                    <input type="time" name="start" id="start" value={form.start} onChange={updateFormField("start")} min={minString()} max={maxString()} required />

                    <label for="end"><Translate nlString="Einde" enString="End"/>:</label>
                    <input type="time" name="end" id="end" value={form.end} onChange={updateFormField("end")} min={minString()} max={maxString()} required />
                    
                    <label for="title"><Translate nlString="Titel" enString="Title" />:</label>
                    <input type="text" name="title" id="title" value={form.title} onInput={updateFormField("title")} required/>
                    <label for="location"><Translate nlString="Locatie" enString="Location" />:</label>
                    <input type="text" name="location" id="location" value={form.location} onInput={updateFormField("location")}/>
                    <span class="err"><Translate nlString={err().nlString} enString={err().enString}/></span>
                    <button type="submit" disabled={err().nlString !== "" || err().enString !== ""}><Translate nlString="Toevoegen" enString="Add" /></button>
                </form>
            </div>
        </dialog>
    )
}
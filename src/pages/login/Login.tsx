import { Accessor, createSignal, Show } from "solid-js"
import { createStore } from "solid-js/store";
import { getAccessToken } from "../../api/requests";
import { Translate } from "../../components/Translate";
import { useAppState } from "../../context";
import './Login.css'

interface Props {
  addAccount: Accessor<boolean>
}

type LoginForm = {
  name: string,
  school: string, 
  code: string,
}

export function Login(props: Props) {
    const {localPREFIX, logIn, toggleAddAccount} = useAppState();
    const [err, setErrMessage] = createSignal({nlString: "", enString: ""});
    const [form, setForm] = createStore<LoginForm>({
      name: "",
      school: "",
      code: "",
    });
  
    const updateFormField = (fieldName: string) => (event: Event) => {
      const inputElement = event.currentTarget as HTMLInputElement;
      if (inputElement.type === "checkbox") {
        setForm({
          [fieldName]: !!inputElement.checked
        });
      } else {
        setForm({
          [fieldName]: inputElement.value
        });
      }
    };

    const handleSubmit = () => {
      setErrMessage({nlString: "", enString: ""});
      const oldAccounts: Account[] = JSON.parse(localStorage.getItem(`${localPREFIX}-accounts`) || "[]");
      if(oldAccounts.some(account => account.accountName === form.name)) {
        setErrMessage({nlString: "Er bestaat al een account met deze naam.", enString: "An account with this name already exists."});
        return;
      }
      getAccessToken(form.school, form.code.replace(/\s+/g, ''))
      .then((accessToken: string) => {
        const newAccount = {
          accountName: form.name,
          school: form.school,
          accessToken: accessToken
        }
       
        logIn(newAccount, oldAccounts);
      }).catch((err: Error) => {
        setErrMessage({nlString: "", enString: err.message});
      });
    }

  return (
    <div class="login">
      <Show when={props.addAccount()}>
        <button class='back' aria-label='go back' onClick={toggleAddAccount}><svg viewBox="0, 0, 400,400"><g><path id="path0" d="M133.594 60.920 C 129.853 62.938,1.851 191.233,0.820 193.996 C -0.234 196.823,-0.234 203.177,0.820 206.004 C 1.904 208.909,129.973 337.146,133.758 339.116 C 143.576 344.226,154.799 337.317,154.799 326.163 C 154.799 319.823,155.717 320.847,101.220 266.406 L 49.995 215.234 219.724 214.844 L 389.453 214.453 392.740 212.697 C 402.651 207.400,402.463 192.009,392.427 187.024 C 389.545 185.593,384.190 185.535,219.724 185.156 L 49.995 184.766 101.564 133.203 C 155.745 79.028,154.953 79.923,154.813 72.963 C 154.604 62.544,142.897 55.899,133.594 60.920 " stroke="none" fill="currentColor" fill-rule="evenodd"></path></g></svg></button>
      </Show>
      <form onSubmit={(e) => {e.preventDefault(); handleSubmit()}}>
        <h1>
          <Show when={props.addAccount()} fallback={<Translate nlString="Login" enString="Login" />}>
            <Translate nlString="Account Toevoegen" enString="Add Account" />
          </Show>
        </h1>
        
        <label for="name"><Translate nlString="Account Naam" enString="Account Name"/></label>
        <input id="name" value={form.name} class={`${err() ? "err" : ""}`} onInput={updateFormField("name")} type="text" required/>
        
        <label for="school">School</label>
        <input id="school" value={form.school} class={`${err() ? "err" : ""}`} onInput={updateFormField("school")} type="text" required/>
        
        <label for="code">Code</label>
        <input autocomplete="off" id="code" value={form.code} class={`${err() ? "err" : ""}`} onInput={updateFormField("code")} type="text" required/>
        
        <button aria-label="login" type="submit">
          <Show when={props.addAccount()} fallback={<Translate nlString="Login" enString="Login" />}>
            <Translate nlString="Account Toevoegen" enString="Add Account" />
          </Show>
        </button>
        <span class="err"><Translate nlString={err().nlString} enString={err().enString}/></span>
      </form>
    </div>
  )
}
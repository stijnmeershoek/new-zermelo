import { useState } from "react"
import { getAccessToken } from "../../api/requests";
import { useAppState } from "../../context";

interface Props {
  addAccount: boolean
}

export function Login({addAccount}: Props) {
    const {localPREFIX, settings, logIn, goBack} = useAppState();
    const [err, setErrMessage] = useState("");
    const [name, setName] = useState<string>("");
    const [school, setSchool] = useState<string>("");
    const [code, setCode] = useState<string>("");

    const onSubmit = (school: string, code: string, name: string) => {
      setErrMessage("");
      const oldAccounts: Account[] = JSON.parse(localStorage.getItem(`${localPREFIX}-accounts`) || "[]");
      if(oldAccounts.some(account => account.accountName === name)) {
        setErrMessage(`${settings.lng === "nl" ? "Er bestaat al een account met deze naam." : settings.lng === "en" ? "An account with this name already exists." : "An account with this name already exists."}`);
        return;
      }
      getAccessToken(school, code)
      .then((accessToken: string) => {
        const newAccount = {
          accountName: name,
          school: school,
          accessToken: accessToken
        }
       
        logIn(newAccount, oldAccounts);
      }).catch((err: Error) => {
        setErrMessage(err.message);
      });
    }

  return (
    <div className="login">
      {addAccount && (
        <button className='back' aria-label='go back' onClick={goBack}><svg viewBox="0, 0, 400,400"><g><path id="path0" d="M133.594 60.920 C 129.853 62.938,1.851 191.233,0.820 193.996 C -0.234 196.823,-0.234 203.177,0.820 206.004 C 1.904 208.909,129.973 337.146,133.758 339.116 C 143.576 344.226,154.799 337.317,154.799 326.163 C 154.799 319.823,155.717 320.847,101.220 266.406 L 49.995 215.234 219.724 214.844 L 389.453 214.453 392.740 212.697 C 402.651 207.400,402.463 192.009,392.427 187.024 C 389.545 185.593,384.190 185.535,219.724 185.156 L 49.995 184.766 101.564 133.203 C 155.745 79.028,154.953 79.923,154.813 72.963 C 154.604 62.544,142.897 55.899,133.594 60.920 " stroke="none" fill="currentColor" fillRule="evenodd"></path></g></svg></button>
      )}
      <form onSubmit={(e) => {e.preventDefault(); onSubmit(school, code, name)}}>
        <h1>{addAccount ? settings.lng === "nl" ? "Account Toevoegen" : settings.lng === "en" ? "Add Account" : "Add Account" : settings.lng === "nl" ? "Login" : settings.lng === "en" ? "Login" : "Login"}</h1>
        <label htmlFor="name">{settings.lng === "nl" ? "Account Naam" : settings.lng === "en" ? "Account Name" : "Account Name"}</label>
        <input id="name" value={name} className={`${err ? "err" : ""}`} onChange={(e) => setName(e.target.value)} type="text" required/>
        <label htmlFor="school">School</label>
        <input id="school" value={school} className={`${err ? "err" : ""}`} onChange={(e) => setSchool(e.target.value)} type="text" required/>
        <label htmlFor="code">Code</label>
        <input autoComplete="off" id="code" value={code} className={`${err ? "err" : ""}`} onChange={(e) => setCode(e.target.value.replace(/\s+/g, ''))} type="text" required/>
        <button aria-label="login" type="submit">{addAccount ? settings.lng === "nl" ? "Account Toevoegen" : settings.lng === "en" ? "Add Account" : "Add Account" : settings.lng === "nl" ? "Login" : settings.lng === "en" ? "Login" : "Login"}</button>
        {err !== "" && <span className="err">{err}</span>}
      </form>
    </div>
   
  )
}

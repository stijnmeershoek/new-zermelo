import { useState } from "react"
import { getAccessToken } from "../../api/requests";
import { useAppState } from "../../context";

export function Login() {
    const {localPREFIX, settings, logIn} = useAppState();
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
      .then(async (accessToken: string) => {
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
        <form onSubmit={(e) => {e.preventDefault(); onSubmit(school, code, name)}}>
          <h1>Login</h1>
          <label htmlFor="name">{settings.lng === "nl" ? "Account Naam" : settings.lng === "en" ? "Account Name" : "Account Name"}</label>
          <input id="name" value={name} className={`${err ? "err" : ""}`} onChange={(e) => setName(e.target.value)} type="text" required/>
          <label htmlFor="school">School</label>
          <input id="school" value={school} className={`${err ? "err" : ""}`} onChange={(e) => setSchool(e.target.value)} type="text" required/>
          <label htmlFor="code">Code</label>
          <input autoComplete="off" id="code" value={code} className={`${err ? "err" : ""}`} onChange={(e) => setCode(e.target.value.replace(/\s+/g, ''))} type="text" required/>
          <button aria-label="login" type="submit">Login</button>
          {err !== "" && <span className="err">{err}</span>}
        </form>
    </div>
   
  )
}

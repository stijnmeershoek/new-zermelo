import { useState } from "react"
import './Login.css';

interface Props {
    onSubmit: (school: string, code: string) => void,
    err: string
}

export function Login({onSubmit, err}: Props) {
    const [school, setSchool] = useState<string>("");
    const [code, setCode] = useState<string>("");

  return (
    <div className="login">
        <form onSubmit={(e) => {e.preventDefault(); onSubmit(school, code)}}>
          <h1>Login</h1>
          <label htmlFor="school">School</label>
          <input id="school" value={school} className={`${err ? "err" : ""}`} onChange={(e) => setSchool(e.target.value)} type="text" required/>
          <label htmlFor="code">Code</label>
          <input id="code" value={code} className={`${err ? "err" : ""}`} onChange={(e) => setCode(e.target.value.replace(/\s+/g, ''))} type="text" required/>
          <button aria-label="login" type="submit">Login</button>
          {err !== "" && <span className="err">{err}</span>}
        </form>
    </div>
   
  )
}

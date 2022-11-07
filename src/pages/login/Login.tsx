import { useState } from "react"

interface Props {
    lng: string,
    onSubmit: (school: string, code: string, name: string) => void,
    err: string
}

export function Login({lng, onSubmit, err}: Props) {
    const [name, setName] = useState<string>("");
    const [school, setSchool] = useState<string>("");
    const [code, setCode] = useState<string>("");

  return (
    <div className="login">
        <form onSubmit={(e) => {e.preventDefault(); onSubmit(school, code, name)}}>
          <h1>Login</h1>
          <label htmlFor="name">{lng === "nl" ? "Account Naam" : lng === "en" ? "Account Name" : "Account Name"}</label>
          <input id="name" value={name} className={`${err ? "err" : ""}`} onChange={(e) => setName(e.target.value)} type="text" required/>
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

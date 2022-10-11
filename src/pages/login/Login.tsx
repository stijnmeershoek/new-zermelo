import { useState } from "react"

interface Props {
    onSubmit: (school: string, code: string) => void
}

export function Login({onSubmit}: Props) {
    const [school, setSchool] = useState<string>("");
    const [code, setCode] = useState<string>("");

  return (
    <div className="login">
        <form onSubmit={(e) => {e.preventDefault(); onSubmit(school, code)}}>
            <input value={school} onChange={(e) => setSchool(e.target.value)} type="text" required/>
            <input value={code} onChange={(e) => setCode(e.target.value.replace(/\s+/g, ''))} type="text" required/>
            <button type="submit">Login</button>
        </form> 
    </div>
   
  )
}

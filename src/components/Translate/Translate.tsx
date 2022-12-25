import { Match, Switch } from "solid-js"
import { useAppState } from "../../context"

type Props = {
    nlString: string,
    enString: string
}

export const Translate = (props: Props) => {
    const {settings} = useAppState();

    return (
        <Switch fallback={props.enString}>
            <Match when={settings.lng === "nl"}>
                {props.nlString}
            </Match>
            <Match when={settings.lng === "en"}>
                {props.enString}
            </Match>
        </Switch>
    )
}
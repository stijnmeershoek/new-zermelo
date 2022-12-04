import { Show } from "solid-js"
import { useAppState } from "../../context"

interface Props {
    nlString: string,
    enString: string
}

export const Translate = (props: Props) => {
    const {settings} = useAppState();

    return (
        <Show when={props.nlString !== "" && props.enString !== ""} fallback={""}>
            <Show when={settings.lng === "nl" && props.nlString !== ""} fallback={props.enString}>
                {props.nlString}
            </Show>
        </Show>
    )
}
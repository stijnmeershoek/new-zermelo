import { createEffect, onCleanup } from "solid-js";

type Props = {
  eventName: string,
  handler: Function,
  element: HTMLElement | (Window & typeof globalThis)
}

export const useEventListener = (props: Props) => {
  let savedHandler = props.handler;

  createEffect(() => {
    const isSupported = props.element && props.element.addEventListener;
    if (!isSupported) return;

    const eventListener = (event: any) => savedHandler(event);
    props.element.addEventListener(props.eventName, eventListener);

    onCleanup(() => props.element.removeEventListener(props.eventName, eventListener))
  })
};
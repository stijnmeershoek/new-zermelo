import { createEffect, on, onCleanup } from "solid-js";

export const useEventListener = (eventName: string, handler: Function, element = window) => {
  let savedHandler = handler;

  createEffect(
    on(() => handler, () => {
      savedHandler = handler;
    })
  );

  createEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const eventListener = (event: any) => savedHandler(event);
    element.addEventListener(eventName, eventListener);

    onCleanup(() => element.removeEventListener(eventName, eventListener))
  })
};
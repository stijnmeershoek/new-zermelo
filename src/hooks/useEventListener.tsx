import { useEffect, useRef } from "preact/hooks";

export const useEventListener = (eventName: string, handler: Function, element = window) => {
    const savedHandler = useRef<any>(null);

    useEffect(() => {
      savedHandler.current = handler;
    }, [handler]);
  
    useEffect(() => {
        const isSupported = element && element.addEventListener;
        if (!isSupported) return;
  
        const eventListener = (event: any) => savedHandler.current(event);
        element.addEventListener(eventName, eventListener);
  
        return () => {
          element.removeEventListener(eventName, eventListener);
        };
    }, [eventName, element]);
};
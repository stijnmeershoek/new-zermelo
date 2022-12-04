import { createSignal, createEffect, onCleanup } from "solid-js";

interface Props {
  query: string
}

export const useMediaQuery = (props: Props) => {
  const [matches, setMatches] = createSignal(window.matchMedia(props.query).matches);

  createEffect(() => {
      const media = window.matchMedia(props.query);
      const listener = () => {
        if(media.matches === matches()) return;
        setMatches(media.matches)
      };
      window.addEventListener("resize", listener);
      onCleanup(() => window.removeEventListener("resize", listener))
  });

  return matches;
}
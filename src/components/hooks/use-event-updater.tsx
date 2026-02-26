import { useEffect, useReducer } from "react";
import { eventDispatcher, EventMap } from "../../events/event-dispatcher";

export function useEventUpdater<E extends keyof EventMap>(...events: E[]) {
  const [, forceUpdate] = useReducer((x) => x + 1, 0);

  useEffect(() => {
    // On first mount, subscribe to the event
    events.forEach((event) => eventDispatcher.on(event, forceUpdate));

    // On unmount
    return () => {
      // Unsubscribe from the event
      events.forEach((event) => eventDispatcher.off(event, forceUpdate));
    };
  }, [...events]);
}

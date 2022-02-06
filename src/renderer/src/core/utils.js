import { useState, useCallback, useEffect, useRef } from 'react';

import langmap from 'langmap';

export function translateLanguage(language) {
  return langmap[language]?.englishName ?? language;
}

export function useForceUpdate() {
  const [, setState] = useState(0);

  const forceUpdate = useCallback(() => {
    setState((state) => state + 1);
  }, []);

  return forceUpdate;
}

export function useEventListener(elementRef, event, handler) {
  const savedHandler = useRef();

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  const eventHandler = useCallback((e) => savedHandler.current(e), []);

  useEffect(() => {
    elementRef.current?.addEventListener(event, eventHandler);

    return () => {
      elementRef.current?.removeEventListener(event, eventHandler);
    };
  }, [elementRef, event]);
}

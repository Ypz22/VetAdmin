import React from "react";

export function useLocalStorageState(key, initialValue) {
    const initialValueRef = React.useRef(initialValue);

    const readValue = React.useCallback(() => {
        if (typeof window === "undefined") return initialValueRef.current;

        try {
            const rawValue = window.localStorage.getItem(key);
            return rawValue ? JSON.parse(rawValue) : initialValueRef.current;
        } catch {
            return initialValueRef.current;
        }
    }, [key]);

    const [state, setState] = React.useState(() => {
        return readValue();
    });

    React.useEffect(() => {
        setState(readValue());
    }, [key, readValue]);

    React.useEffect(() => {
        if (typeof window === "undefined") return;

        try {
            window.localStorage.setItem(key, JSON.stringify(state));
        } catch {
            // noop
        }
    }, [key, state]);

    return [state, setState];
}

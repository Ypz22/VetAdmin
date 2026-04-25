import React from "react";

export function useLocalStorageState(key, initialValue) {
    const readValue = React.useCallback(() => {
        if (typeof window === "undefined") return initialValue;

        try {
            const rawValue = window.localStorage.getItem(key);
            return rawValue ? JSON.parse(rawValue) : initialValue;
        } catch {
            return initialValue;
        }
    }, [initialValue, key]);

    const [state, setState] = React.useState(() => {
        return readValue();
    });

    React.useEffect(() => {
        setState(readValue());
    }, [readValue]);

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

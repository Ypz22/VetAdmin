import React from "react";
import * as Lucide from "lucide-react";

const cache = new Map();

export const Icons = new Proxy(Lucide, {
    get(target, prop) {
        const original = target[prop];

        if (typeof original !== "function") return original;

        if (cache.has(prop)) return cache.get(prop);

        const Wrapped = React.forwardRef((props, ref) => {
            return React.createElement(original, { ...props, ref });
        });

        Wrapped.displayName = String(prop);

        cache.set(prop, Wrapped);
        return Wrapped;
    },
});

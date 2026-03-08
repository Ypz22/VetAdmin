import * as React from "react";
import "../styles/textarea.css";

export const Textarea = React.forwardRef(function Textarea(
    { className = "", ...props },
    ref
) {
    return (
        <textarea
            ref={ref}
            className={`textarea ${className}`}
            {...props}
        />
    );
});

Textarea.displayName = "Textarea";
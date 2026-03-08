import * as React from "react";
import * as LabelPrimitive from "@radix-ui/react-label";
import "../styles/label.css";

export const Label = React.forwardRef(function Label(
    { className = "", ...props },
    ref
) {
    return (
        <LabelPrimitive.Root
            ref={ref}
            className={`label ${className}`}
            {...props}
        />
    );
});

Label.displayName = "Label";
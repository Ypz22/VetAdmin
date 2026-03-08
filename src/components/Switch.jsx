import React from "react";
import * as SwitchPrimitives from "@radix-ui/react-switch";
import "../styles/switch.css";

const Switch = React.forwardRef(({ className = "", ...props }, ref) => {
    return (
        <SwitchPrimitives.Root
            ref={ref}
            {...props}
            className={`switch-root ${className}`}
        >
            <SwitchPrimitives.Thumb className="switch-thumb" />
        </SwitchPrimitives.Root>
    );
});

Switch.displayName = "Switch";

export default Switch;
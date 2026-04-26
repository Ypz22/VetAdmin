import React from "react";

const Input = React.forwardRef(({ name, ...props }, ref) => {
    return (
        <input
            ref={ref}
            name={name}
            {...props}
        />
    );
});

Input.displayName = "Input";

export default Input;

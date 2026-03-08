import React from "react";

const Input = ({ name, ...props }) => {
    return (
        <input
            name={name}
            {...props}
        />
    );
};

export default Input;
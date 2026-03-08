import React from "react";
import "../styles/badge.css";

function Badge({ label, className = "", variant = "default", ...props }) {
    return (
        <div
            className={`badge badge-${variant} ${className}`}
            {...props}
        > {label}</div>
    );
}

export default Badge;

import React from "react";

const Card = React.forwardRef(function Card({ className, ...props }, ref) {
    return (
        <div
            ref={ref}
            className={"card" + (className ? " " + className : "")}
            {...props}
        />
    );
});

const CardHeader = React.forwardRef(function CardHeader(
    { className, ...props },
    ref
) {
    return (
        <div
            ref={ref}
            className={"card-header" + (className ? " " + className : "")}
            {...props}
        />
    );
});

const CardTitle = React.forwardRef(function CardTitle(
    { className, ...props },
    ref
) {
    return (
        <div
            ref={ref}
            className={"card-title" + (className ? " " + className : "")}
            {...props}
        />
    );
});

const CardDescription = React.forwardRef(function CardDescription(
    { className, ...props },
    ref
) {
    return (
        <div
            ref={ref}
            className={"card-description" + (className ? " " + className : "")}
            {...props}
        />
    );
});

const CardContent = React.forwardRef(function CardContent(
    { className, ...props },
    ref
) {
    return (
        <div ref={ref} className={"card-content" + (className ? " " + className : "")} {...props} />
    );
});

const CardFooter = React.forwardRef(function CardFooter(
    { className, ...props },
    ref
) {
    return (
        <div
            ref={ref}
            className={"card-footer" + (className ? " " + className : "")}
            {...props}
        />
    );
});

export {
    Card,
    CardHeader,
    CardFooter,
    CardTitle,
    CardDescription,
    CardContent,
};

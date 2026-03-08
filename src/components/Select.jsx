import * as React from "react";
import * as SelectPrimitive from "@radix-ui/react-select";
import { Icons } from "./Named-lucide";
import "../styles/select.css";

export const Select = SelectPrimitive.Root;
export const SelectGroup = SelectPrimitive.Group;
export const SelectValue = SelectPrimitive.Value;

export const SelectTrigger = React.forwardRef(function SelectTrigger(
    { className = "", children, ...props },
    ref
) {
    return (
        <SelectPrimitive.Trigger
            ref={ref}
            className={`select-trigger ${className}`}
            {...props}
        >
            {children}
            <SelectPrimitive.Icon asChild>
                <Icons.ChevronDown className="select-trigger-icon" />
            </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
    );
});
SelectTrigger.displayName = "SelectTrigger";

export const SelectScrollUpButton = React.forwardRef(
    function SelectScrollUpButton({ className = "", ...props }, ref) {
        return (
            <SelectPrimitive.ScrollUpButton
                ref={ref}
                className={`select-scroll-btn ${className}`}
                {...props}
            >
                <Icons.ChevronUp className="select-scroll-icon" />
            </SelectPrimitive.ScrollUpButton>
        );
    }
);
SelectScrollUpButton.displayName = "SelectScrollUpButton";

export const SelectScrollDownButton = React.forwardRef(
    function SelectScrollDownButton({ className = "", ...props }, ref) {
        return (
            <SelectPrimitive.ScrollDownButton
                ref={ref}
                className={`select-scroll-btn ${className}`}
                {...props}
            >
                <Icons.ChevronDown className="select-scroll-icon" />
            </SelectPrimitive.ScrollDownButton>
        );
    }
);
SelectScrollDownButton.displayName = "SelectScrollDownButton";

export const SelectContent = React.forwardRef(function SelectContent(
    { className = "", children, position = "popper", ...props },
    ref
) {
    const isPopper = position === "popper";

    return (
        <SelectPrimitive.Portal>
            <SelectPrimitive.Content
                ref={ref}
                position={position}
                className={`select-content ${isPopper ? "select-content--popper" : ""} ${className}`}
                {...props}
            >
                <SelectScrollUpButton />
                <SelectPrimitive.Viewport
                    className={`select-viewport ${isPopper ? "select-viewport--popper" : ""}`}
                >
                    {children}
                </SelectPrimitive.Viewport>
                <SelectScrollDownButton />
            </SelectPrimitive.Content>
        </SelectPrimitive.Portal>
    );
});
SelectContent.displayName = "SelectContent";

export const SelectLabel = React.forwardRef(function SelectLabel(
    { className = "", ...props },
    ref
) {
    return (
        <SelectPrimitive.Label
            ref={ref}
            className={`select-label ${className}`}
            {...props}
        />
    );
});
SelectLabel.displayName = "SelectLabel";

export const SelectItem = React.forwardRef(function SelectItem(
    { className = "", children, ...props },
    ref
) {
    return (
        <SelectPrimitive.Item
            ref={ref}
            className={`select-item ${className}`}
            {...props}
        >
            <span className="select-item-indicator-wrap">
                <SelectPrimitive.ItemIndicator>
                    <Icons.Check className="select-item-check" />
                </SelectPrimitive.ItemIndicator>
            </span>

            <SelectPrimitive.ItemText>{children}</SelectPrimitive.ItemText>
        </SelectPrimitive.Item>
    );
});
SelectItem.displayName = "SelectItem";

export const SelectSeparator = React.forwardRef(function SelectSeparator(
    { className = "", ...props },
    ref
) {
    return (
        <SelectPrimitive.Separator
            ref={ref}
            className={`select-separator ${className}`}
            {...props}
        />
    );
});
SelectSeparator.displayName = "SelectSeparator";
import * as React from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import "../styles/dialog.css";
import { Icons } from "./Named-lucide";

export const Dialog = DialogPrimitive.Root;
export const DialogTrigger = DialogPrimitive.Trigger;
export const DialogPortal = DialogPrimitive.Portal;
export const DialogClose = DialogPrimitive.Close;

export const DialogOverlay = React.forwardRef(function DialogOverlay(
    { className = "", ...props },
    ref
) {
    return (
        <DialogPrimitive.Overlay
            ref={ref}
            className={`dialog-overlay ${className}`}
            {...props}
        />
    );
});
DialogOverlay.displayName = "DialogOverlay";

export const DialogContent = React.forwardRef(function DialogContent(
    { children, className = "", ...props },
    ref
) {
    return (
        <DialogPortal>
            <DialogOverlay />
            <DialogPrimitive.Content
                ref={ref}
                className={`dialog-content ${className}`}
                {...props}
            >
                {children}

                <DialogPrimitive.Close className="dialog-close">
                    <Icons.X className="dialog-close-icon" />
                    <span className="sr-only">Close</span>
                </DialogPrimitive.Close>
            </DialogPrimitive.Content>
        </DialogPortal>
    );
});
DialogContent.displayName = "DialogContent";

export function DialogHeader({ className = "", ...props }) {
    return <div className={`dialog-header ${className}`} {...props} />;
}

export function DialogFooter({ className = "", ...props }) {
    return <div className={`dialog-footer ${className}`} {...props} />;
}

export const DialogTitle = React.forwardRef(function DialogTitle(
    { className = "", ...props },
    ref
) {
    return (
        <DialogPrimitive.Title
            ref={ref}
            className={`dialog-title ${className}`}
            {...props}
        />
    );
});

// Description
export const DialogDescription = React.forwardRef(
    function DialogDescription({ className = "", ...props }, ref) {
        return (
            <DialogPrimitive.Description
                ref={ref}
                className={`dialog-description ${className}`}
                {...props}
            />
        );
    }
);
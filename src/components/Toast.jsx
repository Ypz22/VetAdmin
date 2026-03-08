import { useEffect } from "react";

export default function Toast({ type, message, show, onClose }) {

    useEffect(() => {
        if (show) {
            const timer = setTimeout(onClose, 3000);
            return () => clearTimeout(timer);
        }
    }, [show, onClose]);

    if (!show) return null;

    return (
        <div style={{
            position: "fixed",
            top: "20px",
            right: "20px",
            padding: "15px 20px",
            borderRadius: "12px",
            color: "white",
            backgroundColor: type === "error" ? "#ff4d4f" : "#52c41a",
            boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease"
        }}>
            {message}
        </div>
    );
}

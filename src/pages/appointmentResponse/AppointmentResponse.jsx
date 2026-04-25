import React from "react";
import { useSearchParams } from "react-router-dom";
import toast from "react-hot-toast";
import { Icons } from "../../components/Named-lucide.jsx";
import { useRespondToAppointment } from "../../queries/appointments.queries.js";
import { friendlyError } from "../../utils/friendlyError.js";
import "./appointmentResponse.css";

const COPY = {
    confirm: {
        loading: "Confirmando cita...",
        successTitle: "Cita confirmada",
        successText: "La cita fue confirmada correctamente. Gracias por responder.",
    },
    cancel: {
        loading: "Cancelando cita...",
        successTitle: "Cita cancelada",
        successText: "La cita fue cancelada correctamente.",
    },
};

const AppointmentResponse = () => {
    const [searchParams] = useSearchParams();
    const appointmentId = searchParams.get("appointmentId");
    const action = searchParams.get("action");
    const respondMutation = useRespondToAppointment();

    React.useEffect(() => {
        if (!appointmentId || !action) return;
        if (action !== "confirm" && action !== "cancel") return;
        if (respondMutation.isSuccess || respondMutation.isPending) return;

        respondMutation.mutate(
            { appointmentId, action },
            {
                onError: (error) => {
                    toast.error(friendlyError(error?.message));
                },
            }
        );
    }, [action, appointmentId, respondMutation]);

    const copy = COPY[action] ?? {
        loading: "Procesando solicitud...",
        successTitle: "Solicitud procesada",
        successText: "La solicitud fue procesada correctamente.",
    };

    const isInvalidRequest = !appointmentId || !action || (action !== "confirm" && action !== "cancel");

    return (
        <div className="appointmentResponsePage">
            <div className="appointmentResponseCard">
                <div className="appointmentResponseIconWrap">
                    {respondMutation.isError || isInvalidRequest ? (
                        <Icons.CircleAlert className="sizeIcon8" />
                    ) : respondMutation.isSuccess ? (
                        <Icons.BadgeCheck className="sizeIcon8" />
                    ) : (
                        <Icons.MailCheck className="sizeIcon8" />
                    )}
                </div>

                <div className="appointmentResponseText">
                    {isInvalidRequest ? (
                        <>
                            <h1>Enlace inválido</h1>
                            <p>El enlace de la cita no es válido o está incompleto.</p>
                        </>
                    ) : respondMutation.isError ? (
                        <>
                            <h1>No se pudo procesar la cita</h1>
                            <p>{friendlyError(respondMutation.error?.message)}</p>
                        </>
                    ) : respondMutation.isSuccess ? (
                        <>
                            <h1>{copy.successTitle}</h1>
                            <p>{copy.successText}</p>
                        </>
                    ) : (
                        <>
                            <h1>{copy.loading}</h1>
                            <p>Estamos actualizando el estado de la cita.</p>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AppointmentResponse;

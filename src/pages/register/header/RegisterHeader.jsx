import React from "react";
import { Icons } from "../../../components/Named-lucide";
import Button from "../../../components/Button.jsx";
import "./registerHeader.css";

const RegisterHeader = ({ patients, setNewPatientOpen }) => {
    return (
        <div className="registerHeader">
            <div className="registerHeader-text">
                <h1>Registro de Pacientes</h1>
                <p>{patients.length} pacientes registrados en el sistema </p>
            </div>
            <Button
                type="button"
                className="buttonNewPatient"
                onClick={() => {
                    setNewPatientOpen(true);
                }}
                label={
                    <>
                        <Icons.Plus className="registerHeaderIcon" /> Nuevo paciente
                    </>
                }
            />
        </div>
    )
};

export default RegisterHeader;
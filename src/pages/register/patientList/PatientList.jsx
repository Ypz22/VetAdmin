import React from "react";
import "./patientList.css";
import Patients from "./Patients";
import PatientDetails from "./patientDetails/PatientDetails";
import DeletePatient from "./patientDetails/deletePatient";

const PatientList = ({ patients, selectedPatient, setSelectedPatient, filtered, setNewAppointmentOpen, setNewPatientOpen, setEditPatientOpen }) => {

    const [deleteConfirmOpen, setDeleteConfirmOpen] = React.useState(false);

    const speciesIcons = {
        perro: "Dog",
        gato: "Cat",
        ave: "Bird",
        conejo: "Rabbit",
    }

    return (
        <div className="patientList">
            <Patients patients={filtered} selectedPatient={selectedPatient} setSelectedPatient={setSelectedPatient} filtered={filtered} speciesIcons={speciesIcons} />

            <PatientDetails selectedPatient={selectedPatient} speciesIcons={speciesIcons} setNewAppointmentOpen={setNewAppointmentOpen} setDeleteConfirmOpen={setDeleteConfirmOpen} setEditPatientOpen={setEditPatientOpen} />

            <DeletePatient deleteConfirmOpen={deleteConfirmOpen} setDeleteConfirmOpen={setDeleteConfirmOpen} patients={filtered} selectedPatient={selectedPatient} setSelectedPatient={setSelectedPatient} filtered={filtered} speciesIcons={speciesIcons} />
        </div>
    );
};

export default PatientList;
import React from "react";
import { CardContent, CardHeader, CardTitle } from "../../../../components/Card.jsx";
import { Icons } from "../../../../components/Named-lucide.jsx";
import Badge from "../../../../components/Badget.jsx";
import DetailItem from "./DetailItem.jsx";
import { getSpeciesColor } from "../../../../utils/randomColor.js";
import { Avatar, AvatarFallback } from "../../../../components/Avatar.jsx";
import Button from "../../../../components/Button.jsx";
import { shortId } from "../../../../utils/stringUtils.js";
import { getInitials } from "../../../../utils/stringUtils.js";
import PatientHistory from "./PatientHistory.jsx";


const PatientDetails = ({ selectedPatient, speciesIcons, setNewAppointmentOpen, setDeleteConfirmOpen, setEditPatientOpen }) => {
    const [historyOpen, setHistoryOpen] = React.useState(false);

    const color = getSpeciesColor(selectedPatient?.species.toLowerCase() || "");
    const species = selectedPatient?.species.toLowerCase() || "";
    const iconKey = speciesIcons?.[species] || "PawPrint";
    const Icon = Icons?.[iconKey] || Icons.PawPrint;

    const capitalizeFirstLetter = (string) => {
        if (!string) return "";
        return string.charAt(0).toUpperCase() + string.slice(1);
    }

    return (
        <div className="patientDetails">
            {selectedPatient ? (
                <>
                    <CardHeader className="patientDetailsHeaderContainer">
                        <div className="patientDetailsHeaderContent" >
                            <div className="patientDetailsHeaderIcon">
                                <div className="patientDetailsHeader" style={
                                    {
                                        backgroundColor: color.bg,
                                        color: color.text,
                                    }
                                } >
                                    <Icon className="sizeIcon6" />
                                </div>
                                <div className="patientDetailsHeaderText">
                                    <CardTitle className="patientDetailsTitle">
                                        {selectedPatient.name}
                                    </CardTitle>
                                    <p className="patientDetailsSub">
                                        {shortId(selectedPatient.id)}
                                    </p>
                                </div>
                            </div>
                            <div className="patientDetailsHeaderActions">
                                <Button
                                    type="button"
                                    className="editPatientButton"
                                    label={
                                        <Icons.Pencil className="sizeIcon4" />
                                    }
                                    onClick={() => setEditPatientOpen(true)}
                                />
                                <Button
                                    type="button"
                                    className="deletePatientButton"
                                    label={
                                        <Icons.Trash2 className="sizeIcon4" />
                                    }
                                    onClick={() => {
                                        setDeleteConfirmOpen(true);
                                    }}
                                />
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="patientDetailsContent">
                        <div className="patientDetailsInfo">
                            <Badge
                                variant="badge-outline"
                                className={`patientDetailsBadge status-${selectedPatient.status.toLowerCase() === "en tratamiento" ? "en-tratamiento" : selectedPatient.status.toLowerCase()}`}
                                label={capitalizeFirstLetter(selectedPatient.status)}
                            />
                            <div className="patientDetailsInfoItem">
                                <DetailItem label={"Especie"} value={selectedPatient.species} />
                                <DetailItem label={"Raza"} value={selectedPatient.breed} />
                                <DetailItem label={"Edad"} value={`${selectedPatient.age} Años`} />
                                <DetailItem label={"Peso"} value={`${selectedPatient.weight} Kg`} />
                                <DetailItem label={"Microchip"} value={selectedPatient.chip} />
                                <DetailItem label={"Ultima visita"} value={selectedPatient.lastVisit} />
                            </div>
                            <div className="divider" />

                            <div className="patientDetailsOwner">
                                <p className="patientDetailsOwnerP" >Propietario</p>
                                <div className="patientDetailsOwnerInfo">
                                    <Avatar className={`patientDetailsOwnerAvatar`}>
                                        <AvatarFallback className={`patientDetailsOwnerAvatarFallback`}>
                                            {getInitials(selectedPatient.owner_id.full_name)}
                                        </AvatarFallback>
                                    </Avatar>
                                    <div className="patientDetailsOwnerText">
                                        <p className="patientDetailsOwnerName">
                                            {selectedPatient.owner_id.full_name}
                                        </p>
                                        <p className="patientDetailsOwnerSub">
                                            {selectedPatient.owner_id.phone}
                                        </p>
                                        <p className="patientDetailsOwnerSub">
                                            {selectedPatient.owner_id.email}
                                        </p>
                                    </div>
                                </div>
                            </div>

                            <div className="patientDetailsActions">
                                <Button
                                    type="button"
                                    className="btn addPatientButton"
                                    label={
                                        "Agendar cita"
                                    }
                                    onClick={() => setNewAppointmentOpen(true)}
                                />
                                <Button
                                    type="button"
                                    className="btn historyPatientButton"
                                    onClick={() => setHistoryOpen(true)}
                                    label={
                                        "Ver historial completo"
                                    }
                                />
                            </div>
                        </div>
                    </CardContent>
                </>
            ) : (
                <CardContent className="patientDetailsEmptyState">
                    <div className="patientDetailsEmptyStateIcon">
                        <Icons.PawPrint className="sizeIcon6" />
                    </div>
                    <p className="patientDetailsEmptyStateP">Selecciona un paciente</p>
                    <p className="patientDetailsEmptyStateSubP">
                        Haz clic en un paciente para ver sus detalles
                    </p>
                </CardContent>
            )}
            <PatientHistory
                selectedPatient={selectedPatient}
                historyOpen={historyOpen}
                setHistoryOpen={setHistoryOpen}
            />
        </div>
    );
};

export default PatientDetails;

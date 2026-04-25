import React from "react";
import { Card, CardContent } from "../../../components/Card";
import { Icons } from "../../../components/Named-lucide";
import Button from "../../../components/Button";
import { Avatar, AvatarFallback } from "../../../components/Avatar";
import Badge from "../../../components/Badget";
import { getSpeciesColor } from "../../../utils/randomColor";
import { shortId } from "../../../utils/stringUtils.js";
import { getInitials } from "../../../utils/stringUtils.js";
import PaginationControls from "../../../components/PaginationControls.jsx";


const Patients = ({ patients, selectedPatient, setSelectedPatient, filtered, speciesIcons }) => {
    const [currentPage, setCurrentPage] = React.useState(1);
    const itemsPerPage = 5;

    React.useEffect(() => {
        setCurrentPage(1);
    }, [filtered]);

    const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));
    const safePage = Math.min(currentPage, totalPages);
    const paginatedPatients = filtered.slice(
        (safePage - 1) * itemsPerPage,
        safePage * itemsPerPage
    );

    return (
        <div className="patientListContainer">
            {patients.length <= 0 ? (
                <Card className="patientListEmptyState">
                    <CardContent className="patientListEmptyStateContent">
                        <div className="patientListEmptyStateIcon">
                            <Icons.PawPrint className="sizeIcon6" />
                        </div>
                        <p className="patientListEmptyStateP">No se encontraron pacientes</p>
                    </CardContent>
                </Card>
            ) : (
                <>
                    {paginatedPatients.map((patient) => {
                    const Icon = Icons[speciesIcons[patient.species.toLowerCase()]] || Icons["PawPrint"];
                    const isSelected = selectedPatient && selectedPatient.id === patient.id;
                    const color = getSpeciesColor(patient.species.toLowerCase());


                    return (
                        <Button
                            key={patient.id}
                            type="button"
                            onClick={() => setSelectedPatient(patient)}
                            className={`patientButton ${isSelected ? "patientButtonSelected" : "patientButtonSelectedInactive"}`}
                            label={
                                <div className="patientItem">
                                    <div className={`patientIcon`} style={{ backgroundColor: color.bg, color: color.text }}>
                                        <Icon className="sizeIcon5" />
                                    </div>
                                    <div className="patientInfo">
                                        <div className="patientInfoHeader">
                                            <p >{patient.name}</p>
                                            <span>{shortId(patient.id)}</span>
                                        </div>
                                        <p className="patientInfoSub">
                                            {patient.breed}  &middot; {`${patient.age} años`} &middot; {`${patient.weight} Kg`}
                                        </p>
                                    </div>
                                    <div className="patientOwner">
                                        <Avatar className="patientAvatar">
                                            <AvatarFallback className="patientAvatarFallback">
                                                {getInitials(patient.name)}
                                            </AvatarFallback>
                                        </Avatar>
                                        <span className="patientOwnerSpan">{patient.owner_id.full_name}</span>
                                    </div>
                                    <Badge
                                        variant="badge-outline"
                                        className={`badge-status status-${patient.status.toLowerCase() === "en tratamiento" ? "en-tratamiento" : patient.status.toLowerCase()}`}
                                        label={patient.status}
                                    />
                                    <Icons.ChevronRight className={`sizeIcon4 ${isSelected ? "patientChevronRightActive" : ""}`} />
                                </div>
                            }
                        />
                    )
                    })}
                    <PaginationControls
                        currentPage={safePage}
                        totalItems={filtered.length}
                        itemsPerPage={itemsPerPage}
                        onPageChange={setCurrentPage}
                    />
                </>
            )}
        </div >
    )
};

export default Patients;

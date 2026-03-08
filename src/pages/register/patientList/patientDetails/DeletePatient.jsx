import React from "react";
import { Icons } from "../../../../components/Named-lucide";
import Button from "../../../../components/Button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "../../../../components/Dialog.jsx";
import { getSpeciesColor } from "../../../../utils/randomColor.js";
import { useDeletePet } from "../../../../queries/pets.queries.js";
import toast from "react-hot-toast";

const DeletePatient = ({
    deleteConfirmOpen,
    setDeleteConfirmOpen,
    selectedPatient,
    speciesIcons,
    setSelectedPatient,
}) => {

    const deletePetMutation = useDeletePet();

    const handleDeletePatient = () => {
        if (!selectedPatient) return;

        deletePetMutation.mutate(selectedPatient.id, {
            onSuccess: () => {
                toast.success(`Paciente ${selectedPatient.name} eliminado exitosamente`);
                setDeleteConfirmOpen(false);
                setSelectedPatient(null);
            },
            onError: (error) => {
                console.error("Error deleting patient:", error);
            },
        });
    };

    const color = getSpeciesColor(selectedPatient?.species.toLowerCase() || "");
    const species = selectedPatient?.species.toLowerCase() || "";
    const iconKey = speciesIcons?.[species] || "PawPrint";
    const Icon = Icons?.[iconKey] || Icons.PawPrint;

    return (

        <Dialog className="deletePatientDialog" open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
            <DialogContent className="deletePatientDialogContent">
                <DialogHeader className="deletePatientDialogHeader">
                    <div className="deletePatientHeaderRow">
                        <div className="deletePatientAlertIconWrap">
                            <Icons.AlertTriangle className="sizeIcon5" />
                        </div>

                        <div className="deletePatientHeaderText">
                            <DialogTitle className="deletePatientDialogTitle">Eliminar paciente</DialogTitle>
                            <DialogDescription className="deletePatientDialogDescription">
                                Esta accion no se puede deshacer.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>

                {selectedPatient && (
                    <div className="deletePatientBody">
                        <div className="deletePatientPatientCard">
                            <div
                                className="deletePatientSpeciesIconWrap"
                                style={{
                                    backgroundColor: color.bg,
                                    color: color.text,
                                }}
                            >
                                <Icon className="sizeIcon4" />
                            </div>

                            <div className="deletePatientPatientInfo">
                                <p className="deletePatientPatientName">{selectedPatient.name}</p>
                                <p className="deletePatientPatientMeta">
                                    {selectedPatient.breed} &middot; {selectedPatient.owner_id.full_name}
                                </p>
                            </div>
                        </div>

                        <p className="deletePatientWarningText">
                            Se eliminara permanentemente a{" "}
                            <span className="deletePatientEmphasis">{selectedPatient.name}</span> y todo su
                            historial del sistema. El propietario{" "}
                            <span className="deletePatientEmphasis">{selectedPatient.owner_id.full_name}</span>{" "}
                            ya no tendra este paciente asociado.
                        </p>
                    </div>
                )}

                <DialogFooter className="deletePatientDialogFooter">
                    <Button
                        className="btn deletePatientBtnCancel"
                        variant="outline"
                        onClick={() => setDeleteConfirmOpen(false)}
                        label={<span className="deletePatientBtnCancelText">Cancelar</span>}
                    >
                    </Button>

                    <Button
                        className="btn deletePatientBtnDelete"
                        variant="destructive"
                        onClick={handleDeletePatient}
                        label={
                            <>
                                <Icons.Trash2 className="sizeIcon4" />
                                <span className="deletePatientBtnDeleteText">Eliminar paciente</span>
                            </>
                        }
                    >
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default DeletePatient;
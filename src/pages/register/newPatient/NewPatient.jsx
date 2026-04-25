import React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "../../../components/Dialog.jsx";
import { Icons } from "../../../components/Named-lucide.jsx";
import { Label } from "../../../components/Label.jsx";
import Input from "../../../components/Input.jsx";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../../components/Select.jsx";
import { Textarea } from "../../../components/Textarea.jsx";
import Button from "../../../components/Button.jsx";
import "./newPatient.css";
import { useUpdatePet } from "../../../queries/pets.queries.js";
import { useUpdateClient } from "../../../queries/clients.queries.js";
import toast from "react-hot-toast";
import { toCapitalizeCase, toTitleCase } from "../../../utils/stringUtils.js";

const NewPatient = ({ newPatientOpen, handleDialogChangePatient, setNewPatientOpen, patientForm, setPatientForm, handleNewPatientSubmit, editPatientOpen, selectedPatient, setEditPatientOpen, setSelectedPatient }) => {

    const updatePatientMutation = useUpdatePet();
    const updateClientMutation = useUpdateClient();

    const handleUpdatePatient = () => {
        updateClientMutation.mutate({
            id: selectedPatient.owner_id.id,
            full_name: toTitleCase(patientForm.owner_name.trim()),
            phone: patientForm.owner_phone.replace(/\s+/g, "").trim(),
            email: patientForm.email.trim(),
        }, {
            onError: (error) => {
                toast.error(`Error updating client: ${error.message}`);
            },
        }
        )
        updatePatientMutation.mutate({
            id: selectedPatient.id,
            name: toTitleCase(patientForm.name.trim()),
            species: toTitleCase(patientForm.species.trim()),
            breed: toTitleCase(patientForm.breed.trim()),
            age: patientForm.age.trim(),
            weight: patientForm.weight.trim(),
            notes: toCapitalizeCase(patientForm.notes || "").trim(),
        }, {
            onSuccess: (pet) => {
                setEditPatientOpen(false);
                setSelectedPatient(pet)
                setPatientForm({});
            },
            onError: (error) => {
                console.error("Error updating patient:", error);
            },
        });
    }

    React.useEffect(() => {
        if (editPatientOpen && selectedPatient) {
            setPatientForm({
                name: selectedPatient.name ?? "",
                species: selectedPatient.species ?? "",
                breed: selectedPatient.breed ?? "",
                age: selectedPatient.age != null ? String(selectedPatient.age) : "",
                weight: selectedPatient.weight != null ? String(selectedPatient.weight) : "",
                owner_name: selectedPatient.owner_id.full_name ?? "",
                owner_phone: selectedPatient.owner_id.phone ?? "",
                email: selectedPatient.owner_id.email ?? "",
                notes: selectedPatient.notes ?? "",
            });
        }
    }, [editPatientOpen, selectedPatient, setPatientForm]);

    return (
        <Dialog open={newPatientOpen || editPatientOpen} onOpenChange={handleDialogChangePatient}>
            <DialogContent className="newPatientDialogContent">
                <DialogHeader>
                    <div className="newPatientDialogHeader">
                        <div className="newPatientIconContainer">
                            <Icons.UserPlus className="newPatientIcon" />
                        </div>
                        <div className="newPatientHeaderText">
                            <DialogTitle className={"newPatientHeaderDialogtitle"} >Registrar nuevo paciente</DialogTitle>
                            <DialogDescription>
                                Completa los datos de la mascota y su propietario.
                            </DialogDescription>
                        </div>
                    </div>
                </DialogHeader>
                <div className="newPatientDialogBody">
                    <div>
                        <p className="newPatientSectionTitle">
                            <Icons.PawPrint className="newPatientPawIcon" />
                            Datos de la mascota
                        </p>
                        <div className="newPatientPetData">
                            <div className="newPatientRequiredField">
                                <Label htmlFor={"petName"} className={"newPatientRequiredFieldColorLabel"} >Nombre <span className="newPatientRequiredFieldColorSpan">*</span></Label>
                                <Input
                                    id="petName"
                                    className=" newPatientInput"
                                    value={patientForm.name ?? ""}
                                    placeholder="Ej: Rocky"
                                    onChange={(e) => setPatientForm((prev) => ({ ...prev, name: e.target.value }))}
                                />
                            </div>
                            <div className="newPatientRequiredField">
                                <Label htmlFor={"species"} className={"newPatientRequiredFieldColorLabel"}>Especie <span className="newPatientRequiredFieldColorSpan">*</span></Label>
                                <Select
                                    id="species" className="newPatientSelect" value={patientForm.species ?? ""} onValueChange={(value) => setPatientForm((prev) => ({ ...prev, species: value }))}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Seleccionar especie" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Perro">Perro</SelectItem>
                                        <SelectItem value="Gato">Gato</SelectItem>
                                        <SelectItem value="Ave">Ave</SelectItem>
                                        <SelectItem value="Conejo">Conejo</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="newPatientRequiredField">
                                <Label className="newPatientRequiredFieldColorLabel">Raza <span className="newPatientRequiredFieldColorSpan">*</span></Label>
                                <Input
                                    id="petBreed"
                                    className="newPatientInput"
                                    value={patientForm.breed ?? ""}
                                    placeholder="Ej: Golden Retriever"
                                    onChange={(e) => setPatientForm((prev) => ({ ...prev, breed: e.target.value }))}
                                />
                            </div>
                            <div className="newPatientRequiredField">
                                <Label className="newPatientRequiredFieldColorLabel">Edad <span className="newPatientRequiredFieldColorSpan">*</span></Label>
                                <Input
                                    id="petAge"
                                    className="newPatientInput"
                                    value={patientForm.age ?? ""}
                                    placeholder="Ej: 3 años"
                                    onChange={(e) => setPatientForm((prev) => ({ ...prev, age: e.target.value }))}
                                />
                            </div>
                            <div className="newPatientRequiredField">
                                <Label className="newPatientRequiredFieldColorLabel">Peso (Kg) <span className="newPatientRequiredFieldColorSpan">*</span></Label>
                                <Input
                                    id="petWeight"
                                    className="newPatientInput"
                                    value={patientForm.weight ?? ""}
                                    placeholder="Ej: 25.5"
                                    onChange={(e) => setPatientForm((prev) => ({ ...prev, weight: e.target.value }))} />
                            </div>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div>
                        <p className="newPatientSectionTitle">
                            <Icons.UserPlus className="newPatientPawIcon" />
                            Datos del propietario
                        </p>
                        <div className="newPatientPetData">
                            <div className="newPatientRequiredField">
                                <Label className="newPatientRequiredFieldColorLabel">Nombre completo <span className="newPatientRequiredFieldColorSpan">*</span></Label>
                                <Input
                                    id="ownerName"
                                    className="newPatientInput"
                                    value={patientForm.owner_name ?? ""}
                                    placeholder="Ej: Juan Pérez"
                                    onChange={(e) => setPatientForm((prev) => ({ ...prev, owner_name: e.target.value }))} />
                            </div>
                            <div className="newPatientRequiredField">
                                <Label className="newPatientRequiredFieldColorLabel">Teléfono <span className="newPatientRequiredFieldColorSpan">*</span></Label>
                                <Input
                                    id="ownerPhone"
                                    className="newPatientInput"
                                    value={patientForm.owner_phone ?? ""}
                                    placeholder="Ej: +56912345678"
                                    onChange={(e) => setPatientForm((prev) => ({ ...prev, owner_phone: e.target.value }))} />
                            </div>
                            <div className="newPatientRequiredField">
                                <Label className="newPatientRequiredFieldColorLabel">Correo Electrónico <span className="newPatientRequiredFieldColorSpan">*</span></Label>
                                <Input
                                    id="ownerEmail"
                                    type="email"
                                    className="newPatientInput"
                                    value={patientForm.email ?? ""}
                                    placeholder="correo@ejemplo.com"
                                    onChange={(e) => setPatientForm((prev) => ({ ...prev, email: e.target.value }))}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="divider"></div>

                    <div className="newPatientRequiredField">
                        <Label className="newPatientRequiredFieldColorLabel">Notas adicionales</Label>
                        <Textarea
                            id="additionalNotes"
                            className="newPatientTextarea"
                            value={patientForm.notes ?? ""}
                            placeholder="Alergias, condiciones previas, observaciones..."
                            onChange={(e) => setPatientForm((prev) => ({ ...prev, notes: e.target.value }))}
                        />
                    </div>
                </div>

                <DialogFooter>
                    <Button
                        type="button"
                        className="btn buttonCancel"
                        label="Cancelar"
                        onClick={() => { setNewPatientOpen(false); setEditPatientOpen(false); setPatientForm({}) }}
                    />
                    {editPatientOpen ? (
                        <Button
                            type="button"
                            className="btn buttonSave"
                            onClick={() => handleUpdatePatient()}
                            disabled={
                                !patientForm.name?.trim() ||
                                !patientForm.species?.trim() ||
                                !patientForm.breed?.trim() ||
                                !patientForm.age?.trim() ||
                                !patientForm.weight?.trim() ||
                                !patientForm.owner_name?.trim() ||
                                !patientForm.owner_phone?.trim() ||
                                !patientForm.email?.trim()
                            }
                            label={
                                <>
                                    <Icons.Check className="newPatientCheckIcon" /> Guardar cambios
                                </>
                            }
                        />
                    ) : (
                        <Button
                            type="button"
                            className="btn buttonSave"
                            onClick={handleNewPatientSubmit}
                            disabled={
                                !patientForm.name?.trim() ||
                                !patientForm.species?.trim() ||
                                !patientForm.breed?.trim() ||
                                !patientForm.age?.trim() ||
                                !patientForm.weight?.trim() ||
                                !patientForm.owner_name?.trim() ||
                                !patientForm.owner_phone?.trim() ||
                                !patientForm.email?.trim()
                            }
                            label={
                                <>
                                    <Icons.Check className="newPatientCheckIcon" /> Registrar paciente
                                </>
                            }
                        />
                    )
                    }
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default NewPatient;

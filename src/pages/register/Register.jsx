import React from "react";
import { useSearchParams } from "react-router-dom";
import RegisterHeader from "./header/RegisterHeader";
import DashboardHeader from "../../components/DashboardHeader";
import RegisterSearchBar from "./searchBar/RegisterSearchBar";
import PatientList from "./patientList/PatientList";
import { useCreatePet, usePetsAndOwner } from "../../queries/pets.queries";
import toast from "react-hot-toast";
import { useCreateClient } from "../../queries/clients.queries";
import { toCapitalizeCase } from "../../utils/stringUtils.js";
import { useServices } from "../../queries/services.queries";
import { toTitleCase } from "../../utils/stringUtils";
import NewPatient from "./newPatient/NewPatient.jsx";
import NewAppointment from "./newAppointment/NewAppointment.jsx";
import { useDoctors } from "../../hooks/useDoctors.js";
import { SPECIES_ICONS } from "../../constants/species.js";
import { useAppointmentDialog } from "../../hooks/useAppointmentDialog.js";

const speciesFilters = [
    { label: "Todos", value: "todos" },
    { label: "Perros", value: "perro" },
    { label: "Gatos", value: "gato" },
    { label: "Aves", value: "ave" },
    { label: "Conejos", value: "conejo" },
]

const Register = () => {
    const [searchParams] = useSearchParams();

    const { data: patients = [] } = usePetsAndOwner();
    const { data: services = [] } = useServices();
    const { doctors } = useDoctors();
    const createPetMutation = useCreatePet();
    const createClientMutation = useCreateClient();

    const [searchQuery, setSearchQuery] = React.useState(searchParams.get("search") ?? "")
    const [speciesFilter, setSpeciesFilter] = React.useState(searchParams.get("species") ?? "todos")
    const [selectedPatient, setSelectedPatient] = React.useState(null)
    const searchInputRef = React.useRef(null);

    const [newPatientOpen, setNewPatientOpen] = React.useState(false)
    const [editPatientOpen, setEditPatientOpen] = React.useState(false)
    const [patientForm, setPatientForm] = React.useState({})
    const emptyPatientForm = {};
    const {
        appointmentForm,
        handleDialogChangeAppointment,
        handleNewAppointmentSubmit,
        newAppointmentOpen: appointmentDialogOpen,
        setAppointmentForm,
        setNewAppointmentOpen: setAppointmentDialogOpen,
    } = useAppointmentDialog({
        resolvePetId: () => selectedPatient?.id,
        resolvePatientName: () => selectedPatient?.name,
    });

    function handleNewPatientSubmit() {
        createClientMutation.mutate({
            full_name: toTitleCase(patientForm.owner_name.trim()),
            phone: patientForm.owner_phone.replace(/\s+/g, "").trim(),
            email: patientForm.email.trim(),
        }, {
            onSuccess: (client) => {
                createPetMutation.mutate({
                    name: toTitleCase(patientForm.name.trim()),
                    species: toTitleCase(patientForm.species.trim()),
                    breed: toTitleCase(patientForm.breed.trim()),
                    age: patientForm.age.trim(),
                    owner_id: client.id.trim(),
                    weight: patientForm.weight.trim(),
                    chip: patientForm.chip ? patientForm.chip : `CHIP-${patients.length + 1 > 100 ? patients.length + 1 : (patients.length + 1) > 10 ? "0" + (patients.length + 1) : "00" + (patients.length + 1)}`,
                    status: "Activo",
                    notes: toCapitalizeCase(patientForm.notes || "").trim(),
                }, {
                    onSuccess: (pet) => {
                        setSelectedPatient(pet)
                    },
                    onError: (error) => {
                        toast.error("Error al crear paciente: " + error.message)
                    }
                })
            },
            onError: (error) => {
                toast.error("Error al crear cliente: " + error.message)
            }
        }
        )
        toast.success(`Paciente ${toTitleCase(patientForm.name)} registrado exitosamente`)
        setPatientForm(emptyPatientForm)
        setNewPatientOpen(false)
    }

    const handleDialogChangePatient = (open) => {
        setNewPatientOpen(open);
        setEditPatientOpen(open);
        if (!open) {
            setPatientForm({});
        }
    };

    React.useEffect(() => {
        setSearchQuery(searchParams.get("search") ?? "");
        setSpeciesFilter(searchParams.get("species") ?? "todos");
    }, [searchParams]);

    React.useEffect(() => {
        const patientId = searchParams.get("patientId");
        const focusSearch = searchParams.get("focusSearch");

        if (focusSearch === "1") {
            searchInputRef.current?.focus();
        }

        if (!patientId) return;

        const patient = patients.find((item) => item.id === patientId);
        if (patient) {
            setSelectedPatient(patient);
        }
    }, [patients, searchParams]);


    const filtered = patients.filter((p) => {
        const matchesSearch =
            searchQuery === "" ||
            p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.owner_id.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
            p.breed.toLowerCase().includes(searchQuery.toLowerCase())
        const matchesSpecies = speciesFilter === "todos" || p.species.toLowerCase() === speciesFilter
        return matchesSearch && matchesSpecies
    })

    return (
        <div className="register">
            <DashboardHeader />
            <div className="page-content">
                <RegisterHeader patients={patients} setNewPatientOpen={setNewPatientOpen} />

                <RegisterSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} speciesFilters={speciesFilters} setSpeciesFilter={setSpeciesFilter} speciesFilter={speciesFilter} setNewPatientOpen={setNewPatientOpen} inputRef={searchInputRef} />

                <PatientList patients={filtered} selectedPatient={selectedPatient} setSelectedPatient={setSelectedPatient} filtered={filtered} setNewAppointmentOpen={setAppointmentDialogOpen} setNewPatientOpen={setNewPatientOpen} setEditPatientOpen={setEditPatientOpen} />

                <NewPatient patientForm={patientForm} setPatientForm={setPatientForm} handleNewPatientSubmit={handleNewPatientSubmit} newPatientOpen={newPatientOpen} setNewPatientOpen={setNewPatientOpen} handleDialogChangePatient={handleDialogChangePatient} selectedPatient={selectedPatient} editPatientOpen={editPatientOpen} setEditPatientOpen={setEditPatientOpen} setSelectedPatient={setSelectedPatient} />

                <NewAppointment newAppointmentOpen={appointmentDialogOpen} setNewAppointmentOpen={setAppointmentDialogOpen} selectedPatient={selectedPatient} appointmentForm={appointmentForm} setAppointmentForm={setAppointmentForm} speciesIcons={SPECIES_ICONS} handleDialogChangeAppointment={handleDialogChangeAppointment} handleNewAppointmentSubmit={handleNewAppointmentSubmit} services={services} doctors={doctors} />
            </div>
        </div>
    );
}

export default Register;

import React from "react";
import { Icons } from "../../components/Named-lucide";
import RegisterHeader from "./header/RegisterHeader";
import DashboardHeader from "../../components/DashboardHeader";
import RegisterSearchBar from "./searchBar/RegisterSearchBar";
import PatientList from "./patientList/PatientList";
import { useCreatePet, usePetsAndOwner } from "../../queries/pets.queries";
import NewPatient from "./newPatient/NewPatient";
import toast from "react-hot-toast";
import { useCreateClient } from "../../queries/clients.queries";
import { toCapitalizeCase } from "../../utils/stringUtils.js";
import NewAppointment from "./newAppointment/NewAppointment";
import { useCreateAppointment } from "../../queries/appointments.queries";
import { useServices } from "../../queries/services.queries";
import { toTitleCase } from "../../utils/stringUtils";

const speciesFilters = [
    { label: "Todos", value: "todos" },
    { label: "Perros", value: "perro" },
    { label: "Gatos", value: "gato" },
    { label: "Aves", value: "ave" },
    { label: "Conejos", value: "conejo" },
]

const speciesIcons = {
    perro: "Dog",
    gato: "Cat",
    ave: "Bird",
    conejo: "Rabbit",
}

const Register = () => {

    const { data: patients = [] } = usePetsAndOwner();
    const { data: services = [] } = useServices();
    const createPetMutation = useCreatePet();
    const createClientMutation = useCreateClient();
    const createAppointmentMutation = useCreateAppointment();

    const [searchQuery, setSearchQuery] = React.useState("")
    const [speciesFilter, setSpeciesFilter] = React.useState("todos")
    const [selectedPatient, setSelectedPatient] = React.useState(null)

    const [newPatientOpen, setNewPatientOpen] = React.useState(false)
    const [newAppointmentOpen, setNewAppointmentOpen] = React.useState(false)
    const [editPatientOpen, setEditPatientOpen] = React.useState(false)
    const [patientForm, setPatientForm] = React.useState({})
    const [appointmentForm, setAppointmentForm] = React.useState({})
    const [emptyPatientForm, setEmptyPatientForm] = React.useState({})
    const [emptyAppointmentForm, setEmptyAppointmentForm] = React.useState({})

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

    function handleNewAppointmentSubmit() {
        createAppointmentMutation.mutate({
            appointment_date: appointmentForm.date,
            appointment_time: appointmentForm.time,
            status: appointmentForm.status,
            pet_id: selectedPatient.id,
            service_id: appointmentForm.services,
            notes: appointmentForm.notes,
        })
        toast.success(`Cita para ${toTitleCase(selectedPatient.name)} programada exitosamente`)
        setAppointmentForm(emptyAppointmentForm)
        setNewAppointmentOpen(false)
    }

    const handleDialogChangePatient = (open) => {
        setNewPatientOpen(open);
        setEditPatientOpen(open);
        if (!open) {
            setPatientForm({});
        }
    };

    const handleDialogChangeAppointment = (open) => {
        setNewAppointmentOpen(open);
        if (!open) {
            setAppointmentForm({});
        }
    };


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

                <RegisterSearchBar searchQuery={searchQuery} setSearchQuery={setSearchQuery} speciesFilters={speciesFilters} setSpeciesFilter={setSpeciesFilter} speciesFilter={speciesFilter} setNewPatientOpen={setNewPatientOpen} />

                <PatientList patients={filtered} selectedPatient={selectedPatient} setSelectedPatient={setSelectedPatient} filtered={filtered} setNewAppointmentOpen={setNewAppointmentOpen} setNewPatientOpen={setNewPatientOpen} setEditPatientOpen={setEditPatientOpen} />

                <NewPatient patientForm={patientForm} setPatientForm={setPatientForm} handleNewPatientSubmit={handleNewPatientSubmit} newPatientOpen={newPatientOpen} setNewPatientOpen={setNewPatientOpen} handleDialogChangePatient={handleDialogChangePatient} selectedPatient={selectedPatient} editPatientOpen={editPatientOpen} setEditPatientOpen={setEditPatientOpen} setSelectedPatient={setSelectedPatient} />

                <NewAppointment newAppointmentOpen={newAppointmentOpen} setNewAppointmentOpen={setNewAppointmentOpen} selectedPatient={selectedPatient} appointmentForm={appointmentForm} setAppointmentForm={setAppointmentForm} speciesIcons={speciesIcons} handleDialogChangeAppointment={handleDialogChangeAppointment} handleNewAppointmentSubmit={handleNewAppointmentSubmit} services={services} />
            </div>
        </div>
    );
}

export default Register;
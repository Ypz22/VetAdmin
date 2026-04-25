import React from "react";
import { Icons } from "../../../components/Named-lucide";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import Button from "../../../components/Button";
import { Avatar, AvatarFallback } from "../../../components/Avatar";
import Badge from "../../../components/Badget";
import Input from "../../../components/Input.jsx";
import { Label } from "../../../components/Label.jsx";
import { useVeterinaryByUser } from "../../../queries/veterinaries.queries.js";
import { useProfiles } from "../../../queries/profiles.queries.js";
import { useLocalStorageState } from "../../../hooks/useLocalStorageState.js";
import { getInitials, toTitleCase } from "../../../utils/stringUtils";
import toast from "react-hot-toast";
import "./team.css";

const EMPTY_MEMBER = {
    id: "",
    name: "",
    role: "",
    email: "",
    status: "activo",
};

const Team = () => {
    const { data: veterinary } = useVeterinaryByUser();
    const { data: profiles = [] } = useProfiles();
    const storageKey = React.useMemo(
        () => `admin_team_members_${veterinary?.id ?? "default"}`,
        [veterinary?.id]
    );
    const [customMembers, setCustomMembers] = useLocalStorageState(storageKey, []);
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [editingId, setEditingId] = React.useState(null);
    const [form, setForm] = React.useState(EMPTY_MEMBER);

    const realMembers = React.useMemo(
        () =>
            profiles
                .filter(
                    (profile) =>
                        profile.veterinary_id === veterinary?.id &&
                        profile.role !== "client"
                )
                .map((profile) => ({
                    id: profile.id,
                    name: profile.full_name,
                    role: profile.role === "owner" ? "Propietario" : "Personal",
                    email: profile.email ?? "Sin correo",
                    status: "activo",
                    source: "profile",
                })),
        [profiles, veterinary?.id]
    );

    const members = [...realMembers, ...customMembers];

    const resetForm = () => {
        setForm(EMPTY_MEMBER);
        setEditingId(null);
        setIsFormOpen(false);
    };

    const handleSubmit = () => {
        if (!form.name.trim() || !form.role.trim() || !form.email.trim()) {
            toast.error("Completa nombre, rol y correo.");
            return;
        }

        if (editingId) {
            setCustomMembers((prev) =>
                prev.map((member) =>
                    member.id === editingId
                        ? { ...member, ...form, name: toTitleCase(form.name.trim()) }
                        : member
                )
            );
            toast.success("Miembro actualizado.");
        } else {
            setCustomMembers((prev) => [
                {
                    ...form,
                    id: crypto.randomUUID(),
                    name: toTitleCase(form.name.trim()),
                    role: toTitleCase(form.role.trim()),
                    email: form.email.trim(),
                    source: "custom",
                },
                ...prev,
            ]);
            toast.success("Miembro agregado.");
        }

        resetForm();
    };

    const handleEdit = (member) => {
        if (member.source !== "custom") {
            toast.error("Los miembros reales de la clínica se muestran en solo lectura.");
            return;
        }

        setEditingId(member.id);
        setForm({
            id: member.id,
            name: member.name,
            role: member.role,
            email: member.email,
            status: member.status,
        });
        setIsFormOpen(true);
    };

    return (
        <Card className="team">
            <CardHeader className="team-header">
                <CardTitle className="team-title">Equipo de trabajo</CardTitle>
                <Button
                    type="button"
                    className="btn btn-team"
                    label={
                        <>
                            <Icons.Plus className="icon" />
                            Agregar miembro
                        </>
                    }
                    onClick={() => {
                        setEditingId(null);
                        setForm(EMPTY_MEMBER);
                        setIsFormOpen((prev) => !prev);
                    }}
                />
            </CardHeader>
            <CardContent className="team-content">
                {isFormOpen && (
                    <div className="teamEditor">
                        <div className="teamEditorGrid">
                            <div className="teamEditorField">
                                <Label>Nombre</Label>
                                <Input
                                    className="input teamInput"
                                    value={form.name}
                                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                                />
                            </div>
                            <div className="teamEditorField">
                                <Label>Rol</Label>
                                <Input
                                    className="input teamInput"
                                    value={form.role}
                                    onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                                />
                            </div>
                            <div className="teamEditorField">
                                <Label>Correo</Label>
                                <Input
                                    className="input teamInput"
                                    value={form.email}
                                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                                />
                            </div>
                            <div className="teamEditorField">
                                <Label>Estado</Label>
                                <Input
                                    className="input teamInput"
                                    value={form.status}
                                    onChange={(event) => setForm((prev) => ({ ...prev, status: event.target.value.toLowerCase() }))}
                                />
                            </div>
                        </div>
                        <div className="teamEditorActions">
                            <Button type="button" className="btn btn-outline" label="Cancelar" onClick={resetForm} />
                            <Button type="button" className="btn btn-team" label={editingId ? "Guardar cambios" : "Crear miembro"} onClick={handleSubmit} />
                        </div>
                    </div>
                )}

                <div className="team-members">
                    {members.map((member) => (
                        <div key={member.id} className="teamMember">
                            <div className="teamMemberInfo">
                                <Avatar className="teamMemberAvatar">
                                    <AvatarFallback className="teamMemberFallback">{getInitials(member.name)}</AvatarFallback>
                                </Avatar>
                                <div className="teamMemberDetails">
                                    <p className="name">{member.name}</p>
                                    <p className="role">{member.role}</p>
                                </div>
                            </div>
                            <div className="teamMemberStatus">
                                <span>{member.email}</span>
                                <Badge className={`badge ${member.status === "activo" ? "badgeActive" : "badgeInactive"}`} label={toTitleCase(member.status)} />
                                {member.source === "custom" && (
                                    <div className="teamMemberActions">
                                        <Button type="button" className="btn teamActionButton" label={<Icons.Pencil className="sizeIcon4" />} onClick={() => handleEdit(member)} />
                                        <Button type="button" className="btn teamActionButton teamActionDanger" label={<Icons.Trash2 className="sizeIcon4" />} onClick={() => setCustomMembers((prev) => prev.filter((item) => item.id !== member.id))} />
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
};

export default Team;

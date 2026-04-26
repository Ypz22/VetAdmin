import React from "react";
import { Icons } from "../../../components/Named-lucide";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import Button from "../../../components/Button";
import { Avatar, AvatarFallback } from "../../../components/Avatar";
import Badge from "../../../components/Badget";
import Input from "../../../components/Input.jsx";
import { Label } from "../../../components/Label.jsx";
import { useTeamMembers, useCreateTeamMember } from "../../../queries/team.queries.js";
import { useAuthUser } from "../../../queries/auth.queries.js";
import { useProfileById } from "../../../queries/profiles.queries.js";
import { getInitials, toTitleCase } from "../../../utils/stringUtils";
import { friendlyError } from "../../../utils/friendlyError.js";
import toast from "react-hot-toast";
import "./team.css";

const EMPTY_MEMBER = {
    name: "",
    role: "staff",
    email: "",
    password: "",
};

const ROLE_LABELS = {
    owner: "Propietario",
    staff: "Personal",
};

const STATUS_LABELS = {
    active: "Activo",
    inactive: "Inactivo",
};

const Team = () => {
    const auth = useAuthUser();
    const userId = auth.data?.id;
    const profile = useProfileById(userId, { enabled: !!userId });
    const { data: members = [], isLoading, error } = useTeamMembers();
    const createTeamMemberMutation = useCreateTeamMember();
    const [isFormOpen, setIsFormOpen] = React.useState(false);
    const [form, setForm] = React.useState(EMPTY_MEMBER);
    const canManageMembers = profile.data?.role === "owner";

    React.useEffect(() => {
        if (error?.message) {
            toast.error(friendlyError(error.message));
        }
    }, [error]);

    const resetForm = () => {
        setForm(EMPTY_MEMBER);
        setIsFormOpen(false);
    };

    const handleSubmit = async () => {
        if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
            toast.error("Completa nombre, correo y contraseña temporal.");
            return;
        }

        if (!canManageMembers) {
            toast.error("Solo el propietario puede crear usuarios.");
            return;
        }

        try {
            await createTeamMemberMutation.mutateAsync({
                full_name: toTitleCase(form.name.trim()),
                email: form.email.trim().toLowerCase(),
                password: form.password,
                role: form.role,
            });

            toast.success("Empleado creado. Ya puede iniciar sesión con su correo y contraseña temporal.");
            resetForm();
        } catch (submitError) {
            toast.error(friendlyError(submitError?.message));
        }
    };

    return (
        <Card className="team">
            <CardHeader className="team-header">
                <div>
                    <CardTitle className="team-title">Equipo de trabajo</CardTitle>
                    <p className="team-subtitle">
                        Crea accesos reales para empleados de tu veterinaria.
                    </p>
                </div>
                <Button
                    type="button"
                    className="btn btn-team"
                    label={
                        <>
                            <Icons.Plus className="icon" />
                            Agregar empleado
                        </>
                    }
                    onClick={() => {
                        if (!canManageMembers) {
                            toast.error("Solo el propietario puede crear usuarios.");
                            return;
                        }
                        setForm(EMPTY_MEMBER);
                        setIsFormOpen((prev) => !prev);
                    }}
                    disabled={!canManageMembers}
                />
            </CardHeader>
            <CardContent className="team-content">
                {!canManageMembers && (
                    <div className="teamReadOnlyNotice">
                        Solo el propietario puede crear usuarios. Como personal, puedes ver el equipo pero no administrar accesos.
                    </div>
                )}

                {isFormOpen && (
                    <div className="teamEditor">
                        <div className="teamEditorGrid">
                            <div className="teamEditorField">
                                <Label>Nombre completo</Label>
                                <Input
                                    className="input teamInput"
                                    value={form.name}
                                    onChange={(event) => setForm((prev) => ({ ...prev, name: event.target.value }))}
                                />
                            </div>

                            <div className="teamEditorField">
                                <Label>Correo</Label>
                                <Input
                                    type="email"
                                    className="input teamInput"
                                    value={form.email}
                                    onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
                                />
                            </div>

                            <div className="teamEditorField">
                                <Label>Rol</Label>
                                <select
                                    className="teamSelect"
                                    value={form.role}
                                    onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
                                >
                                    <option value="staff">Personal</option>
                                    <option value="owner">Propietario</option>
                                </select>
                            </div>

                            <div className="teamEditorField">
                                <Label>Contraseña temporal</Label>
                                <Input
                                    type="text"
                                    className="input teamInput"
                                    value={form.password}
                                    onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                                />
                            </div>
                        </div>

                        <p className="teamHelperText">
                            El empleado iniciará sesión con esta contraseña temporal y luego podrá cambiarla desde el sistema.
                        </p>

                        <div className="teamEditorActions">
                            <Button type="button" className="btn btn-outline" label="Cancelar" onClick={resetForm} />
                            <Button
                                type="button"
                                className="btn btn-team"
                                label={createTeamMemberMutation.isPending ? "Creando..." : "Crear usuario"}
                                onClick={handleSubmit}
                                disabled={createTeamMemberMutation.isPending}
                            />
                        </div>
                    </div>
                )}

                <div className="team-members">
                    {isLoading ? (
                        <div className="teamEmptyState">
                            <Icons.LoaderCircle className="sizeIcon5 teamSpinner" />
                            <p>Cargando equipo...</p>
                        </div>
                    ) : members.length === 0 ? (
                        <div className="teamEmptyState">
                            <Icons.Users className="sizeIcon6" />
                            <p>Aún no hay empleados registrados.</p>
                        </div>
                    ) : (
                        members.map((member) => (
                            <div key={member.id} className="teamMember">
                                <div className="teamMemberInfo">
                                    <Avatar className="teamMemberAvatar">
                                        <AvatarFallback className="teamMemberFallback">{getInitials(member.full_name)}</AvatarFallback>
                                    </Avatar>
                                    <div className="teamMemberDetails">
                                        <p className="name">{member.full_name}</p>
                                        <p className="role">{ROLE_LABELS[member.role] ?? "Usuario"}</p>
                                    </div>
                                </div>

                                <div className="teamMemberStatus">
                                    <span className="teamMemberEmail">{member.email}</span>
                                    <Badge
                                        className={`badge ${member.status === "active" ? "badgeActive" : "badgeInactive"}`}
                                        label={STATUS_LABELS[member.status] ?? "Activo"}
                                    />
                                    {member.must_change_password && (
                                        <Badge className="badge badgeWarning" label="Cambio pendiente" />
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </CardContent>
        </Card>
    );
};

export default Team;

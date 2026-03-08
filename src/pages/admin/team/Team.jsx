import React from "react";
import { Icons } from "../../../components/Named-lucide";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import Button from "../../../components/Button";
import { Avatar, AvatarFallback } from "../../../components/Avatar";
import Badge from "../../../components/Badget";
import "./team.css";
import { toTitleCase } from "../../../utils/stringUtils";

const Team = ({ members }) => {
    return (
        <Card className="team">
            <CardHeader className="team-header">
                <CardTitle className="team-title">
                    Equipo de trabajo
                </CardTitle>
                <Button
                    type="button"
                    className="btn btn-team"
                    label={
                        <>
                            <Icons.Plus className="icon" />
                            Agregar miembro
                        </>
                    }
                />
            </CardHeader>
            <CardContent className="team-content">
                <div className="team-members">
                    {members.map((member) => (
                        <div key={member.email} className="teamMember">
                            <div className="teamMemberInfo">
                                <Avatar className="teamMemberAvatar">
                                    <AvatarFallback className="teamMemberFallback" >{member.initials}</AvatarFallback>
                                </Avatar>
                                <div className="teamMemberDetails">
                                    <p className="name" >{member.name}</p>
                                    <p className="role">{member.role}</p>
                                </div>
                            </div>
                            <div className="teamMemberStatus">
                                <span>{member.email}</span>
                                <Badge className={`badge ${member.status === "activo" ? "badgeActive" : "badgeInactive"}`} label={toTitleCase(member.status)} />
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
};

export default Team;
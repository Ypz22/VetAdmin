import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import Badge from "../../../components/Badget";
import "./billing.css";

const Billing = () => {
    return (
        <div className="billingPage">
            <Card className="currentPlanCard">
                <CardHeader className="currentPlanHeader">
                    <CardTitle className="currentPlanHeaderTitle" >Plan actual</CardTitle>
                </CardHeader>
                <CardContent className="currentPlanContent">
                    <div className="currentPlanInfo">
                        <div className="currentPlanInfoDetails">
                            <p className="currentPlanInfoName" >Plan Profesional</p>
                            <p className="currentPlanInfoDate" >Facturación mensual &middot; Proximo cobro: 1 Mar 2026</p>
                        </div>
                        <div className="currentPlanInfoPrice">
                            <p>$89<span>/mes</span></p>
                        </div>
                    </div>
                </CardContent>
            </Card>
            <Card>
                <CardHeader className="paymentHistoryHeader">
                    <CardTitle className="paymentHistoryHeaderTitle" >Historial de pagos</CardTitle>
                </CardHeader>
                <CardContent className="paymentHistoryContent">
                    <div className="paymentHistoryList">
                        {[{ date: "1 Feb 2026", amount: "$89.00", status: "Pagado" }, { date: "1 Ene 2026", amount: "$89.00", status: "Pagado" }, { date: "1 Dic 2025", amount: "$89.00", status: "Pagado" }].map((payment, index) => (
                            <div key={index} className="paymentRecord">
                                <span className="paymentRecordSpan">{payment.date}</span>
                                <div className="paymentRecordDetails">
                                    <span>{payment.amount}</span>
                                    <Badge className={`badge ${payment.status === "Pagado" ? "badgeActive" : "badgeInactive"}`} label={payment.status} />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
};

export default Billing;
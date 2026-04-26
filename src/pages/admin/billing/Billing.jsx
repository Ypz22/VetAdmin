import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../../../components/Card";
import Badge from "../../../components/Badget";
import Button from "../../../components/Button.jsx";
import { useLocalStorageState } from "../../../hooks/useLocalStorageState.js";
import "./billing.css";

const PLAN_OPTIONS = {
    starter: { name: "Plan Starter", price: 39, period: "mes" },
    professional: { name: "Plan Profesional", price: 89, period: "mes" },
    enterprise: { name: "Plan Enterprise", price: 149, period: "mes" },
};

function getNextBillingDate() {
    const date = new Date();
    date.setMonth(date.getMonth() + 1);
    return date.toLocaleDateString("es-ES", {
        day: "numeric",
        month: "short",
        year: "numeric",
    });
}

const Billing = ({ veterinary }) => {
    const storageKey = React.useMemo(
        () => `admin_billing_${veterinary?.id ?? "default"}`,
        [veterinary?.id]
    );

    const [billing, setBilling] = useLocalStorageState(storageKey, {
        plan: "professional",
        payments: [
            { id: "1", date: "1 Feb 2026", amount: "$89.00", status: "Pagado" },
            { id: "2", date: "1 Ene 2026", amount: "$89.00", status: "Pagado" },
            { id: "3", date: "1 Dic 2025", amount: "$89.00", status: "Pagado" },
        ],
    });

    const currentPlan = PLAN_OPTIONS[billing.plan] ?? PLAN_OPTIONS.professional;

    const changePlan = (plan) => {
        const planInfo = PLAN_OPTIONS[plan];
        setBilling((prev) => ({
            plan,
            payments: [
                {
                    id: crypto.randomUUID(),
                    date: new Date().toLocaleDateString("es-ES", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                    }),
                    amount: `$${planInfo.price}.00`,
                    status: "Pagado",
                },
                ...prev.payments,
            ],
        }));
    };

    return (
        <div className="billingPage">
            <Card className="currentPlanCard">
                <CardHeader className="currentPlanHeader">
                    <CardTitle className="currentPlanHeaderTitle">Plan actual</CardTitle>
                </CardHeader>
                <CardContent className="currentPlanContent">
                    <div className="currentPlanInfo">
                        <div className="currentPlanInfoDetails">
                            <p className="currentPlanInfoName">{currentPlan.name}</p>
                            <p className="currentPlanInfoDate">Facturación mensual · Próximo cobro: {getNextBillingDate()}</p>
                        </div>
                        <div className="currentPlanInfoPrice">
                            <p>${currentPlan.price}<span>/{currentPlan.period}</span></p>
                        </div>
                    </div>

                    <div className="billingPlans">
                        {Object.entries(PLAN_OPTIONS).map(([id, plan]) => (
                            <Button
                                key={id}
                                type="button"
                                className={`btn billingPlanButton ${billing.plan === id ? "billingPlanButtonActive" : ""}`}
                                label={`${plan.name} · $${plan.price}`}
                                onClick={() => changePlan(id)}
                            />
                        ))}
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader className="paymentHistoryHeader">
                    <CardTitle className="paymentHistoryHeaderTitle">Historial de pagos</CardTitle>
                </CardHeader>
                <CardContent className="paymentHistoryContent">
                    <div className="paymentHistoryList">
                        {billing.payments.map((payment) => (
                            <div key={payment.id} className="paymentRecord">
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
    );
};

export default Billing;

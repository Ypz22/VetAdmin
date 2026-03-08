import React from "react";
import { Icons } from "./Named-lucide.jsx";
import Button from "./Button.jsx";
import Input from "./Input.jsx";
import { useAppointmentsCount } from "../queries/appointments.queries.js";
import { useDebounce } from "../hooks/useDebounce.js";
import { useGlobalSearch } from "../queries/globlaSearch.queries.js";

const TYPE_LABEL = {
    services: "Servicio",
    pets: "Mascota",
    appointments: "Cita",
};

const DashboardHeader = () => {
    const { data: appointmentsCount = 0 } = useAppointmentsCount();

    const [search, setSearch] = React.useState("");
    const [open, setOpen] = React.useState(false);

    const wrapperRef = React.useRef(null);

    const debouncedSearch = useDebounce(search, 400);

    const { data: results = [], isFetching } = useGlobalSearch(debouncedSearch);

    React.useEffect(() => {
        function handleClickOutside(e) {
            if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
                setOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const formatDate = (date = new Date()) => {
        const day = date.getDate().toString().padStart(2, "0");
        const month = date.toLocaleString("en-US", { month: "short" });
        const year = date.getFullYear();
        return `${day} ${month}, ${year}`;
    };

    const t = (debouncedSearch ?? "").trim();
    const showDropdown = open && t.length >= 2;

    return (
        <header className="homeDashboardHeader">
            <div className="homeDashboardHeader-left">
                <Button
                    className="menuButton"
                    label={<Icons.Menu className="sizeIcon5" />}
                />

                <div className="menuDashboardSearch" ref={wrapperRef}>
                    <Icons.Search className="menuDashboardSearchIcon" />
                    <Input
                        className="input menuDashboardSearchInput"
                        type="text"
                        placeholder="Buscar pacientes, citas..."
                        value={search}
                        onFocus={() => setOpen(true)}
                        onChange={(e) => {
                            setSearch(e.target.value);
                            setOpen(true);
                        }}
                    />

                    {showDropdown && (
                        <div className="searchDropdown">
                            <div className="searchDropdownHeader">
                                <span>Resultados</span>
                                {isFetching && <span className="searchSpinner">Buscando…</span>}
                            </div>

                            <div className="searchDropdownBody">
                                {!isFetching && results.length === 0 && (
                                    <div className="searchEmpty">
                                        <p className="searchEmptyTitle">Sin resultados</p>
                                        <p className="searchEmptySub">
                                            Prueba con otro nombre o palabra clave.
                                        </p>
                                    </div>
                                )}

                                {results.map((item) => (
                                    <div
                                        key={`${item.type}-${item.id}`}
                                        className="searchItem"
                                        onMouseDown={(e) => e.preventDefault()}
                                        onClick={() => setOpen(false)}
                                    >
                                        <div className="searchItemMain">
                                            <span className="searchItemLabel">{item.label}</span>
                                            <span className="searchItemType">
                                                {TYPE_LABEL[item.type] ?? item.type}
                                            </span>
                                        </div>

                                        <div className="searchItemMeta">{item.meta}</div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="homeDashboardHeader-right">
                <Button
                    label={
                        <>
                            <Icons.Bell className="sizeIcon5 icon" />
                            {appointmentsCount > 0 && <span />}
                        </>
                    }
                />
                <span>{formatDate()}</span>
            </div>
        </header>
    );
};

export default DashboardHeader;

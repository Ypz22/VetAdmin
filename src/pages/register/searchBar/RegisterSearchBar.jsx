import React from "react";
import { Icons } from "../../../components/Named-lucide";
import Button from "../../../components/Button";
import Input from "../../../components/Input";
import "./registerSearchBar.css";

const RegisterSearchBar = ({ searchQuery, setSearchQuery, speciesFilters, setSpeciesFilter, speciesFilter, inputRef }) => {

    return (
        <div className="registerSearchBar">
            <div className="registerSearchBarInputContainer">
                <Icons.Search className="registerSearchBarIcon" />
                <Input
                    ref={inputRef}
                    placeholder="Buscar por nombre, propietario, raza o ID..."
                    className="registerSearchBarInput"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                />
                {searchQuery && (
                    <Button
                        type="button"
                        className="registerSearchBarClearButton"
                        label={<Icons.X className="registerSearchBarClearIcon" />}
                        onClick={() => setSearchQuery("")}
                    />
                )}
            </div>
            <div className="registerSpeciesFilterButtons">
                {speciesFilters.map((specie) => (
                    <Button
                        key={specie.value}
                        type="button"
                        className={`btn ${speciesFilter === specie.value ? "btn-default" : "btn-outline"} ${speciesFilter === specie.value ? "registerSpeciesFilterButtonActive" : "registerSpeciesFilterButtonInactive"}`}
                        onClick={() => setSpeciesFilter(specie.value)}
                        label={specie.label}
                    />
                ))}
            </div>
        </div>
    )
};

export default RegisterSearchBar;

import React from "react";

const DetailItem = ({ label, value }) => {
    return (
        <div className="detailItem">
            <span className="detailLabel">{label}:</span>
            <span className="detailValue">{value}</span>
        </div>
    );
};

export default DetailItem;
import Button from "./Button.jsx";
import { Icons } from "./Named-lucide.jsx";

const PaginationControls = ({
    currentPage,
    totalItems,
    itemsPerPage = 5,
    onPageChange,
    className = "",
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    if (totalPages <= 1) return null;

    return (
        <div className={`paginationControls ${className}`}>
            <span className="paginationSummary">
                Pagina {currentPage} de {totalPages}
            </span>
            <div className="paginationActions">
                <Button
                    type="button"
                    className="btn paginationButton"
                    onClick={() => onPageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    label={
                        <>
                            <Icons.ChevronLeft className="sizeIcon4" />
                            Anterior
                        </>
                    }
                />
                <Button
                    type="button"
                    className="btn paginationButton"
                    onClick={() => onPageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    label={
                        <>
                            Siguiente
                            <Icons.ChevronRight className="sizeIcon4" />
                        </>
                    }
                />
            </div>
        </div>
    );
};

export default PaginationControls;

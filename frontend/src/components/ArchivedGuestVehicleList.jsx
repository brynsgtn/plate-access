import { useEffect, useState } from "react";
import { Search, ArchiveIcon, RotateCcwIcon } from "lucide-react";
import { useGuestVehicleStore } from "../stores/useGuestVehicleStore";
import { useUserStore } from "../stores/useUserStore";
import LoadingSpinner from "./LoadingSpinner";
import dayjs from "dayjs";

const VEHICLES_PER_PAGE = 10;

const ArchivedGuestVehicleList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [restoreModal, setRestoreModal] = useState(false);
    const [selectedVehicle, setSelectedVehicle] = useState(null);

    const { user } = useUserStore();
    const {
        guestVehicles,
        loadingGuestVehicles,
        fetchGuestVehicles,
        archiveUnarchiveGuestVehicle
    } = useGuestVehicleStore();

    useEffect(() => {
        fetchGuestVehicles();
    }, [fetchGuestVehicles]);

    const archivedVehicles = guestVehicles.filter(v => v.isArchived);

    const filteredVehicles = archivedVehicles.filter(v =>
        v.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = Math.ceil(filteredVehicles.length / VEHICLES_PER_PAGE);
    const paginatedVehicles = filteredVehicles.slice(
        (page - 1) * VEHICLES_PER_PAGE,
        page * VEHICLES_PER_PAGE
    );

    const handleRestoreClick = (vehicle) => {
        setSelectedVehicle(vehicle);
        setRestoreModal(true);
    };

    const handleConfirmRestore = () => {
        if (selectedVehicle) {
            archiveUnarchiveGuestVehicle(selectedVehicle._id);
            setRestoreModal(false);
            setSelectedVehicle(null);
        }
    };

    if (loadingGuestVehicles) {
        return (
            <div className="flex items-center justify-center py-10 h-96">
                <LoadingSpinner className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto max-w-6xl mx-auto mt-10 mb-20 rounded-xl shadow-lg bg-base-100 border border-base-300">
                {/* Header */}
                <div className="border-b border-base-300 bg-gradient-to-r from-primary to-secondary p-6 rounded-t-xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <h2 className="text-2xl font-bold text-white">Archived Guest Vehicles</h2>
                        <label className="input flex items-center gap-2 w-full md:w-64">
                            <Search className="w-4 h-4 opacity-70" />
                            <input
                                type="text"
                                className="grow"
                                placeholder="Search by plate number"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </label>
                    </div>
                    <p className="text-white/80 mt-2">View {user.role === "admin" && "and restore"} archived guest vehicles</p>
                </div>
                {/* Stats */}
                <div className="stats w-full bg-base-100 border-base-300">
                    <div className="stat flex flex-row items-center justify-around">
                        <div className="text-warning">
                            <ArchiveIcon className="h-8 w-8" />
                        </div>
                        <div className="text-xl font-semibold">Total Archived Guest Vehicles</div>
                        <div className="stat-value text-accent text-3xl font-bold">
                            {archivedVehicles.length}
                        </div>
                    </div>
                </div>

                {/* Table */}
                <table className="table table-zebra w-full">
                    <thead className="bg-base-200">
                        <tr>
                            <th className="text-base font-semibold">#</th>
                            <th className="text-base font-semibold">Plate Number</th>
                            <th className="text-base font-semibold">Make & Model</th>
                            <th className="text-base font-semibold">Owner</th>
                            <th className="text-base font-semibold">Archived On</th>
                            {user.role === "admin" && <th className="text-base font-semibold">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedVehicles.length === 0 ? (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-base-content/70">
                                    No archived vehicles found.
                                </td>
                            </tr>
                        ) : (
                            paginatedVehicles.map((vehicle, idx) => (
                                <tr key={vehicle._id} className="hover:bg-base-200 transition">
                                    <th>{idx + 1}</th>
                                    <td>{vehicle.plateNumber}</td>
                                    <td>{vehicle.makeModel}</td>
                                    <td>{vehicle.ownerName}</td>
                                    <td>{vehicle.updatedAt ? dayjs(vehicle.updatedAt).format("MMM D, YYYY") : "-"}</td>
                                    {user.role === "admin" && (<td>
                                        <button
                                            onClick={() => handleRestoreClick(vehicle)}
                                            className="btn btn-xs btn-outline btn-success gap-1"
                                        >
                                            <RotateCcwIcon className="h-4 w-4" />
                                            Restore
                                        </button>
                                    </td>)}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center mb-10">
                    <div className="join">
                        {Array.from({ length: totalPages }).map((_, i) => (
                            <input
                                key={i}
                                className="join-item btn btn-square"
                                type="radio"
                                name="pagination"
                                aria-label={String(i + 1)}
                                checked={page === i + 1}
                                onChange={() => setPage(i + 1)}
                                readOnly
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Restore Modal */}
            {restoreModal && (
                <div
                    className="modal modal-open backdrop-blur-md"
                    onClick={() => setRestoreModal(false)}
                >
                    <div
                        className="modal-box bg-gradient-to-r from-primary to-secondary shadow-lg rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-2xl font-semibold mb-6 text-white">Restore Vehicle</h3>
                        <p className="text-gray-200 mb-4">
                            Are you sure you want to restore vehicle{" "}
                            <span className="font-bold">{selectedVehicle?.plateNumber}</span> to active list?
                        </p>
                        <div className="modal-action">
                            <button
                                onClick={() => setRestoreModal(false)}
                                className="btn btn-sm btn-ghost text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmRestore}
                                className="btn btn-accent btn-sm text-white"
                            >
                                Restore Vehicle
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ArchivedGuestVehicleList;

import { useState, useEffect } from "react";
import { Search, ParkingCircleIcon, ParkingCircleOffIcon, CarFrontIcon, RotateCcw, Archive } from "lucide-react";
import { useVehicleStore } from "../stores/useVehicleStore";
import LoadingSpinner from "./LoadingSpinner";
import { useUserStore } from "../stores/useUserStore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const VEHICLES_PER_PAGE = 10;

const ArchivedVehicleList = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [restoreModal, setRestoreModal] = useState(false);
    const [exportModal, setExportModal] = useState(false);

    const [formData, setFormData] = useState({
        id: "",
        plateNumber: "",
        makeModel: "",
        ownerName: "",
        branch: "",
    });

    // Columns for CSV export
    const [exportColumns, setExportColumns] = useState({
        "Plate Number": true,
        "Make & Model": true,
        "Owner": true,
        "Status": true,
        "Branch": true,
        "Archived On": true,
    });

    const {
        vehicles,
        loadingVehicles,
        archiveUnarchiveVehicle,
        viewVehicles
    } = useVehicleStore();
    const { user } = useUserStore();

    useEffect(() => {
        viewVehicles();
    }, [viewVehicles]);

    const currentUserBranch = user.branch;

    const handleRestore = (id) => {
        const vehicleToRestore = vehicles.find((v) => v._id === id);
        setFormData({
            id: vehicleToRestore._id,
            plateNumber: vehicleToRestore.plateNumber,
            makeModel: vehicleToRestore.makeModel,
            ownerName: vehicleToRestore.ownerName,
            branch: vehicleToRestore.branch
        });
        setRestoreModal(true);
    };

    const handleConfirmRestore = () => {
        archiveUnarchiveVehicle(formData.id);
        setFormData({
            id: "", plateNumber: "", makeModel: "", ownerName: "", branch: "",
        });
        setRestoreModal(false);
    };

    const handleExportCSV = () => {
        const exportData = archivedVehicleList.map(v => {
            const row = {};
            if (exportColumns["Plate Number"]) row["Plate Number"] = v.plateNumber;
            if (exportColumns["Make & Model"]) row["Make & Model"] = v.makeModel;
            if (exportColumns["Owner"]) row["Owner"] = v.ownerName;
            if (exportColumns["Status"]) row["Status"] = v.isBlacklisted ? "Blacklisted" : "Authorized";
            if (exportColumns["Branch"]) row["Branch"] = v.branch || "-";
            if (exportColumns["Archived On"]) row["Archived On"] = v.updatedAt ? dayjs(v.updatedAt).format("MMM D YYYY") : "-";
            return row;
        });

        if (exportData.length === 0) {
            alert("No data to export.");
            return;
        }

        const csvContent = [
            Object.keys(exportData[0]).join(","),
            ...exportData.map(row => Object.values(row).join(","))
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const timestamp = dayjs().format("MMM-DD-YYYY");
        link.href = url;
        link.setAttribute("download", `archived_vehicles_${timestamp}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setExportModal(false);
    };

    const archivedVehicleList = vehicles
        .filter(vehicle => {
            // Only show archived vehicles
            if (!vehicle?.isArchived) return false;

            // If the user is parkingStaff, only show their branch
            if (user.role === "parkingStaff") {
                return vehicle?.branch === currentUserBranch;
            }

            // Admin can see all
            return true;
        })
        .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

    // Filter vehicles by plate number
    const filteredVehicles = archivedVehicleList.filter((vehicle) =>
        vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = filteredVehicles ? Math.ceil(filteredVehicles.length / VEHICLES_PER_PAGE) : 1;
    const paginatedVehicles = filteredVehicles
        ? filteredVehicles.slice((page - 1) * VEHICLES_PER_PAGE, page * VEHICLES_PER_PAGE)
        : [];

    const totalArchivedVehicles = archivedVehicleList.length;
    const archivedAuthorizedVehicles = archivedVehicleList.filter((vehicle) => !vehicle.isBlacklisted).length;
    const archivedBlacklistedVehicles = archivedVehicleList.filter((vehicle) => vehicle.isBlacklisted).length;

    if (loadingVehicles) {
        return (
            <div className="flex items-center justify-center py-10 h-96">
                <LoadingSpinner className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto max-w-6xl mx-auto mt-10 rounded-xl shadow-lg bg-base-100 border border-base-300 rounded-b-none">
                {/* Header with Search */} 
                <div className="border-b border-base-300 bg-gradient-to-r from-primary to-secondary p-6 rounded-t-xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div className="flex items-center gap-3">
                            <h2 className="text-2xl font-bold text-white">Archived Vehicles</h2>
                        </div>
                        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                            {/* Search Bar */}
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
                    </div>
                    <p className="text-white/80 mt-2">View archived vehicles{user.role === "admin" && " and reactivate archived vehicles"} </p>
                    <div className="flex justify-end">
                        <button
                            className="btn btn-sm btn-accent text-white"
                            onClick={() => setExportModal(true)}
                        >
                            Export CSV
                        </button>
                    </div>
                </div>

                {/* Stats */}
                <div className="stats stats-vertical md:stats-horizontal w-full bg-base-100 border-base-300">
                    <div className="stat">
                        <div className="stat-figure text-warning">
                            <Archive className="h-8 w-8" />
                        </div>
                        <div className="stat-title">Total Archived</div>
                        <div className="stat-value text-warning">
                            {totalArchivedVehicles}
                        </div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-warning">
                            <ParkingCircleIcon className="h-8 w-8" />
                        </div>
                        <div className="stat-title">Archived Authorized</div>
                        <div className="stat-value text-warning">
                            {archivedAuthorizedVehicles}
                        </div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <ParkingCircleOffIcon className="h-8 w-8" />
                        </div>
                        <div className="stat-title">Archived Blacklisted</div>
                        <div className="stat-value text-primary">
                            {archivedBlacklistedVehicles}
                        </div>
                    </div>
                </div>

            </div>
            <div className="overflow-x-auto max-w-6xl mx-auto mb-10 rounded-xl shadow-lg bg-base-100 border border-base-300 border-t-0 rounded-t-none">

                {/* Vehicle Table */}
                <table className="table table-zebra w-full">
                    <thead className="bg-base-200">
                        <tr>
                            <th className="text-base font-semibold text-base-content">#</th>
                            <th className="text-base font-semibold text-base-content">Plate Number</th>
                            <th className="text-base font-semibold text-base-content">Make & Model</th>
                            <th className="text-base font-semibold text-base-content">Owner</th>
                            <th className="text-base font-semibold text-base-content">Status</th>
                            <th className="text-base font-semibold text-base-content">Branch</th>
                            <th className="text-base font-semibold text-base-content">Archived On</th>
                            {user.role === "admin" && (
                                <th className="text-base font-semibold text-base-content">Actions</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedVehicles.length === 0 ? (
                            <tr>
                                <td colSpan={8} className="text-center py-8 text-base-content/70">
                                    No archived vehicles found.
                                </td>
                            </tr>
                        ) : (
                            paginatedVehicles.map((vehicle, idx) => (
                                <tr key={vehicle._id} className="hover:bg-base-200 transition">
                                    <th className="py-4">{(page - 1) * VEHICLES_PER_PAGE + idx + 1}</th>
                                    <td className="py-4 font-semibold">{vehicle.plateNumber}</td>
                                    <td className="py-4">{vehicle.makeModel}</td>
                                    <td className="py-4">{vehicle.ownerName}</td>
                                    <td className="py-4">
                                        {vehicle.isBlacklisted ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-error border border-error shadow-sm">
                                                Blacklisted
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-success border border-success shadow-sm">
                                                Authorized
                                            </span>
                                        )}
                                    </td>
                                    <td className="py-4">{vehicle.branch ? vehicle.branch : '-'}</td>
                                    <td className="py-4">
                                        {vehicle.updatedAt ? dayjs(vehicle.updatedAt).fromNow() : '-'}
                                    </td>
                                    {user.role === "admin" && (<td className="py-4">
                                        <button
                                            onClick={() => handleRestore(vehicle._id)}
                                            className="btn btn-xs btn-outline btn-success gap-1"
                                            title="Restore Vehicle"
                                        >
                                            <RotateCcw className="h-3 w-3" />
                                            Reactivate
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
                                name="archived-pagination"
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
                        <h3 className="text-2xl font-semibold mb-6 text-white">Reactivate Vehicle</h3>

                        <p className="text-gray-200 mb-4">
                            Are you sure you want to reactivate vehicle{" "}
                            <span className="font-bold">{formData.plateNumber}</span>?
                        </p>
                        <p className="text-gray-300 text-sm mb-4">
                            This will move the vehicle back to the active vehicle list.
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
                                className="btn btn-success"
                            >
                                <RotateCcw className="h-4 w-4 mr-1" />
                                Reactivate Vehicle
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Export Modal */}
            {exportModal && (
                <div
                    className="modal modal-open backdrop-blur-sm bg-black/40"
                    onClick={() => setExportModal(false)}
                >
                    <div
                        className="modal-box max-w-md w-full bg-base-100 p-6 rounded-xl shadow-xl transform scale-100 transition-transform duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-2xl font-bold mb-4 text-center text-primary">Export Archived Vehicles</h3>
                        <p className="text-sm text-gray-500 mb-4 text-center">
                            Select the columns to include in your CSV export.
                        </p>

                        <div className="flex flex-col gap-3 mb-6">
                            {Object.keys(exportColumns).map((col) => (
                                <label key={col} className="flex items-center gap-3 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-primary"
                                        checked={exportColumns[col]}
                                        onChange={() =>
                                            setExportColumns({ ...exportColumns, [col]: !exportColumns[col] })
                                        }
                                    />
                                    <span className="text-base font-medium">{col}</span>
                                </label>
                            ))}
                        </div>

                        <div className="modal-action justify-between">
                            <button
                                onClick={() => setExportModal(false)}
                                className="btn btn-outline btn-sm text-gray-600 hover:text-gray-800 hover:border-gray-400"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleExportCSV}
                                className="btn btn-primary btn-sm text-white"
                            >
                                Export CSV
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default ArchivedVehicleList;
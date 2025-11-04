import { useState, useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useVehicleStore } from "../stores/useVehicleStore";
import { useGuestVehicleStore } from "../stores/useGuestVehicleStore";
import { ParkingCircleOffIcon, Search, Download, X, FileSpreadsheet, ParkingCircleIcon, Ban } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";
import Papa from "papaparse";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { set } from "mongoose";

dayjs.extend(relativeTime);

const VEHICLES_PER_PAGE = 10;

const BlacklistedVehicleList = () => {
    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [unBlacklistModal, setUnBlacklistModal] = useState(false);
    const [banVehicleModal, setBanVehicleModal] = useState(false);
    const [formData, setFormData] = useState({
        id: "",
        plateNumber: "",
        reason: "",
    });

    // Export modal states
    const [selectedColumns, setSelectedColumns] = useState({
        plateNumber: true,
        makeModel: true,
        ownerName: true,
        branch: true,
        blacklistedSince: true,
        type: false,
    });
    const [includeRegular, setIncludeRegular] = useState(true);
    const [includeGuest, setIncludeGuest] = useState(true);
    const [sortBy, setSortBy] = useState('date-desc');

    const { user } = useUserStore();
    const { vehicles, blacklistOrUnblacklistVehicle, viewVehicles, loadingVehicles, banVehicle } = useVehicleStore();
    const { guestVehicles, } = useGuestVehicleStore();

    const blacklistedVehicles = vehicles.filter((vehicle) => vehicle?.isBlacklisted).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    useEffect(() => {
        viewVehicles();
        ;
    }, [viewVehicles]);

    // Filter vehicles by plate number
    const filteredVehicles = blacklistedVehicles.filter((vehicle) =>
        vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = filteredVehicles ? Math.ceil(filteredVehicles.length / VEHICLES_PER_PAGE) : 1;
    const paginatedVehicles = filteredVehicles
        ? filteredVehicles.slice((page - 1) * VEHICLES_PER_PAGE, page * VEHICLES_PER_PAGE)
        : [];

    const handleUnblacklist = (id) => {
        if (user.role === "admin") {
            blacklistOrUnblacklistVehicle(id, formData.reason);
            setFormData({
                id: "",
                plateNumber: "",
                reason: "",
            });
            setUnBlacklistModal(false);
        } else {
            toast.error("You are not authorized to unblacklist vehicles.");
        };
    }

    const handleBanVehicle = (id) => {
        if (user.role === "admin") {
            banVehicle(id, formData.reason);
            setFormData({
                id: "",
                plateNumber: "",
                reason: "",
            });
            setBanVehicleModal(false);
        } else {
            toast.error("You are not authorized to ban vehicles.");
        };
    }

    const handleUnblacklistModal = (id, plateNumber) => {
        setUnBlacklistModal(true);
        setFormData({ ...formData, id, plateNumber });
    }

    const handleBanVehicleModal = (id, plateNumber) => {
        setBanVehicleModal(true);
        setFormData({ ...formData, id, plateNumber });
    }

    // Export functionality
    const availableColumns = [
        { key: 'plateNumber', label: 'Plate Number' },
        { key: 'makeModel', label: 'Make & Model' },
        { key: 'ownerName', label: 'Owner' },
        { key: 'branch', label: 'Branch' },
        { key: 'blacklistedSince', label: 'Blacklisted Since' },
        { key: 'type', label: 'Type (Regular/Guest)' },
    ];

    const handleColumnToggle = (key) => {
        setSelectedColumns(prev => ({
            ...prev,
            [key]: !prev[key]
        }));
    };

    const handleSelectAll = () => {
        const allSelected = Object.values(selectedColumns).every(v => v);
        const newState = {};
        Object.keys(selectedColumns).forEach(key => {
            newState[key] = !allSelected;
        });
        setSelectedColumns(newState);
    };

    const handleExport = () => {
        try {
            let data = [];

            if (includeRegular) {
                const blacklistedVehicles = vehicles
                    .filter(v => v.isBlacklisted)
                    .map(v => ({
                        plateNumber: v.plateNumber,
                        makeModel: v.makeModel,
                        ownerName: v.ownerName,
                        branch: v.branch || 'N/A',
                        blacklistedSince: v.isBlacklistedAt
                            ? dayjs(v.isBlacklistedAt).format('MMM DD, YYYY hh:mm A')
                            : 'N/A',
                        type: 'Regular',
                    }));
                data = [...data, ...blacklistedVehicles];
            }

            if (includeGuest) {
                const blacklistedGuests = (guestVehicles || [])
                    .filter(gv => gv.isBlacklisted)
                    .map(gv => ({
                        plateNumber: gv.plateNumber,
                        makeModel: gv.makeModel,
                        ownerName: gv.ownerName,
                        branch: 'Guest',
                        blacklistedSince: gv.isBlacklistedAt
                            ? dayjs(gv.isBlacklistedAt).format('MMM DD, YYYY')
                            : 'N/A',
                        type: 'Guest',
                    }));
                data = [...data, ...blacklistedGuests];
            }

            if (data.length === 0) {
                toast.error('No blacklisted vehicles to export');
                return;
            }

            // Sort data
            data.sort((a, b) => {
                switch (sortBy) {
                    case 'date-desc':
                        return new Date(b.blacklistedSince) - new Date(a.blacklistedSince);
                    case 'date-asc':
                        return new Date(a.blacklistedSince) - new Date(b.blacklistedSince);
                    case 'plate-asc':
                        return a.plateNumber.localeCompare(b.plateNumber);
                    case 'plate-desc':
                        return b.plateNumber.localeCompare(a.plateNumber);
                    case 'branch':
                        return a.branch.localeCompare(b.branch);
                    default:
                        return 0;
                }
            });

            // Filter columns
            const filteredData = data.map(row => {
                const filtered = {};
                Object.keys(selectedColumns).forEach(key => {
                    if (selectedColumns[key]) {
                        filtered[key] = row[key];
                    }
                });
                return filtered;
            });

            // Create custom headers
            const headers = availableColumns
                .filter(col => selectedColumns[col.key])
                .reduce((acc, col) => {
                    acc[col.key] = col.label;
                    return acc;
                }, {});

            // Convert to CSV
            const csv = Papa.unparse(filteredData, {
                columns: Object.keys(headers),
                header: true,
            });

            // Replace header keys with labels
            const lines = csv.split('\n');
            const labelLine = Object.values(headers).join(',');
            lines[0] = labelLine;
            const finalCsv = lines.join('\n');

            // Download
            const blob = new Blob([finalCsv], { type: 'text/csv;charset=utf-8;' });
            const link = document.createElement('a');
            const url = URL.createObjectURL(blob);

            const timestamp = dayjs().format('YYYY-MM-DD');
            link.setAttribute('href', url);
            link.setAttribute('download', `Blacklisted_Vehicles_${timestamp}.csv`);
            link.style.visibility = 'hidden';

            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success(`Exported ${filteredData.length} blacklisted vehicle(s)`);
            setIsExportModalOpen(false);

        } catch (error) {
            console.error('Export error:', error);
            toast.error('Failed to export data');
        }
    };

    const selectedCount = Object.values(selectedColumns).filter(Boolean).length;
    const blacklistedGuestCount = (guestVehicles || []).filter(gv => gv.isBlacklisted).length;

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
                <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-t-xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                        <div>
                            <h2 className="text-2xl font-bold text-white">Blacklisted Vehicle List</h2>
                            <p className="text-white/80 mt-2">Blacklisted vehicles will be displayed here</p>
                        </div>
                        <div className="flex flex-col md:flex-row gap-3 w-full md:w-auto">
                            {/* Export Button */}
                            <button
                                onClick={() => setIsExportModalOpen(true)}
                                className="btn btn-accent gap-2"
                            >
                                <FileSpreadsheet size={18} />
                                Export CSV
                            </button>

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
                </div>

                {/* Stats */}
                <div className="stats stats-vertical md:stats-horizontal w-full bg-base-100 border-base-300">
                    <div className="stat flex flex-row items-center justify-around">
                        <div className="text-warning">
                            <ParkingCircleOffIcon className="h-8 w-8" />
                        </div>
                        <div className="text-xl font-semibold">Total Blacklist Vehicles</div>
                        <div className="stat-value text-error">
                            {blacklistedVehicles.length}
                        </div>
                    </div>
                </div>

            </div>
            <div className="overflow-x-auto max-w-6xl mx-auto mb-10 rounded-xl shadow-lg bg-base-100 border border-base-300 rounded-t-none border-t-0">

                <table className="table table-zebra w-full">
                    <thead className="bg-base-200">
                        <tr>
                            <th className="text-base font-semibold text-base-content">#</th>
                            <th className="text-base font-semibold text-base-content">Plate Number</th>
                            <th className="text-base font-semibold text-base-content">Status</th>
                            <th className="text-base font-semibold text-base-content">Actioned Since</th>
                            <th className="text-base font-semibold text-base-content">Reason</th>
                            <th className="text-base font-semibold text-base-content">Actioned By</th>
                            {user.role === "admin" && (
                                <th className="text-base font-semibold text-base-content">Action</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedVehicles.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-base-content/70">
                                    No blacklisted vehicles found.
                                </td>
                            </tr>
                        )}
                        {paginatedVehicles.map((vehicle, idx) => (
                            <tr key={vehicle._id} className="hover:bg-base-200 transition">
                                <th>{(page - 1) * VEHICLES_PER_PAGE + idx + 1}</th>
                                <td>{vehicle.plateNumber}</td>
                                <td>{vehicle.isBanned ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold 
                                            text-error border border-error shadow-sm bg-error/30 w-24">
                                        <Ban className="h-4 w-4" />
                                        Banned
                                    </span>
                                ) : (

                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold 
                                            text-error border border-error shadow-sm w-24">
                                        <ParkingCircleIcon className="h-4 w-4" />
                                        Blacklisted
                                    </span>
                                )}</td>
                                <td>
                                    {vehicle.bannedAt
                                        ? dayjs(vehicle.bannedAt).fromNow()
                                        : vehicle.isBlacklistedAt
                                            ? dayjs(vehicle.isBlacklistedAt).fromNow()
                                            : "-"}
                                </td>
                                <td className="relative">
                                    <div className="inline-block group">
                                        <span className="truncate max-w-[150px] inline-block">
                                            {vehicle.bannedReason || vehicle.blacklistReason || "-"}
                                        </span>

                                        {(vehicle.bannedReason?.length > 15 || vehicle.blacklistReason?.length > 15) && (
                                            <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 px-2 py-1 text-xs text-white bg-primary rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-10 transition-opacity duration-200 pointer-events-none">
                                                {vehicle.bannedReason || vehicle.blacklistReason}
                                            </div>
                                        )}
                                    </div>
                                </td>
                                <td>
                                    {vehicle.bannedBy
                                        ? vehicle.bannedBy.username
                                        : vehicle.blacklistedBy?.username ? vehicle.blacklistedBy.username : "-"}
                                </td>
                                {
                                    user.role === "admin" && (
                                        <td>
                                            <button
                                                onClick={() => handleUnblacklistModal(vehicle._id, vehicle.plateNumber)}
                                                className={`btn btn-xs btn-ghost text-success hover:bg-success/10 hover:text-success transition border-none ${vehicle.isBanned ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                title="Unblacklist"
                                            >
                                                <ParkingCircleIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleBanVehicleModal(vehicle._id, vehicle.plateNumber)}
                                                className={`btn btn-xs btn-ghost text-error hover:bg-error/10 hover:text-error transition border-none ${vehicle.isBanned ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                title="Ban Vehicle"
                                            >
                                                <Ban className="h-4 w-4" />
                                            </button>
                                        </td>
                                    )
                                }
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div >

            {/* Pagination */}
            {
                totalPages > 1 && (
                    <div className="flex justify-center mb-10">
                        <div className="join">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <input
                                    key={i}
                                    className="join-item btn btn-square"
                                    type="radio"
                                    name="user-pagination"
                                    aria-label={String(i + 1)}
                                    checked={page === i + 1}
                                    onChange={() => setPage(i + 1)}
                                    readOnly
                                />
                            ))}
                        </div>
                    </div>
                )
            }

            {/* Export Modal */}
            {
                isExportModalOpen && (
                    <div className="fixed inset-0 backdrop-blur-md flex items-center justify-center z-50 p-4">
                        <div className="bg-base-100 rounded-lg shadow-xl max-w-xl w-full max-h-[90vh] overflow-y-auto">
                            {/* Header */}
                            <div className="flex justify-between items-center p-6 border-b border-base-300">
                                <div>
                                    <h2 className="text-2xl font-bold">Export Blacklisted Vehicles</h2>
                                    <p className="text-sm text-base-content/60 mt-1">Customize your export options</p>
                                </div>
                                <button
                                    onClick={() => setIsExportModalOpen(false)}
                                    className="btn btn-ghost btn-sm btn-circle"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Content */}
                            <div className="p-6 space-y-6">
                                {/* Data Source */}
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <span className="badge badge-primary">1</span>
                                        Select Data Source
                                    </h3>
                                    <div className="space-y-2 ml-8">
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-primary"
                                                checked={includeRegular}
                                                onChange={(e) => setIncludeRegular(e.target.checked)}
                                            />
                                            <span>Include Regular Vehicles ({blacklistedVehicles.length})</span>
                                        </label>
                                        <label className="flex items-center gap-2 cursor-pointer">
                                            <input
                                                type="checkbox"
                                                className="checkbox checkbox-primary"
                                                checked={includeGuest}
                                                onChange={(e) => setIncludeGuest(e.target.checked)}
                                            />
                                            <span>Include Guest Vehicles ({blacklistedGuestCount})</span>
                                        </label>
                                    </div>
                                </div>

                                {/* Columns Selection */}
                                <div>
                                    <div className="flex justify-between items-center mb-3">
                                        <h3 className="font-semibold flex items-center gap-2">
                                            <span className="badge badge-primary">2</span>
                                            Select Columns ({selectedCount}/{availableColumns.length})
                                        </h3>
                                        <button
                                            onClick={handleSelectAll}
                                            className="btn btn-ghost btn-xs"
                                        >
                                            {Object.values(selectedColumns).every(v => v) ? 'Deselect All' : 'Select All'}
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-2 gap-2 ml-8">
                                        {availableColumns.map(col => (
                                            <label
                                                key={col.key}
                                                className="flex items-center gap-2 cursor-pointer hover:bg-base-200 p-2 rounded"
                                            >
                                                <input
                                                    type="checkbox"
                                                    className="checkbox checkbox-sm checkbox-primary"
                                                    checked={selectedColumns[col.key]}
                                                    onChange={() => handleColumnToggle(col.key)}
                                                />
                                                <span className="text-sm">{col.label}</span>
                                            </label>
                                        ))}
                                    </div>
                                </div>

                                {/* Sort Options */}
                                <div>
                                    <h3 className="font-semibold mb-3 flex items-center gap-2">
                                        <span className="badge badge-primary">3</span>
                                        Sort By
                                    </h3>
                                    <select
                                        className="select select-bordered w-full"
                                        value={sortBy}
                                        onChange={(e) => setSortBy(e.target.value)}
                                    >
                                        <option value="date-desc">Blacklisted Date (Newest First)</option>
                                        <option value="date-asc">Blacklisted Date (Oldest First)</option>
                                        <option value="plate-asc">Plate Number (A-Z)</option>
                                        <option value="plate-desc">Plate Number (Z-A)</option>
                                        <option value="branch">Branch (Alphabetical)</option>
                                    </select>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="flex justify-end gap-3 p-6 border-t border-base-300">
                                <button
                                    onClick={() => setIsExportModalOpen(false)}
                                    className="btn btn-ghost"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={handleExport}
                                    disabled={selectedCount === 0 || (!includeRegular && !includeGuest)}
                                    className="btn btn-primary gap-2"
                                >
                                    <Download size={18} />
                                    Export CSV
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }


            {
                unBlacklistModal && (
                    <div
                        className="modal modal-open backdrop-blur-md"
                        onClick={() => setUnBlacklistModal(false)}
                    >
                        <div
                            className="modal-box bg-gradient-to-r from-primary to-secondary shadow-lg rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-2xl font-semibold mb-6 text-white">Unblacklist Vehicle</h3>

                            <p className="text-gray-200 mb-4">
                                Are you sure you want to unblacklist vehicle{" "}
                                <span className="font-bold">{formData.plateNumber}</span>?
                            </p>

                            <label className="text-gray-200 font-semibold">Reason for unblacklist</label>
                            <textarea
                                className="textarea textarea-bordered w-full bg-white text-black my-4 resize-none"
                                placeholder="Enter reason"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                rows={4}
                            ></textarea>


                            <div className="modal-action">
                                <button
                                    onClick={() => setUnBlacklistModal(false)}
                                    className="btn btn-sm btn-ghost text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleUnblacklist(formData.id, formData.reason)}
                                    className="btn btn-error"
                                >
                                    Unblacklist Vehicle
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }

            {
                banVehicleModal && (
                    <div
                        className="modal modal-open backdrop-blur-md"
                        onClick={() => setBanVehicleModal(false)}
                    >
                        <div
                            className="modal-box bg-gradient-to-r from-primary to-secondary shadow-lg rounded-lg"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <h3 className="text-2xl font-semibold mb-6 text-white">Ban Vehicle</h3>

                            <p className="text-gray-200 mb-4">
                                Are you sure you want to ban vehicle{" "}
                                <span className="font-bold">{formData.plateNumber}</span>?
                            </p>

                            <p className="text-red-400 font-semibold mb-4 text-sm">
                                This vehicle will be banned permanently. This action cannot be undone.
                            </p>

                            <label className="text-gray-200 font-semibold">Reason for ban</label>
                            <textarea
                                className="textarea textarea-bordered w-full bg-white text-black my-4 resize-none"
                                placeholder="Enter reason"
                                value={formData.reason}
                                onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                rows={4}
                                maxLength={30}
                            ></textarea>


                            <div className="modal-action">
                                <button
                                    onClick={() => setBanVehicleModal(false)}
                                    className="btn btn-sm btn-ghost text-white"
                                >
                                    Cancel
                                </button>
                                <button
                                    onClick={() => handleBanVehicle(formData.id, formData.reason)}
                                    className="btn btn-error"
                                >
                                    Ban Vehicle
                                </button>
                            </div>
                        </div>
                    </div>
                )
            }
        </>
    );
};

export default BlacklistedVehicleList;
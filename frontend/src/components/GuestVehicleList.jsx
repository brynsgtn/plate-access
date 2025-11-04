import { useState, useEffect } from "react";
import { BadgePlusIcon, Search, ParkingCircleIcon, ParkingCircleOffIcon, CarFrontIcon, ArchiveIcon, Ban } from "lucide-react";
import LoadingSpinner from "./LoadingSpinner";
import { useUserStore } from "../stores/useUserStore";
import { useGuestVehicleStore } from "../stores/useGuestVehicleStore";
import Papa from "papaparse";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";



dayjs.extend(relativeTime);

const VEHICLES_PER_PAGE = 10;

const GuestVehicleList = () => {
    const [extendAccessModal, setExtendAccessModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [archiveModal, setArchiveModal] = useState(false);
    const [blacklistModal, setBlacklistModal] = useState(false);


    const [exportModal, setExportModal] = useState(false);

    const [exportColumns, setExportColumns] = useState({
        "Plate Number": true,
        "Make & Model": true,
        "Owner": true,
        "Status": true,
        "Added On": true,
    });



    const [formData, setFormData] = useState({
        id: "",
        plateNumber: "",
        makeModel: "",
        ownerName: "",
        reason: "",
    });

    useEffect(() => {
        console.log("Form Data:", formData);
        console.log("Search Data:", searchTerm);
    }, [formData, searchTerm]);

    const { user } = useUserStore();

    const {
        guestVehicles,
        loadingGuestVehicles,
        fetchGuestVehicles,
        blacklistOrUnblacklistGuestVehicle,
        extendGuestVehicleAccess,
        archiveUnarchiveGuestVehicle
    } = useGuestVehicleStore();


    useEffect(() => {
        fetchGuestVehicles();
    }, [fetchGuestVehicles]);

    const handleExtendAccess = (id) => {
        const vehicleToExtend = guestVehicles.find((v) => v._id === id);

        setFormData({
            id: vehicleToExtend._id,
            plateNumber: vehicleToExtend.plateNumber,
            makeModel: vehicleToExtend.makeModel,
            ownerName: vehicleToExtend.ownerName,
        });
        setExtendAccessModal(true);
    };

    const handleSubmitExtendAccess = () => {
        extendGuestVehicleAccess(formData.id);
        setFormData({
            id: "", plateNumber: "", makeModel: "", ownerName: "", reason: "",
        })
        setExtendAccessModal(false);
    }


    const handleArchive = (id) => {
        const vehicleToArchive = guestVehicles.find((v) => v._id === id);
        setFormData({
            id: vehicleToArchive._id,
            plateNumber: vehicleToArchive.plateNumber,
            makeModel: vehicleToArchive.makeModel,
            ownerName: vehicleToArchive.ownerName,
        });
        setArchiveModal(true);
    };

    const handleConfirmArchive = () => {
        archiveUnarchiveGuestVehicle(formData.id);
        setFormData({
            id: "", plateNumber: "", makeModel: "", ownerName: "", reason: "",
        })
        setArchiveModal(false);
    };


    const handleBlacklist = () => {
        blacklistOrUnblacklistGuestVehicle(formData.id, formData.reason);
        console.log("Blacklisting vehicle with ID:", formData.id);
        setFormData({
            id: "", plateNumber: "", makeModel: "", ownerName: "", reason: "",
        })
        setBlacklistModal(false);
    };

    const handleExportCSV = () => {
        try {
            // Filter by role
            let vehiclesToExport = guestVehicles;

            // Map only selected columns
            const data = vehiclesToExport.map(v => {
                const row = {};
                if (exportColumns["Plate Number"]) row["Plate Number"] = v.plateNumber;
                if (exportColumns["Make & Model"]) row["Make & Model"] = v.makeModel;
                if (exportColumns["Owner"]) row["Owner"] = v.ownerName;
                if (exportColumns["Status"]) row["Status"] = v.isBlacklisted ? "Blacklisted" : "Authorized";
                if (exportColumns["Added On"]) row["Added On"] = v.createdAt ? dayjs(v.createdAt).format("MMM D YYYY") : "-";
                return row;
            });

            const csv = Papa.unparse(data);

            const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const timestamp = dayjs().format("YYYY-MM-DD_HH-mm");
            link.setAttribute("href", URL.createObjectURL(blob));
            link.setAttribute("download", `Guest_Vehicles_${timestamp}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            setExportModal(false);
        } catch (error) {
            console.error("CSV export error:", error);
        }
    };



    // const handleSubmit = (e) => {
    //     e.preventDefault();

    //     if (user.isAdmin) {
    //         updateVehicle(formData.id, formData);
    //     } else {
    //         requestUpdateVehicle(formData.id, formData);
    //     }
    //     setEditModal(false);
    //     setFormData({
    //         id: "", plateNumber: "", makeModel: "", ownerName: "", reason: "",
    //     })
    // };

    const handleopenBlacklistModal = (id) => {
        const vehicleToBlacklist = guestVehicles.find((v) => v._id === id);
        setFormData({
            id: vehicleToBlacklist._id,
            plateNumber: vehicleToBlacklist.plateNumber,
            makeModel: vehicleToBlacklist.makeModel,
            ownerName: vehicleToBlacklist.ownerName,
        })
        setBlacklistModal(true);
    }

    // Sort and show only non-archived vehicles
    const guestVehicleList = guestVehicles.filter(vehicle => !vehicle.isArchived).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    // Filter vehicles by plate number
    const filteredVehicles = guestVehicleList.filter((vehicle) =>
        vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = filteredVehicles ? Math.ceil(filteredVehicles.length / VEHICLES_PER_PAGE) : 1;
    const paginatedVehicles = filteredVehicles
        ? filteredVehicles.slice((page - 1) * VEHICLES_PER_PAGE, page * VEHICLES_PER_PAGE)
        : [];

    const authorizedGuestVehicles = guestVehicleList.filter((vehicle) => (!vehicle.isBlacklisted && new Date(vehicle.validUntil) > new Date()));
    const blacklistedVehicles = guestVehicleList.filter((vehicle) => vehicle.isBlacklisted);
    const expiredGuestAccess = guestVehicleList.filter((vehicle) => new Date(vehicle.validUntil) < new Date());



    if (loadingGuestVehicles) {
        return (
            <div className="flex items-center justify-center py-10 h-96">
                <LoadingSpinner className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto max-w-6xl mx-auto mt-10  rounded-xl shadow-lg bg-base-100 border border-base-300 rounded-b-none">
                {/* Header with Search */}
                <div className="border-b border-base-300 bg-gradient-to-r from-primary to-secondary p-6 rounded-t-xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 ">
                        <h2 className="text-2xl font-bold text-white">Guest Vehicle List</h2>
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
                    <p className="text-white/80 mt-2">Vehicle details will be displayed here</p>
                    <div className="flex items-end justify-end gap-2 mt-2">
                        <button
                            onClick={() => setExportModal(true)}
                            className="btn btn-sm btn-accent text-white"
                        >
                            Export CSV
                        </button>
                    </div>
                </div>


                {/* Stats */}
                <div className="stats stats-vertical md:stats-horizontal w-full bg-base-100 border-base-300">

                    <div className="stat">
                        <div className="stat-figure text-warning">
                            <CarFrontIcon className="h-8 w-8" />
                        </div>
                        <div className="stat-title">Guest Vehicles</div>
                        <div className="stat-value text-warning">
                            {guestVehicleList.length}
                        </div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-warning">
                            <ParkingCircleIcon className="h-8 w-8" />
                        </div>
                        <div className="stat-title">Authorized Guests</div>
                        <div className="stat-value text-warning">
                            {authorizedGuestVehicles.length}
                        </div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <ParkingCircleOffIcon className="h-8 w-8" />
                        </div>
                        <div className="stat-title">Blacklisted Guest</div>
                        <div className="stat-value text-primary">
                            {blacklistedVehicles.length}
                        </div>
                    </div>


                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <ParkingCircleOffIcon className="h-8 w-8" />
                        </div>
                        <div className="stat-title">Expired Access</div>
                        <div className="stat-value text-primary">
                            {expiredGuestAccess.length}
                        </div>
                    </div>
                </div>
            </div>
            <div className="overflow-x-auto max-w-6xl mx-auto  mb-20 rounded-xl shadow-lg bg-base-100 border border-base-300 border-t-0 rounded-t-none">

                {/* Vehicle Table */}
                <table className="table table-zebra w-full">
                    <thead className="bg-base-200">
                        <tr>
                            <th className="text-base font-semibold text-base-content">#</th>
                            <th className="text-base font-semibold text-base-content">Plate Number</th>
                            <th className="text-base font-semibold text-base-content">Make & Model</th>
                            <th className="text-base font-semibold text-base-content">Owner</th>
                            <th className="text-base font-semibold text-base-content">Access</th>
                            <th className="text-base font-semibold text-base-content">Added On</th>
                            {user.role !== "itAdmin" && <th className="text-base font-semibold text-base-content">Actions</th>}
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedVehicles.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-base-content/70">
                                    No vehicles found.
                                </td>
                            </tr>
                        ) : (
                            paginatedVehicles.map((vehicle, idx) => (
                                <tr key={vehicle._id} className="hover:bg-base-200 transition">
                                    <th className="py-4">{idx + 1}</th>
                                    <td className="py-4">{vehicle.plateNumber}</td>
                                    <td className="py-4">{vehicle.makeModel}</td>
                                    <td className="py-4">{vehicle.ownerName}</td>
                                    <td className="py-4">
                                        {/* Status badge */}
                                        {vehicle.isBanned ? (
                                            <div>
                                                <span className="inline-flex items-center justify-center gap-1 px-2 py-1 rounded-md text-xs font-semibold 
                                                    text-error border border-error shadow-sm w-24 bg-error/30">
                                                    <Ban className="h-4 w-4" />
                                                    Banned
                                                </span>
                                            </div>
                                        ) : vehicle.isBlacklisted ? (
                                            <div>   
                                                {/* {user.isAdmin ? (
                                                    <button
                                                        onClick={() => handleUnblacklist(vehicle._id)}
                                                        className="btn btn-xs btn-outline btn-error gap-1"
                                                    >
                                                        Blacklisted
                                                    </button>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold 
                                            text-error border border-error shadow-sm">
                                                        Blacklisted
                                                    </span>
                                                )
                                                } */}

                                                <span className="inline-flex items-center justify-center gap-1 px-2 py-1 rounded-md text-xs font-semibold 
                                                    text-error border border-error shadow-sm w-24">
                                                    Blacklisted
                                                </span>

                                            </div>

                                        ) :
                                            (new Date(vehicle.validUntil) < new Date() ? (
                                                <>
                                                    {/* <div className="tooltip" data-tip="Guest access expired, blacklist this vehicle">
                                                    <button
                                                        onClick={() => handleopenBlacklistModal(vehicle._id)}
                                                        className="btn btn-xs btn-outline btn-warning gap-1"
                                                    >
                                                        Expired
                                                    </button>
                                                </div> */}


                                                    <span className="inline-flex items-center justify-center gap-1 px-2 py-1 rounded-md text-xs font-semibold 
                                                        text-warning border border-warning shadow-sm w-24">
                                                        Expired
                                                    </span>
                                                </>


                                            ) : (
                                                <>
                                                    {/* <div className="tooltip" data-tip="Blacklist this guest vehicle">
                                                    <button
                                                        onClick={() => handleopenBlacklistModal(vehicle._id)}
                                                        className="btn btn-xs btn-outline btn-success gap-1"
                                                    >
                                                        Authorized
                                                    </button>
                                                </div> */}

                                                    <span className="inline-flex items-center justify-center gap-1 px-2 py-1 rounded-md text-xs font-semibold 
                                                        text-success border border-success shadow-sm w-24">
                                                        Authorized
                                                    </span>

                                                </>

                                            ))
                                        }
                                    </td>
                                    <td>
                                        {vehicle.createdAt
                                            ? dayjs(vehicle.createdAt).fromNow() : '-'}
                                    </td>
                                    {user.role !== "itAdmin" && (
                                        <td className="py-4">
                                            <button
                                                onClick={() => handleExtendAccess(vehicle._id)}
                                                className={`btn btn-xs btn-ghost text-primary bg-transparent hover:bg-transparent border-none tooltip ${vehicle.isBanned || vehicle.isBlacklisted ? 'cursor-not-allowed opacity-50' : ''}`}
                                                data-tip="Extend access"
                                                title="Edit"
                                            >
                                                <BadgePlusIcon className="h-4 w-4" />
                                            </button>
                                            <button
                                                onClick={() => handleopenBlacklistModal(vehicle._id)}
                                                className={`btn btn-xs btn-ghost text-error ${vehicle.isBlacklisted ? 'cursor-not-allowed opacity-50' : ''}`}
                                                title="Blacklist"
                                            >
                                                <ParkingCircleOffIcon className="h-4 w-4" />
                                            </button>
                                            {user.role === "admin" && (
                                                <button
                                                    onClick={() => handleArchive(vehicle._id)}
                                                    className="btn btn-xs btn-ghost text-red-500 hover:text-red-700 bg-transparent hover:bg-transparent border-none"
                                                    title="Archive"
                                                >
                                                    <ArchiveIcon className="h-4 w-4" />
                                                </button>)}
                                        </td>)}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            <div>
                {/* Pagination */}
                {totalPages > 1 && (
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
                )}
            </div>

            {/* Extend Access Modal */}
            {extendAccessModal && (
                <div
                    className="modal modal-open backdrop-blur-md"
                    onClick={() => setExtendAccessModal(false)}
                >
                    <div
                        className="modal-box bg-gradient-to-r from-primary to-secondary shadow-lg rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-2xl font-semibold mb-6 text-white">Extend Guest Vehicle Access</h3>

                        <p className="text-gray-200 mb-4">
                            Are you sure you want to extend access of guest vehicle{" "}
                            <span className="font-bold">{formData.plateNumber}</span> for 1 day?
                        </p>

                        <div className="modal-action">
                            <button
                                onClick={() => setExtendAccessModal(false)}
                                className="btn btn-sm btn-ghost text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSubmitExtendAccess}
                                className="btn btn-accent btn-sm text-white"
                            >
                                Extend Guest Vehicle
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {archiveModal && (
                <div
                    className="modal modal-open backdrop-blur-md"
                    onClick={() => setArchiveModal(false)}
                >
                    <div
                        className="modal-box bg-gradient-to-r from-primary to-secondary shadow-lg rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-2xl font-semibold mb-6 text-white">Archive Vehicle</h3>

                        <p className="text-gray-200 mb-4">
                            Are you sure you want to archive vehicle{" "}
                            <span className="font-bold">{formData.plateNumber}</span>?
                        </p>

                        <div className="modal-action">
                            <button
                                onClick={() => setArchiveModal(false)}
                                className="btn btn-sm btn-ghost text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmArchive}
                                className="btn btn-error"
                            >
                                Archive Vehicle
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {blacklistModal && (
                <div
                    className="modal modal-open backdrop-blur-md"
                    onClick={() => setBlacklistModal(false)}
                >
                    <div
                        className="modal-box bg-gradient-to-r from-primary to-secondary shadow-lg rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-2xl font-semibold mb-6 text-white">Blacklist Guest Vehicle</h3>

                        <p className="text-gray-200 mb-4">
                            Are you sure you want to blacklist guest vehicle{" "}
                            <span className="font-bold">{formData.plateNumber}</span>?
                        </p>


                        <label className="text-gray-200 font-semibold">Reason for blacklist</label>
                        <textarea
                            className="textarea textarea-bordered w-full bg-white text-black my-4 resize-none"
                            placeholder="Enter reason"
                            value={formData.reason}
                            onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                            rows={4}
                        ></textarea>

                        <div className="modal-action">
                            <button
                                onClick={() => setBlacklistModal(false)}
                                className="btn btn-sm btn-ghost text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleBlacklist}
                                className="btn btn-error"
                            >
                                Blacklist Guest Vehicle
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {exportModal && (
                <div
                    className="modal modal-open backdrop-blur-sm bg-black/40"
                    onClick={() => setExportModal(false)}
                >
                    <div
                        className="modal-box max-w-md w-full bg-base-100 p-6 rounded-xl shadow-xl transform scale-100 transition-transform duration-200"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-2xl font-bold mb-4 text-center text-primary">Export Guest Vehicles</h3>

                        <p className="text-sm text-gray-500 mb-4 text-center">
                            Select the columns you want to include in your CSV export.
                        </p>

                        <div className="flex flex-col gap-3 mb-6">
                            {Object.keys(exportColumns).map((col) => (
                                <label
                                    key={col}
                                    className="flex items-center gap-3 cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        className="checkbox checkbox-primary"
                                        checked={exportColumns[col]}
                                        onChange={() =>
                                            setExportColumns({
                                                ...exportColumns,
                                                [col]: !exportColumns[col]
                                            })
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
}

export default GuestVehicleList
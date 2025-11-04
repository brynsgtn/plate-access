import { useState, useEffect } from "react";
import { Edit, Ban, Search, ParkingCircleIcon, ParkingCircleOffIcon, CarFrontIcon, PlusCircle, ArchiveIcon } from "lucide-react";
import { useVehicleStore } from "../stores/useVehicleStore";
import LoadingSpinner from "./LoadingSpinner";
import { useUserStore } from "../stores/useUserStore";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);


const VEHICLES_PER_PAGE = 10;

const VehicleList = () => {
    const [editModal, setEditModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [archiveModal, setArchiveModal] = useState(false);
    const [blacklistModal, setBlacklistModal] = useState(false);


    const [exportModal, setExportModal] = useState(false);

    // Columns for CSV export
    const [exportColumns, setExportColumns] = useState({
        "Plate Number": true,
        "Make & Model": true,
        "Owner": true,
        "Status": true,
        "Branch": true,
        "Added On": true,
    });



    const [formData, setFormData] = useState({
        id: "",
        plateNumber: "",
        makeModel: "",
        ownerName: "",
        branch: "",
        reason: "",
    });

    useEffect(() => {
        console.log("Form Data:", formData);
        console.log("Search Data:", searchTerm);
    }, [formData, searchTerm]);

    const {
        vehicles,
        loadingVehicles,
        updateVehicle,
        archiveUnarchiveVehicle,
        blacklistOrUnblacklistVehicle,
        requestUpdateVehicle,
        viewVehicles
    } = useVehicleStore();
    const { user } = useUserStore();

    useEffect(() => {
        viewVehicles();
    }, [viewVehicles]);


    const currentUserBranch = user.branch;

    const handleEdit = (id) => {
        const vehicleToEdit = vehicles.find((v) => v._id === id);
        setFormData({
            id: vehicleToEdit._id,
            plateNumber: vehicleToEdit.plateNumber,
            makeModel: vehicleToEdit.makeModel,
            ownerName: vehicleToEdit.ownerName,
            branch: vehicleToEdit.branch || "Main Branch"
        });
        setEditModal(true);
    };

    const handleArchive = (id) => {
        const ve = vehicles.find((v) => v?._id === id);
        setFormData({
            id: ve._id,
            plateNumber: ve.plateNumber,
            makeModel: ve.makeModel,
            ownerName: ve.ownerName,
            branch: ve.branch
        });
        setArchiveModal(true);
    };

    const handleConfirmArchive = () => {
        if (user.role === "admin") {
            archiveUnarchiveVehicle(formData.id);
        }
        setFormData({
            id: "", plateNumber: "", makeModel: "", ownerName: "", branch: "", reason: "",
        })
        setArchiveModal(false);
    };


    const handleBlacklist = () => {
        blacklistOrUnblacklistVehicle(formData.id, formData.reason);
        console.log("Blacklisting vehicle with ID:", formData.id);
        setFormData({
            id: "", plateNumber: "", makeModel: "", ownerName: "", branch: "", reason: "",
        })
        setBlacklistModal(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (user.role === "admin") {
            updateVehicle(formData.id, formData);
        } else {
            requestUpdateVehicle(formData.id, formData);
        }
        setEditModal(false);
        setFormData({
            id: "", plateNumber: "", makeModel: "", ownerName: "", branch: "", reason: "",
        })
    };

    const handleopenBlacklistModal = (id) => {
        const vehicleToBlacklist = vehicles.find((v) => v._id === id);
        setFormData({
            id: vehicleToBlacklist._id,
            plateNumber: vehicleToBlacklist.plateNumber,
            makeModel: vehicleToBlacklist.makeModel,
            ownerName: vehicleToBlacklist.ownerName,
            branch: vehicleToBlacklist.branch
        })
        setBlacklistModal(true);
    }


    const handleExportCSV = () => {
        // Filter based on parking staff branch
        const exportData = vehicleList
            .filter(v => user.role === "parkingStaff" ? v.branch === currentUserBranch : true)
            .map(v => {
                const row = {};
                if (exportColumns["Plate Number"]) row["Plate Number"] = v.plateNumber;
                if (exportColumns["Make & Model"]) row["Make & Model"] = v.makeModel;
                if (exportColumns["Owner"]) row["Owner"] = v.ownerName;
                if (exportColumns["Status"]) row["Status"] = v.isBlacklisted ? "Blacklisted" : "Authorized";
                if (exportColumns["Branch"]) row["Branch"] = v.branch || "-";
                if (exportColumns["Added On"]) row["Added On"] = v.createdAt ? dayjs(v.createdAt).format("MMM D YYYY") : "-";
                return row;
            });

        if (exportData.length === 0) {
            alert("No data to export.");
            return;
        }

        const csvContent = [
            Object.keys(exportData[0]).join(","), // header
            ...exportData.map(row => Object.values(row).join(",")) // rows
        ].join("\n");

        const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        const timestamp = dayjs().format("MMM-DD-YYYY");
        link.href = url;
        link.setAttribute("download", `registered_vehicles_${timestamp}.csv`);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        setExportModal(false);
    };


    const vehicleList = vehicles
        .filter(vehicle => {
            // Only show approved vehicles and not archived
            if (!vehicle?.isApproved || vehicle?.isArchived) return false;

            // If the user is parkingStaff, only show their branch
            if (user.role === "parkingStaff") {
                return vehicle?.branch === currentUserBranch;
            }

            // Admin can see all
            return true;
        })
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));


    // Filter vehicles by plate number
    const filteredVehicles = vehicleList.filter((vehicle) =>
        vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = filteredVehicles ? Math.ceil(filteredVehicles.length / VEHICLES_PER_PAGE) : 1;
    const paginatedVehicles = filteredVehicles
        ? filteredVehicles.slice((page - 1) * VEHICLES_PER_PAGE, page * VEHICLES_PER_PAGE)
        : [];

    const approvedVehicles = vehicleList.filter((vehicle) => (vehicle.isApproved && !vehicle.isBlacklisted));
    const blacklistedVehicles = vehicleList.filter((vehicle) => vehicle.isBlacklisted);





    if (loadingVehicles) {
        return (
            <div className="flex items-center justify-center py-10 h-96">
                <LoadingSpinner className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <>
            {/* Header with Search */}
            <div className="overflow-x-auto max-w-6xl mx-auto mt-10  rounded-xl shadow-lg bg-base-100 border border-base-300 rounded-b-none">

                <div className="border-b border-base-300 bg-gradient-to-r from-primary to-secondary p-6 rounded-t-xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 ">
                        <h2 className="text-2xl font-bold text-white">Vehicle List</h2>
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
                            <CarFrontIcon className="h-8 w-8" />
                        </div>
                        <div className="stat-title">Total Vehicles</div>
                        <div className="stat-value text-warning">
                            {vehicleList.length}
                        </div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-warning">
                            <ParkingCircleIcon className="h-8 w-8" />
                        </div>
                        <div className="stat-title">Authorized Vehicles</div>
                        <div className="stat-value text-warning">
                            {approvedVehicles.length}
                        </div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-primary">
                            <ParkingCircleOffIcon className="h-8 w-8" />
                        </div>
                        <div className="stat-title">Blacklisted Vehicles</div>
                        <div className="stat-value text-primary">
                            {blacklistedVehicles.length}
                        </div>
                    </div>
                </div>

            </div>
            <div className="overflow-x-auto max-w-6xl mx-auto mb-10 rounded-xl rounded-t-none shadow-lg bg-base-100 border border-base-300 border-t-0">



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
                                            <span className="inline-flex items-center justify-center gap-1 px-3 py-1 text-xs font-semibold  rounded-md shadow-sm w-24 text-center text-error border border-error bg-error/30">
                                                <Ban className="h-4 w-4" />
                                                Banned
                                            </span>
                                        ) : vehicle.isBlacklisted ? (
                                            <span className="inline-flex items-center justify-center gap-1 px-3 py-1 text-xs font-semibold  text-error border border-error rounded-md shadow-sm w-24 text-center">
                                                Blacklisted
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center justify-center gap-1 px-3 py-1 text-xs font-semibold  text-success border border-success rounded-md shadow-sm w-24 text-center">
                                                Authorized
                                            </span>
                                        )}


                                        {/* {(vehicle.isBlacklisted ? (
                                            <div className="tooltip" data-tip='This vehicle is blacklisted'>
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold 
                                            text-error border border-error shadow-sm">
                                                    Blacklisted
                                                </span>
                                            </div>

                                        ) :
                                            <div className="tooltip" data-tip="Blacklist this vehicle">
                                                <button
                                                    onClick={() => handleopenBlacklistModal(vehicle._id)}
                                                    className="btn btn-xs btn-outline btn-success gap-1"
                                                >
                                                    Authorized
                                                </button>
                                            </div>
                                        )} */}
                                    </td>
                                    <td>{vehicle.branch ? vehicle.branch : '-'}</td>
                                    <td>
                                        {vehicle.createdAt
                                            ? dayjs(vehicle.createdAt).fromNow() : '-'}
                                    </td>
                                    {user.role !== "itAdmin" && <td className="flex">
                                        <button
                                            onClick={() => handleEdit(vehicle._id)}
                                            className={`btn btn-xs btn-ghost text-primary ${vehicle.isBanned || vehicle.isBlacklisted ? 'cursor-not-allowed opacity-50' : ''}`}
                                            title="Edit"
                                        >
                                            <Edit className="h-4 w-4" />
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
                                                className="btn btn-xs btn-ghost text-red-500 hover:text-red-700"
                                                title="Archive"
                                            >
                                                <ArchiveIcon className="h-4 w-4" />
                                            </button>)}
                                    </td>}
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

            {/* Edit Modal */}
            {editModal && (
                <div className="modal modal-open backdrop-blur-md"
                    onClick={() => setEditModal(false)}   // click outside closes modal
                >
                    <div className="modal-box bg-gradient-to-r from-primary to-secondary shadow-lg rounded-lg"
                        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                    >
                        <h3 className="text-2xl font-semibold mb-6 text-white">Edit Vehicle</h3>
                        <form onSubmit={handleSubmit} className='space-y-4'>
                            <div>
                                <label htmlFor='plateNumber' className='block text-sm font-medium text-gray-300'>
                                    Plate Number
                                </label>
                                <input
                                    type='text'
                                    id='plateNumber'
                                    name='plateNumber'
                                    value={formData.plateNumber}
                                    onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                                    className='mt-1 block w-full bg-base-200 text-base-content border border-gray-600 rounded-md shadow-sm py-2
						 px-3 focus:outline-none focus:ring-2
						focus:ring-accent focus:border-accent'
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor='makeModel' className='block text-sm font-medium text-gray-300'>
                                    Make & Model
                                </label>
                                <input
                                    type='text'
                                    id='makeModel'
                                    name='makeModel'
                                    value={formData.makeModel}
                                    onChange={(e) => setFormData({ ...formData, makeModel: e.target.value })}
                                    className='mt-1 block w-full bg-base-200 text-base-content border border-gray-600 rounded-md shadow-sm py-2
						 px-3 focus:outline-none focus:ring-2
						focus:ring-accent focus:border-accent'
                                    required
                                />
                            </div>
                            <div>
                                <label htmlFor='ownerName' className='block text-sm font-medium text-gray-300'>
                                    Owner's Name
                                </label>
                                <input
                                    type='text'
                                    id='ownerName'
                                    name='ownerName'
                                    value={formData.ownerName}
                                    onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                                    className='mt-1 block w-full bg-base-200 text-base-content border border-gray-600 rounded-md shadow-sm py-2
						 px-3 focus:outline-none focus:ring-2
						focus:ring-accent focus:border-accent'
                                    required
                                />
                            </div>

                            <div>
                                <label htmlFor='branch' className='block text-sm font-medium text-gray-300'>
                                    Branch
                                </label>
                                <select
                                    id='branch'
                                    name='branch'
                                    value={formData.branch}
                                    onChange={(e) => setFormData({ ...formData, branch: e.target.value })}
                                    className='mt-1 block w-full bg-base-200 text-base-content border border-gray-600 rounded-md shadow-sm py-2
                         px-3 focus:outline-none focus:ring-2
                         focus:ring-accent focus:border-accent'
                                    required
                                >
                                    <option value="Main Branch">Main Branch</option>
                                    <option value="North Branch">North Branch</option>
                                    <option value="South Branch">South Branch</option>
                                </select>
                            </div>

                            {user.role !== "admin" && (
                                <div>
                                    <label htmlFor='reason' className='block text-sm font-medium text-gray-300'>
                                        Reason
                                    </label>
                                    <textarea
                                        id='reason'
                                        name='reason'
                                        value={formData.reason}
                                        onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                        className='mt-1 block w-full bg-base-200 text-base-content border border-gray-600 rounded-md shadow-sm py-2
                         px-3 focus:outline-none focus:ring-2
                         focus:ring-accent focus:border-accent'
                                        placeholder="Reason for editing the vehicle"
                                    />
                                </div>
                            )}

                            <button
                                type='submit'
                                className='w-full flex justify-center py-2 px-4 mt-8 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-primary-content bg-accent hover:bg-warning cursor-pointer
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50'
                                disabled={loadingVehicles}
                            >
                                {loadingVehicles ? (
                                    <>
                                        <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        <PlusCircle className='mr-2 h-5 w-5' />
                                        Edit Vehicle
                                    </>
                                )}
                            </button>
                        </form>
                        <div className="modal-action">
                            <button
                                onClick={() => setEditModal(false)}
                                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 text-white"
                            >
                                ✕
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
                        <h3 className="text-2xl font-semibold mb-6 text-white">Blacklist Vehicle</h3>

                        <p className="text-gray-200 mb-4">
                            Are you sure you want to blacklist vehicle{" "}
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
                                Blacklist Vehicle
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
                        <h3 className="text-2xl font-bold mb-4 text-center text-primary">Export Vehicles</h3>
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
export default VehicleList;
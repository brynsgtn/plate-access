import { useState, useEffect } from "react";
import { Edit, Trash2, Search, ParkingCircleIcon, ParkingCircleOffIcon, CarFrontIcon, PlusCircle } from "lucide-react";
import { useVehicleStore } from "../stores/useVehicleStore";
import LoadingSpinner from "./LoadingSpinner";
import { useUserStore } from "../stores/useUserStore";
import { set } from "mongoose";

const VEHICLES_PER_PAGE = 10;

const VehicleList = () => {
    const [editModal, setEditModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [deleteModal, setDeleteModal] = useState(false);
    const [blacklistModal, setBlacklistModal] = useState(false);
    const [deleteReason, setDeleteReason] = useState("");


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

    const {
        vehicles,
        loadingVehicles,
        updateVehicle,
        deleteVehicle,
        blacklistOrUnblacklistVehicle,
        requestUpdateVehicle,
        requestDeleteVehicle,
        viewVehicles
    } = useVehicleStore();
    const { user } = useUserStore();

    useEffect(() => {
        viewVehicles();
    }, [viewVehicles]);

    const handleEdit = (id) => {
        const vehicleToEdit = vehicles.find((v) => v._id === id);
        setFormData({
            id: vehicleToEdit._id,
            plateNumber: vehicleToEdit.plateNumber,
            makeModel: vehicleToEdit.makeModel,
            ownerName: vehicleToEdit.ownerName,
        });
        setEditModal(true);
    };

    const handleDelete = (id) => {
        const vehicleToDelete = vehicles.find((v) => v._id === id);
        setFormData({
            id: vehicleToDelete._id,
            plateNumber: vehicleToDelete.plateNumber,
            makeModel: vehicleToDelete.makeModel,
            ownerName: vehicleToDelete.ownerName,
        });
        setDeleteReason("");
        setDeleteModal(true);
    };

    const handleConfirmDelete = () => {
        if (user.isAdmin) {
            deleteVehicle(formData.id);
        } else {
            requestDeleteVehicle(formData.id, deleteReason);
        }
        setFormData({
            id: "", plateNumber: "", makeModel: "", ownerName: "", reason: "",
        })
        setDeleteModal(false);
    };


    const handleBlacklist = () => {
        blacklistOrUnblacklistVehicle(formData.id);
        console.log("Blacklisting vehicle with ID:", formData.id);
        setFormData({
            id: "", plateNumber: "", makeModel: "", ownerName: "", reason: "",
        })
        setBlacklistModal(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (user.isAdmin) {
            updateVehicle(formData.id, formData);
        } else {
            requestUpdateVehicle(formData.id, formData);
        }
        setEditModal(false);
        setFormData({
            id: "", plateNumber: "", makeModel: "", ownerName: "", reason: "",
        })
    };

    const handleopenBlacklistModal = (id) => {
        const vehicleToBlacklist = vehicles.find((v) => v._id === id);
        setFormData({
            id: vehicleToBlacklist._id,
            plateNumber: vehicleToBlacklist.plateNumber,
            makeModel: vehicleToBlacklist.makeModel,
            ownerName: vehicleToBlacklist.ownerName,
        })
        setBlacklistModal(true);
    }


    const vehicleList = vehicles.filter((vehicle) => vehicle.isApproved);
    // Filter vehicles by plate number
    const filteredVehicles = vehicleList.filter((vehicle) =>
        vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = filteredVehicles ? Math.ceil(filteredVehicles.length / VEHICLES_PER_PAGE) : 1;
    const paginatedVehicles = filteredVehicles
        ? filteredVehicles.slice((page - 1) * VEHICLES_PER_PAGE, page * VEHICLES_PER_PAGE)
        : [];

    const approvedVehicles = vehicles.filter((vehicle) => (vehicle.isApproved && !vehicle.isBlacklisted));
    const blacklistedVehicles = vehicles.filter((vehicle) => vehicle.isBlacklisted);


    if (loadingVehicles) {
        return (
            <div className="flex items-center justify-center py-10 h-96">
                <LoadingSpinner className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto max-w-6xl mx-auto mt-10 mb-20 rounded-xl shadow-lg bg-base-100 border border-base-300">
                {/* Header with Search */}
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
                </div>


                {/* Stats */}
                <div className="stats w-full bg-base-100  border-base-300">

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

                {/* Vehicle Table */}
                <table className="table table-zebra w-full">
                    <thead className="bg-base-200">
                        <tr>
                            <th className="text-base font-semibold text-base-content">#</th>
                            <th className="text-base font-semibold text-base-content">Plate Number</th>
                            <th className="text-base font-semibold text-base-content">Make & Model</th>
                            <th className="text-base font-semibold text-base-content">Owner</th>
                            <th className="text-base font-semibold text-base-content">Status</th>
                            <th className="text-base font-semibold text-base-content">Created At</th>
                            <th className="text-base font-semibold text-base-content">Actions</th>
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
                                        {(vehicle.isBlacklisted ? (
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
                                        )}
                                    </td>
                                    <td>
                                        {vehicle.createdAt
                                            ? new Date(vehicle.createdAt).toLocaleDateString('en-US', {
                                                year: 'numeric',
                                                month: 'short',
                                                day: 'numeric',
                                            }) : '-'}
                                    </td>
                                    <td className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(vehicle._id)}
                                            className="btn btn-xs btn-ghost text-primary"
                                            title="Edit"
                                        >
                                            <Edit className="h-4 w-4" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(vehicle._id)}
                                            className="btn btn-xs btn-ghost text-red-500 hover:text-red-700"
                                            title="Delete"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </td>
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

            {deleteModal && (
                <div
                    className="modal modal-open backdrop-blur-md"
                    onClick={() => setDeleteModal(false)}
                >
                    <div
                        className="modal-box bg-gradient-to-r from-primary to-secondary shadow-lg rounded-lg"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <h3 className="text-2xl font-semibold mb-6 text-white">Delete Vehicle</h3>

                        <p className="text-gray-200 mb-4">
                            Are you sure you want to delete vehicle{" "}
                            <span className="font-bold">{formData.plateNumber}</span>?
                        </p>

                        {/* Show reason if not admin */}
                        {!user.isAdmin && (
                            <div className="mt-4">
                                <textarea
                                    value={deleteReason}
                                    onChange={(e) => setDeleteReason(e.target.value)}
                                    rows="3"
                                    placeholder="Enter reason..."
                                    className="mt-1 block w-full bg-base-200 text-base-content border border-gray-600 rounded-md shadow-sm py-2 px-3"
                                    required
                                />
                            </div>
                        )}

                        <div className="modal-action">
                            <button
                                onClick={() => setDeleteModal(false)}
                                className="btn btn-sm btn-ghost text-white"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleConfirmDelete}
                                className="btn btn-error"
                            >
                                Request Delete
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
        </>
    );
};
export default VehicleList;
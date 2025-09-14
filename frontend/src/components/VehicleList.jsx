import { useState, useEffect } from "react";
import { Edit, Trash2, Search } from "lucide-react";
import { useVehicleStore } from "../stores/useVehicleStore";
import LoadingSpinner from "./LoadingSpinner";

const VEHICLES_PER_PAGE = 10;

const VehicleList = () => {
    const [editModal, setEditModal] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);

    const [formData, setFormData] = useState({
        id: "",
        plateNumber: "",
        makeModel: "",
        ownerName: "",
    });

    useEffect(() => {
        console.log("Form Data:", formData);
        console.log("Search Data:", searchTerm);
    }, [formData, searchTerm]);

    const { vehicles, loadingVehicles, updateVehicle, deleteVehicle, blacklistOrUnblacklistVehicle } = useVehicleStore();

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
        deleteVehicle(id);
    };

    const handleBlacklist = (id) => {
        blacklistOrUnblacklistVehicle(id);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        updateVehicle(formData.id, formData);
        setEditModal(false);
    };



    // Filter vehicles by plate number
    const filteredVehicles = vehicles.filter((vehicle) =>
        vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const totalPages = filteredVehicles ? Math.ceil(filteredVehicles.length / VEHICLES_PER_PAGE) : 1;
    const paginatedVehicles = filteredVehicles
        ? filteredVehicles.slice((page - 1) * VEHICLES_PER_PAGE, page * VEHICLES_PER_PAGE)
        : [];


    if (loadingVehicles) {
        return (
            <div className="flex items-center justify-center py-10 h-96">
                <LoadingSpinner className="h-8 w-8 animate-spin" />
            </div>
        );
    }

    return (
        <>
            <div className="overflow-x-auto max-w-6xl mx-auto my-10 rounded-xl shadow-lg bg-base-100 border border-base-300">
                {/* Header with Search */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-b border-base-300">
                    <h2 className="text-xl font-bold text-primary">Vehicle List</h2>

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

                {/* Vehicle Table */}
                <table className="table table-zebra w-full">
                    <thead className="bg-base-200">
                        <tr>
                            <th>#</th>
                            <th>Plate Number</th>
                            <th>Make & Model</th>
                            <th>Owner</th>
                            <th>Status</th>
                            <th>Created At</th>
                            <th>Actions</th>
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
                                    <th>{idx + 1}</th>
                                    <td>{vehicle.plateNumber}</td>
                                    <td>{vehicle.makeModel}</td>
                                    <td>{vehicle.ownerName}</td>
                                    <td>
                                        {vehicle.isBlacklisted ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold 
                                            bg-error text-error-content border border-error shadow-sm">
                                                Blacklisted
                                            </span>
                                        ) : (
                                            <div className="tooltip" data-tip="Blacklist this vehicle">
                                                <button
                                                    onClick={() => handleBlacklist(vehicle._id)}
                                                    className="btn btn-xs btn-outline btn-success gap-1"
                                                >
                                                    Authorized
                                                </button>
                                            </div>
                                        )}
                                    </td>
                                    <td>
                                        {vehicle.createdAt
                                            ? new Date(vehicle.createdAt).toLocaleDateString()
                                            : "-"}
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
                    <div className="modal-box bg-primary shadow-lg rounded-lg"
                        onClick={(e) => e.stopPropagation()} // prevent closing when clicking inside
                    >
                        <h3 className="text-2xl font-semibold mb-6 text-primary-content">Edit Vehicle</h3>
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
                            <button
                                type='submit'
                                className='w-full flex justify-center py-2 px-4 mt-8 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-primary-content bg-accent hover:bg-warning cursor-pointer
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50'
                                disabled={loading}
                            >
                                {loading ? (
                                    <>
                                        <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                                        Loading...
                                    </>
                                ) : (
                                    <>
                                        <PlusCircle className='mr-2 h-5 w-5' />
                                        Add Vehicle
                                    </>
                                )}
                            </button>
                        </form>
                        <div className="modal-action">
                            <button
                                onClick={() => setEditModal(false)}
                                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2 "
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div>
            )}

        </>

    );
};
export default VehicleList;
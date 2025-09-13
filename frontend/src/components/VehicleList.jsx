import { useState } from "react";
import { Edit, Trash2, ShieldBan, PlusCircle, Loader } from "lucide-react";

import { useVehicleStore } from "../stores/useVehicleStore";
import LoadingSpinner from "./LoadingSpinner";
import { useEffect } from "react";

const VehicleList = () => {

    const [editModal, setEditModal] = useState(false);

    const [formData, setFormData] = useState({
        id: "",
        plateNumber: "",
        makeModel: "",
        ownerName: "",
    });

    useEffect(() => {
        console.log("Form Data:", formData);
    }, [formData]);

    const { vehicles, loadingVehicles, updateVehicle, deleteVehicle } = useVehicleStore();

    const handleEdit = (id) => {
        // Implement edit logic here
        const vehicleToEdit = vehicles.find((v) => v._id === id);
        setFormData({
            id: vehicleToEdit._id,
            plateNumber: vehicleToEdit.plateNumber,
            makeModel: vehicleToEdit.makeModel,
            ownerName: vehicleToEdit.ownerName,
        });
        setEditModal(true);
        console.log(`Edit vehicle with id: ${id}`);
    };

    const handleDelete = (id) => {
        // Implement delete logic here
        deleteVehicle(id);
        console.log(`Delete vehicle with id: ${id}`);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement form submission logic here
        updateVehicle(formData.id, formData);
        console.log("Updated data:", formData);
        setEditModal(false);
    };

    const loading = false;

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
                        {vehicles.length === 0 && (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-base-content/70">
                                    No vehicles found.
                                </td>
                            </tr>
                        )}
                        {vehicles.map((vehicle, idx) => (
                            <tr key={vehicle._id} className="hover:bg-base-200 transition">
                                <th>{idx + 1}</th>
                                <td>{vehicle.plateNumber}</td>
                                <td>{vehicle.makeModel}</td>
                                <td>{vehicle.ownerName}</td>
                                <td>
                                    <span
                                        className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-semibold
                    ${vehicle.isBlacklisted
                                                ? "bg-error text-error-content border border-error"
                                                : vehicle.isApproved
                                                    ? "bg-success text-success-content border border-success"
                                                    : "bg-warning text-warning-content border border-warning"
                                            }`}
                                    >
                                        {vehicle.isBlacklisted ? (
                                            <>
                                                <ShieldBan className="h-4 w-4" /> Blacklisted
                                            </>
                                        ) : vehicle.isApproved ? (
                                            "Approved"
                                        ) : (
                                            "Pending"
                                        )}
                                    </span>
                                </td>
                                <td>
                                    {vehicle.createdAt
                                        ? new Date(vehicle.createdAt).toLocaleDateString()
                                        : "-"}
                                </td>
                                <td className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            handleEdit(vehicle._id);
                                        }}
                                        className="btn btn-xs btn-ghost text-primary hover:bg-primary/10"
                                        title="Edit"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(vehicle._id)}
                                        className="btn btn-xs btn-ghost text-red-500 hover:bg-red-100 hover:text-red-700"
                                        title="Delete"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
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
                                className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                            >
                                ✕
                            </button>
                        </div>
                    </div>
                </div >
            )}

        </>

    );
};
export default VehicleList;
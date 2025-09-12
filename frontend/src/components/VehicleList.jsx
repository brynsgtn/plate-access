import { useState } from "react";
import { Edit, Trash2, ShieldBan, PlusCircle, Loader } from "lucide-react";

// Mock vehicle data
const mockVehicles = [
    {
        id: "1",
        plateNumber: "ABC1234",
        makeModel: "Toyota Corolla",
        ownerName: "John Doe",
        isBlacklisted: false,
        isApproved: true,
        updateRequest: {
            requestedBy: "staff1",
            requestedAt: "2024-09-05T09:30:00Z",
            approvedOrDeclinedAt: "2024-09-06T14:00:00Z",
            reason: "Update owner name spelling",
            status: "approved"
        },
        deleteRequest: null,
        createdAt: "2024-09-01T10:00:00Z"
    },
    {
        id: "2",
        plateNumber: "XYZ5678",
        makeModel: "Honda Civic",
        ownerName: "Jane Smith",
        isBlacklisted: false,
        isApproved: false,
        updateRequest: {
            requestedBy: "staff2",
            requestedAt: "2024-09-08T11:20:00Z",
            approvedOrDeclinedAt: null,
            reason: "Change color info",
            status: "pending"
        },
        deleteRequest: null,
        createdAt: "2024-09-05T14:30:00Z"
    },
    {
        id: "3",
        plateNumber: "LMN2468",
        makeModel: "Ford Explorer",
        ownerName: "Robert Brown",
        isBlacklisted: true,
        isApproved: true,
        updateRequest: null,
        deleteRequest: {
            requestedBy: "staff3",
            approvedOrDeclinedAt: null,
            reason: "Duplicate record",
            status: "pending"
        },
        createdAt: "2024-09-10T08:15:00Z"
    },
    {
        id: "4",
        plateNumber: "JKL1357",
        makeModel: "Nissan Altima",
        ownerName: "Alice Johnson",
        isBlacklisted: false,
        isApproved: true,
        updateRequest: null,
        deleteRequest: null,
        createdAt: "2024-09-12T12:45:00Z"
    },
    {
        id: "5",
        plateNumber: "PQR7890",
        makeModel: "Chevrolet Malibu",
        ownerName: "Michael Green",
        isBlacklisted: false,
        isApproved: false,
        updateRequest: {
            requestedBy: "staff1",
            requestedAt: "2024-09-15T10:05:00Z",
            approvedOrDeclinedAt: null,
            reason: "Update plate format",
            status: "pending"
        },
        deleteRequest: null,
        createdAt: "2024-09-15T18:45:00Z"
    },
    {
        id: "6",
        plateNumber: "TUV4321",
        makeModel: "Hyundai Elantra",
        ownerName: "Emily Davis",
        isBlacklisted: false,
        isApproved: true,
        updateRequest: null,
        deleteRequest: null,
        createdAt: "2024-09-18T09:40:00Z"
    },
    {
        id: "7",
        plateNumber: "WXY6543",
        makeModel: "Kia Sorento",
        ownerName: "Daniel Martinez",
        isBlacklisted: false,
        isApproved: true,
        updateRequest: null,
        deleteRequest: {
            requestedBy: "staff4",
            approvedOrDeclinedAt: "2024-09-20T15:10:00Z",
            reason: "Owner requested removal",
            status: "approved"
        },
        createdAt: "2024-09-20T12:20:00Z"
    },
    {
        id: "8",
        plateNumber: "EFG1111",
        makeModel: "Mazda CX-5",
        ownerName: "Sophia Wilson",
        isBlacklisted: false,
        isApproved: false,
        updateRequest: {
            requestedBy: "staff2",
            requestedAt: "2024-09-22T13:50:00Z",
            approvedOrDeclinedAt: null,
            reason: "Update VIN number",
            status: "pending"
        },
        deleteRequest: null,
        createdAt: "2024-09-22T16:00:00Z"
    },
    {
        id: "9",
        plateNumber: "HIJ2222",
        makeModel: "Tesla Model 3",
        ownerName: "William Taylor",
        isBlacklisted: false,
        isApproved: true,
        updateRequest: null,
        deleteRequest: null,
        createdAt: "2024-09-25T09:10:00Z"
    },
    {
        id: "10",
        plateNumber: "OPQ3333",
        makeModel: "Jeep Wrangler",
        ownerName: "Olivia Harris",
        isBlacklisted: false,
        isApproved: false,
        updateRequest: null,
        deleteRequest: {
            requestedBy: "staff5",
            approvedOrDeclinedAt: null,
            reason: "Vehicle sold",
            status: "pending"
        },
        createdAt: "2024-09-28T16:55:00Z"
    }
];

const VehicleList = () => {
    const [vehicles, setVehicles] = useState(mockVehicles);

    const [editModal, setEditModal] = useState(false);

    const [formData, setFormData] = useState({
        plateNumber: "",
        makeModel: "",
        ownerName: "",
    });
    

    const handleEdit = (id) => {
        // Implement edit logic here
        const vehicleToEdit = vehicles.find((v) => v.id === id);
        setFormData({
            plateNumber: vehicleToEdit.plateNumber,
            makeModel: vehicleToEdit.makeModel,
            ownerName: vehicleToEdit.ownerName,
        });
        setEditModal(true);
        console.log(`Edit vehicle with id: ${id}`);
    };

    const handleDelete = (id) => {
        // Implement delete logic here
        setVehicles((prev) => prev.filter((v) => v.id !== id));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Implement form submission logic here
        console.log(formData);
    };

    const loading = false;

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
                            <tr key={vehicle.id} className="hover:bg-base-200 transition">
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
                                            handleEdit(vehicle.id);
                                        }}
                                        className="btn btn-xs btn-ghost text-primary hover:bg-primary/10"
                                        title="Edit"
                                    >
                                        <Edit className="h-4 w-4" />
                                    </button>

                                    <button
                                        onClick={() => handleDelete(vehicle.id)}
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
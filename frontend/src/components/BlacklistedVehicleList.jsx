import { useState } from "react";
import { ShieldBan, ShieldCheck } from "lucide-react";

// Mock data for demonstration
const mockVehicles = [
    {
        _id: "1",
        plateNumber: "ABC123",
        makeModel: "Toyota Corolla",
        ownerName: "John Doe",
        isBlacklisted: true,
        blacklistedAt: "2024-08-15T10:30:00Z"
    },
    {
        _id: "2",
        plateNumber: "XYZ789",
        makeModel: "Honda Civic",
        ownerName: "Jane Smith",
        isBlacklisted: false,
        blacklistedAt: null
    },
    {
        _id: "3",
        plateNumber: "LMN456",
        makeModel: "Ford Focus",
        ownerName: "Alice Johnson",
        isBlacklisted: true,
        blacklistedAt: "2024-09-01T14:20:00Z"
    }
];

const VehicleBlacklistTable = () => {
    const [vehicles, setVehicles] = useState(mockVehicles);

    const handleUnblacklist = (id) => {
        setVehicles((prev) =>
            prev.map((v) =>
                v._id === id ? { ...v, isBlacklisted: false, blacklistedAt: null } : v
            )
        );
    };

    return (
        <div className="overflow-x-auto max-w-6xl mx-auto my-10 rounded-xl shadow-lg bg-base-100 border border-base-300">
            <table className="table table-zebra w-full">
                <thead className="bg-base-200">
                    <tr>
                        <th className="text-base font-semibold text-base-content">#</th>
                        <th className="text-base font-semibold text-base-content">Plate Number</th>
                        <th className="text-base font-semibold text-base-content">Make & Model</th>
                        <th className="text-base font-semibold text-base-content">Owner</th>
                        <th className="text-base font-semibold text-base-content">Blacklisted Date</th>
                        <th className="text-base font-semibold text-base-content">Action</th>
                    </tr>
                </thead>
                <tbody>
                    {vehicles.length === 0 && (
                        <tr>
                            <td colSpan={6} className="text-center py-8 text-base-content/70">
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
                                {vehicle.blacklistedAt
                                    ? new Date(vehicle.blacklistedAt).toLocaleDateString()
                                    : "-"}
                            </td>
                            <td>
                                {vehicle.isBlacklisted ? (
                                    <button
                                        onClick={() => handleUnblacklist(vehicle._id)}
                                        className="btn btn-xs btn-success"
                                    >
                                        Unblacklist
                                    </button>
                                ) : (
                                    <span className="text-base-content/50 text-xs">—</span>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VehicleBlacklistTable;
import { useVehicleStore } from "../stores/useVehicleStore";


const VehicleBlacklistTable = () => {


    const { vehicles, blacklistOrUnblacklistVehicle } = useVehicleStore();
    const blacklistedVehicles = vehicles.filter((vehicle) => vehicle.isBlacklisted);
    
    const handleUnblacklist = (id) => {
        blacklistOrUnblacklistVehicle(id);
        console.log("Unblacklisting vehicle with ID:", id);
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
                    {blacklistedVehicles.length === 0 && (
                        <tr>
                            <td colSpan={6} className="text-center py-8 text-base-content/70">
                                No blacklisted vehicles found.
                            </td>
                        </tr>
                    )}
                    {blacklistedVehicles.map((vehicle, idx) => (
                        <tr key={vehicle._id} className="hover:bg-base-200 transition">
                            <th>{idx + 1}</th>
                            <td>{vehicle.plateNumber}</td>
                            <td>{vehicle.makeModel}</td>
                            <td>{vehicle.ownerName}</td>
                            <td>
                                {vehicle.isBlacklistedAt
                                    ? new Date(vehicle.isBlacklistedAt).toLocaleDateString()
                                    : "-"}
                            </td>
                            <td>
                                <button
                                    onClick={() => handleUnblacklist(vehicle._id)}
                                    className="btn btn-xs btn-success"
                                >
                                    Unblacklist
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default VehicleBlacklistTable;
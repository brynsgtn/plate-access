import { useState, useEffect } from "react";
import { useVehicleStore } from "../stores/useVehicleStore";
import { Search } from "lucide-react";

const VEHICLES_PER_PAGE = 2;

const VehicleBlacklistTable = () => {

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        console.log("Search Data:", searchTerm);
    }, [searchTerm]);

    const { vehicles, blacklistOrUnblacklistVehicle } = useVehicleStore();
    const blacklistedVehicles = vehicles.filter((vehicle) => vehicle.isBlacklisted);

     // Filter vehicles by plate number
    const filteredVehicles = blacklistedVehicles.filter((vehicle) =>
        vehicle.plateNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );


    const totalPages = filteredVehicles ? Math.ceil(filteredVehicles.length / VEHICLES_PER_PAGE) : 1;
    const paginatedVehicles = filteredVehicles
        ? filteredVehicles.slice((page - 1) * VEHICLES_PER_PAGE, page * VEHICLES_PER_PAGE)
        : [];

    const handleUnblacklist = (id) => {
        blacklistOrUnblacklistVehicle(id);
        console.log("Unblacklisting vehicle with ID:", id);
    };

    return (
        <>

            <div className="overflow-x-auto max-w-6xl mx-auto my-10 rounded-xl shadow-lg bg-base-100 border border-base-300">
                {/* Header with Search */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-4 border-b border-base-300">
                    <h2 className="text-xl font-bold text-primary">BlacklistVehicle List</h2>

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
                        {paginatedVehicles.length === 0 && (
                            <tr>
                                <td colSpan={6} className="text-center py-8 text-base-content/70">
                                    No blacklisted vehicles found.
                                </td>
                            </tr>
                        )}
                        {paginatedVehicles.map((vehicle, idx) => (
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
        </>
    );
};

export default VehicleBlacklistTable;
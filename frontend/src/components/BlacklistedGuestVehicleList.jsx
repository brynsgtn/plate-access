import { useState, useEffect } from "react";
import { useUserStore } from "../stores/useUserStore";
import { useVehicleStore } from "../stores/useVehicleStore";
import { useGuestVehicleStore } from "../stores/useGuestVehicleStore";
import { ParkingCircleOffIcon, Search } from "lucide-react";
import toast from "react-hot-toast";
import LoadingSpinner from "./LoadingSpinner";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const VEHICLES_PER_PAGE = 10;

const BlacklistedGuestVehicleList = () => {

    const [page, setPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        console.log("Search Data:", searchTerm);
    }, [searchTerm]);

    const { user } = useUserStore();
    const { loadingVehicles } = useVehicleStore();

    const { guestVehicles, blacklistOrUnblacklistGuestVehicle, fetchGuestVehicles } = useGuestVehicleStore();
    const blacklistedVehicles = guestVehicles.filter((vehicle) => vehicle.isBlacklisted);


    useEffect(() => {
        fetchGuestVehicles();
    }, [fetchGuestVehicles]);

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
            blacklistOrUnblacklistGuestVehicle(id)
        } else {
            toast.error("You are not authorized to unblacklist guest vehicles.");
        };
        console.log("Unblacklisting vehicle with ID:", id);
    }

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
                <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-t-xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4  ">
                        <h2 className="text-2xl font-bold text-white">Blacklisted Vehicle List</h2>
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
                    <p className="text-white/80 mt-2">Blacklisted vehicles will be displayed here</p>
                </div>

                {/* Stats */}
                <div className="stats w-full bg-base-100  border-base-300">

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
                <table className="table table-zebra w-full">
                    <thead className="bg-base-200">
                        <tr>
                            <th className="text-base font-semibold text-base-content">#</th>
                            <th className="text-base font-semibold text-base-content">Plate Number</th>
                            <th className="text-base font-semibold text-base-content">Make & Model</th>
                            <th className="text-base font-semibold text-base-content">Owner</th>
                            <th className="text-base font-semibold text-base-content">Blacklisted At</th>
                            {user.role === "admin" && <th className="text-base font-semibold text-base-content">Action</th>}
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
                                        ? dayjs(vehicle.isBlacklistedAt).fromNow()
                                        : "-"}
                                </td>
                                {user.role === "admin" && (
                                    <td>
                                        <button
                                            onClick={() => handleUnblacklist(vehicle._id)}
                                            className="btn btn-xs btn-success"
                                        >
                                            Unblacklist
                                        </button>
                                    </td>
                                )}
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

export default BlacklistedGuestVehicleList;
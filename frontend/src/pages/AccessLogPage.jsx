import { useEffect, useState } from "react";

import { useLogStore } from "../stores/useLogStore";
import { useUserStore } from "../stores/useUserStore";

import { Search, BadgeCheckIcon, BadgeXIcon } from "lucide-react";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);


const LOGS_PER_PAGE = 10;

const AccessLogPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all"); // all, guest, non-guest
    const [sortOrder, setSortOrder] = useState("newest");
    const [page, setPage] = useState(1);


    const { logs: accessLog, fetchLogs } = useLogStore();
    const { user } = useUserStore();

    const currentUser = user;

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs]);

    useEffect(() => {
        console.log("Search Data:", searchTerm);
    }, [searchTerm]);

    useEffect(() => {
        if (accessLog.length > 0) {
            console.log("Sample log:", accessLog[0]);
        }
    }, [accessLog]);

    const logs = [...accessLog]
        .filter(log => {
            // If parkingStaff, only show logs from their branch
            if (currentUser.role === "parkingStaff") {
                return log.branch === currentUser.branch;
            }

            // Admin and IT Admin can see all logs
            return true;
        })
        .sort((a, b) => {
            return sortOrder === "newest"
                ? new Date(b.timestamp) - new Date(a.timestamp)
                : new Date(a.timestamp) - new Date(b.timestamp);
        });



    // Filtering
    const filteredLogs = logs.filter((log) => {
        const term = searchTerm.toLowerCase().trim();

        // If search is empty, match all
        if (!term) {
            const matchesType =
                filterType === "all" ||
                (filterType === "guest" && log.isGuest) ||
                (filterType === "non-guest" && !log.isGuest);
            return matchesType;
        }

        // Convert fields safely
        const plate = log.plateNumber ? String(log.plateNumber).toLowerCase() : "";

        const matchesSearch = plate.includes(term);

        // Match type filter
        const matchesType =
            filterType === "all" ||
            (filterType === "guest" && log.isGuest) ||
            (filterType === "non-guest" && !log.isGuest);

        return matchesSearch && matchesType;
    });


    const totalPages = filteredLogs ? Math.ceil(filteredLogs.length / LOGS_PER_PAGE) : 1;
    const paginatedLogs = filteredLogs
        ? filteredLogs.slice((page - 1) * LOGS_PER_PAGE, page * LOGS_PER_PAGE)
        : [];

    const totalLogs = logs.length;
    const totalEntry = logs.filter((log) => log.gateType === "entrance" && log.success === true).length;
    const totalExit = logs.filter((log) => log.gateType === "exit" && log.success === true).length;
    const totalEntryFail = logs.filter((log) => log.success === false).length;
    return (
        <div className="min-h-screen relative overflow-hidden bg-base-100">
            <div className="relative z-10 container mx-auto px-4 pt-16 mb-10 max-w-6xl">
                <h1
                    className="text-4xl font-bold mb-8 text-primary text-center"
                >
                    Access Logs
                </h1>
                <p className="text-center text-base-content/70">
                    Manage your access logs efficiently with our comprehensive tools.
                </p>
            </div>

            <div className="container mx-auto max-w-6xl shadow-xl rounded-xl border border-base-300 overflow-hidden">

                {/* Header*/}
                <div className="border-b border-base-300 bg-gradient-to-r from-primary to-secondary p-6 rounded-t-xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 ">
                        <h2 className="text-2xl font-bold text-white">Logs Summary</h2>
                    </div>
                    <p className="text-white/80 mt-2">Logs statistics and summary</p>
                </div>

                <div className="stats stats-vertical lg:stats-horizontal  w-full">
                    <div className="stat p-6">
                        <div className="stat-title text-lg font-bold text-base-content/80">Total Logs</div>
                        <div className="stat-value text-primary">{totalLogs}</div>
                    </div>

                    <div className="stat p-6">

                        <div className="stat-title text-lg font-bold text-base-content/80">Entrance Logs</div>
                        <div className="stat-value text-error">{totalEntry}</div>
                    </div>

                    <div className="stat p-6">

                        <div className="stat-title text-lg font-bold text-base-content/80">Exit Logs</div>
                        <div className="stat-value text-accent">{totalExit}</div>
                    </div>

                    <div className="stat p-6">

                        <div className="stat-title text-lg font-bold text-base-content/80">Denied Logs</div>
                        <div className="stat-value text-accent">{totalEntryFail}</div>
                    </div>
                </div>
            </div>

            {/* Logs */}
            <div className="container mx-auto max-w-6xl shadow-xl rounded-xl border border-base-300 overflow-x-auto mt-10 mb-10">
                <div className="border-b border-base-300 bg-gradient-to-r from-primary to-secondary p-6 rounded-t-xl">
                    <div className="flex flex-col md:flex-row justify-between items-center gap-4 ">
                        <h2 className="text-2xl font-bold text-white">Logs</h2>
                    </div>
                    <p className="text-white/80 mt-2">Logs will be displayed here</p>
                </div>

                <div className="bg-base-100 p-4">
                    <p className="text-lg font-semibold text-base-content mb-3">Filter By:</p>
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        {/* Search Bar */}
                        <label className="input input-bordered flex items-center gap-2 w-full md:w-64">
                            <Search className="w-4 h-4 opacity-70" />
                            <input
                                type="text"
                                className="grow"
                                placeholder="Search by plate number"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </label>

                        {/* Guest / Non-Guest Filter */}
                        <select
                            className="select select-bordered w-full md:w-40"
                            value={filterType}
                            onChange={(e) => setFilterType(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="guest">Guest</option>
                            <option value="non-guest">Non-Guest</option>
                        </select>

                        {/* Sort by Date */}
                        <select
                            className="select select-bordered w-full md:w-40"
                            value={sortOrder}
                            onChange={(e) => setSortOrder(e.target.value)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>
                    </div>
                </div>
                {/* Vehicle Table */}
                <table className="table table-zebra w-full">
                    <thead className="bg-base-200">
                        <tr>
                            <th className="text-base font-semibold text-base-content">#</th>
                            <th className="text-base font-semibold text-base-content">Date</th>
                            <th className="text-base font-semibold text-base-content">Time</th>
                            <th className="text-base font-semibold text-base-content">Branch</th>
                            <th className="text-base font-semibold text-base-content">Gate</th>
                            <th className="text-base font-semibold text-base-content">Method</th>
                            <th className="text-base font-semibold text-base-content">Success</th>
                            <th className="text-base font-semibold text-base-content">Reason</th>
                            <th className="text-base font-semibold text-base-content">Type</th>
                            <th className="text-base font-semibold text-base-content">Plate Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedLogs.length === 0 ? (
                            <tr>
                                <td colSpan={7} className="text-center py-8 text-base-content/70">
                                    No logs found.
                                </td>
                            </tr>
                        ) : (
                            paginatedLogs.map((log, idx) => (
                                <tr key={log._id} className="hover:bg-base-200 transition">
                                    <th className="py-4">{idx + 1}</th>
                                    <td className="py-4">{dayjs(log.timestamp).format("MMM DD, YYYY")}</td>
                                    <td className="py-4">{dayjs(log.timestamp).format("h:mm A")}</td>
                                    <td className="py-4">{log.branch}</td>
                                    <td className="py-4">{log.gateType}</td>
                                    <td className="py-4">{log.method}</td>
                                    <td className="py-4 ">
                                        {/* Status badge */}
                                        {(log.success ? (
                                            <div>
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold 
                                            text-success border-none">
                                                    <BadgeCheckIcon className="w-5 h-5" />
                                                </span>
                                            </div>

                                        ) :
                                            <div>
                                                <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold 
                                            text-error border-none">
                                                    <BadgeXIcon className="w-5 h-5" />
                                                </span>
                                            </div>
                                        )}
                                    </td>
                                    <td className="max-w-[100px]">
                                        {log.notes ? (
                                            <div className="tooltip tooltip-left" data-tip={log.notes}>
                                                <div className="truncate cursor-help w-[100px]">
                                                    {log.notes}
                                                </div>
                                            </div>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td>
                                        {log.isGuest ? "Guest" : "Tenant"}
                                    </td>
                                    <td>
                                        {log.plateNumber}
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
                    <div className="flex justify-center my-10">
                        <div className="join">
                            {(() => {
                                const maxPagesToShow = 10;
                                const startPage =
                                    Math.floor((page - 1) / maxPagesToShow) * maxPagesToShow + 1;
                                const endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

                                return (
                                    <>
                                        {/* Prev Button */}
                                        <button
                                            className="join-item btn btn-square btn-outline hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => page > 1 && setPage(page - 1)}
                                            disabled={page === 1}
                                        >
                                            &lt;
                                        </button>

                                        {/* Page Number Buttons */}
                                        {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                                            const pageNumber = startPage + i;
                                            return (
                                                <button
                                                    key={pageNumber}
                                                    className={`join-item btn btn-square ${page === pageNumber
                                                            ? "btn-primary font-bold"
                                                            : "btn-ghost hover:bg-gray-200"
                                                        }`}
                                                    onClick={() => setPage(pageNumber)}
                                                >
                                                    {pageNumber}
                                                </button>
                                            );
                                        })}

                                        {/* Next Button */}
                                        <button
                                            className="join-item btn btn-square btn-outline hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                            onClick={() => page < totalPages && setPage(page + 1)}
                                            disabled={page === totalPages}
                                        >
                                            &gt;
                                        </button>
                                    </>
                                );
                            })()}
                        </div>
                    </div>
                )}


            </div>
        </div>

    )
}

export default AccessLogPage

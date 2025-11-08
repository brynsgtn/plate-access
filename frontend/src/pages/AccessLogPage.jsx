import { useEffect, useState } from "react";
import { useLogStore } from "../stores/useLogStore";
import { useUserStore } from "../stores/useUserStore";
import { Search, BadgeCheckIcon, BadgeXIcon, Trash2, X, FileSpreadsheet, Archive, ArchiveIcon } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Papa from "papaparse";
import toast from "react-hot-toast";
import { get } from "mongoose";


dayjs.extend(relativeTime);

const LOGS_PER_PAGE = 10;

const AccessLogPage = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [filterType, setFilterType] = useState("all"); // all, guest, non-guest
    const [sortOrder, setSortOrder] = useState("newest");
    const [page, setPage] = useState(1);
    const [showArchiveModal, setShowArchiveModal] = useState(false);
    const [isExportModalOpen, setIsExportModalOpen] = useState(false);
    const [isArchiveModalOpen, setIsArchiveModalOpen] = useState(false);
    const [archiveLogs, setArchiveLogs] = useState([]);
    const [archiveLoading, setArchiveLoading] = useState(false);
    const [archivePage, setArchivePage] = useState(1);
    const [archiveSearchTerm, setArchiveSearchTerm] = useState("");

    // Export modal states
    const [selectedColumns, setSelectedColumns] = useState({
        timestamp: true,
        branch: true,
        gateType: true,
        method: true,
        success: true,
        notes: true,
        type: true,
        plateNumber: true,
    });
    const [exportFilters, setExportFilters] = useState({
        fromDate: "",
        toDate: "",
        gateType: "all",
        successStatus: "all",
        userType: "all",
        branch: "all",
    });

    const { logs: accessLog, fetchLogs, archiveOldLogs, getArchivedLogs, archivedLogs } = useLogStore();
    const { user } = useUserStore();
    const currentUser = user;

    useEffect(() => {
        fetchLogs();
    }, [fetchLogs, accessLog]);
    useEffect(() => {
        getArchivedLogs();
        console.log("Archived Logs from store:", archivedLogs);
    }, [getArchivedLogs]);

    // Filtering logs based on search, type, and branch
    const logs = [...accessLog]
        .filter(log => {
            if (currentUser.role === "parkingStaff") {
                return log.branch === currentUser.branch;
            }
            return true;
        })
        .sort((a, b) => {
            return sortOrder === "newest"
                ? new Date(b.timestamp) - new Date(a.timestamp)
                : new Date(a.timestamp) - new Date(b.timestamp);
        });

    const filteredLogs = logs.filter(log => {
        const term = searchTerm.toLowerCase().trim();

        if (!term) {
            const matchesType =
                filterType === "all" ||
                (filterType === "guest" && log.isGuest) ||
                (filterType === "non-guest" && !log.isGuest);
            return matchesType;
        }

        const plate = log.plateNumber ? String(log.plateNumber).toLowerCase() : "";
        const matchesSearch = plate.includes(term);
        const matchesType =
            filterType === "all" ||
            (filterType === "guest" && log.isGuest) ||
            (filterType === "non-guest" && !log.isGuest);

        return matchesSearch && matchesType;
    });

    const handleArchiveOldLogs = () => {
        archiveOldLogs();
        fetchLogs();
        setShowArchiveModal(false);
    };

    const totalPages = filteredLogs ? Math.ceil(filteredLogs.length / LOGS_PER_PAGE) : 1;
    const paginatedLogs = filteredLogs
        ? filteredLogs.slice((page - 1) * LOGS_PER_PAGE, page * LOGS_PER_PAGE)
        : [];

    const totalLogs = logs.length;
    const totalEntry = logs.filter(log => log.gateType === "entrance" && log.success).length;
    const totalExit = logs.filter(log => log.gateType === "exit" && log.success).length;
    const totalEntryFail = logs.filter(log => !log.success).length;

    // Export CSV logic
    const availableColumns = [
        { key: "timestamp", label: "Date & Time" },
        { key: "branch", label: "Branch" },
        { key: "gateType", label: "Gate" },
        { key: "method", label: "Method" },
        { key: "success", label: "Success" },
        { key: "notes", label: "Notes" },
        { key: "type", label: "Type" },
        { key: "plateNumber", label: "Plate Number" },
    ];

    const handleColumnToggle = key => {
        setSelectedColumns(prev => ({ ...prev, [key]: !prev[key] }));
    };

    const handleSelectAll = () => {
        const allSelected = Object.values(selectedColumns).every(v => v);
        const newState = {};
        Object.keys(selectedColumns).forEach(key => {
            newState[key] = !allSelected;
        });
        setSelectedColumns(newState);
    };

    const handleExport = () => {
        try {
            let data = logs.map(log => ({
                timestamp: dayjs(log.timestamp).format("MMM DD, YYYY hh:mm A"),
                branch: log.branch,
                gateType: log.gateType,
                method: log.method,
                success: log.success ? "Success" : "Denied",
                notes: log.notes || "",
                type: log.isGuest ? "Guest" : "Tenant",
                plateNumber: log.plateNumber,
            }));

            // Apply export filters
            data = data.filter(log => {
                // Gate Type filter
                if (exportFilters.gateType !== "all" && log.gateType !== exportFilters.gateType) return false;
                // Success filter
                if (
                    exportFilters.successStatus !== "all" &&
                    ((exportFilters.successStatus === "success" && log.success !== "Success") ||
                        (exportFilters.successStatus === "denied" && log.success !== "Denied"))
                )
                    return false;
                // User Type filter
                if (
                    exportFilters.userType !== "all" &&
                    ((exportFilters.userType === "guest" && log.type !== "Guest") ||
                        (exportFilters.userType === "tenant" && log.type !== "Tenant"))
                )
                    return false;
                // Date range filter
                if (exportFilters.fromDate && dayjs(log.timestamp).isBefore(dayjs(exportFilters.fromDate))) return false;
                if (exportFilters.toDate && dayjs(log.timestamp).isAfter(dayjs(exportFilters.toDate))) return false;

                // Branch filter
                if (currentUser.role === "parkingStaff" && log.branch !== currentUser.branch) return false;
                if (currentUser.role !== "parkingStaff" && exportFilters.branch && exportFilters.branch !== "all" && log.branch !== exportFilters.branch) return false;

                return true;
            });

            if (!data.length) {
                toast.error("No logs to export");
                return;
            }

            // Filter selected columns
            const filteredData = data.map(row => {
                const filtered = {};
                Object.keys(selectedColumns).forEach(key => {
                    if (selectedColumns[key]) filtered[key] = row[key];
                });
                return filtered;
            });

            // Prepare CSV headers
            const headers = availableColumns
                .filter(col => selectedColumns[col.key])
                .reduce((acc, col) => {
                    acc[col.key] = col.label;
                    return acc;
                }, {});

            const csv = Papa.unparse(filteredData, {
                columns: Object.keys(headers),
                header: true,
            });

            const lines = csv.split("\n");
            const labelLine = Object.values(headers).join(",");
            lines[0] = labelLine;
            const finalCsv = lines.join("\n");

            const blob = new Blob([finalCsv], { type: "text/csv;charset=utf-8;" });
            const link = document.createElement("a");
            const timestamp = dayjs().format("YYYY-MM-DD_HH-mm");
            link.setAttribute("href", URL.createObjectURL(blob));
            link.setAttribute("download", `Access_Logs_${timestamp}.csv`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            toast.success(`Exported ${filteredData.length} log(s)`);
            setIsExportModalOpen(false);
        } catch (error) {
            console.error("Export error:", error);
            toast.error("Failed to export logs");
        }
    };

    const selectedCount = Object.values(selectedColumns).filter(Boolean).length;


    const handleViewArchive = () => {
        setIsArchiveModalOpen(true);
        getArchivedLogs();
    };

    // Filter archived logs
    const filteredArchiveLogs = archivedLogs?.filter(log => {
        const term = archiveSearchTerm.toLowerCase().trim();
        if (!term) return true;
        const plate = log.plate_number ? String(log.plate_number).toLowerCase() : "";
        return plate.includes(term);
    }).sort((a, b) => {
        return sortOrder === "newest"
            ? new Date(b.timestamp) - new Date(a.timestamp)
            : new Date(a.timestamp) - new Date(b.timestamp);
    });

    const totalArchivePages = Math.ceil(filteredArchiveLogs.length / LOGS_PER_PAGE);
    const paginatedArchiveLogs = filteredArchiveLogs.slice(
        (archivePage - 1) * LOGS_PER_PAGE,
        archivePage * LOGS_PER_PAGE
    );

    return (
        <div className="min-h-screen relative overflow-hidden bg-base-100">
            {/* Page header */}
            <div className="relative z-10 container mx-auto px-4 pt-16 mb-10 max-w-6xl text-center">
                <h1 className="text-4xl font-bold mb-2 text-primary">Access Logs</h1>
                <p className="text-base-content/70">Manage your access logs efficiently with our comprehensive tools.</p>
            </div>

            {/* Stats summary */}
            <div className="container mx-auto max-w-6xl shadow-xl rounded-xl border border-base-300 overflow-hidden mb-10">
                <div className="border-b border-base-300 bg-gradient-to-r from-primary to-secondary p-6 rounded-t-xl">
                    <h2 className="text-2xl font-bold text-white">Logs Summary</h2>
                    <p className="text-white/80 mt-1">Logs statistics and summary</p>
                </div>
                <div className="stats stats-vertical lg:stats-horizontal w-full">
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

            {/* Logs table */}
            <div className="container mx-auto max-w-6xl shadow-xl rounded-xl border border-base-300 overflow-x-auto mb-10">
                <div className="border-b border-base-300 bg-gradient-to-r from-primary to-secondary p-6 rounded-t-xl flex justify-between items-center">
                    <div>
                        <h2 className="text-2xl font-bold text-white">Logs</h2>
                        <p className="text-white/80 mt-1">Logs will be displayed here</p>
                    </div>
                </div>

                <div className="bg-base-100 p-4">
                    <p className="text-lg font-semibold text-base-content mb-3">Filter By:</p>
                    <div className="flex flex-col md:flex-row gap-4 items-center">
                        {/* Search */}
                        <label className="input input-bordered flex items-center gap-2 w-full md:w-64">
                            <Search className="w-4 h-4 opacity-70" />
                            <input
                                type="text"
                                className="grow"
                                placeholder="Search by plate number"
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                            />
                        </label>

                        {/* Guest / Tenant */}
                        <select
                            className="select select-bordered w-full md:w-40"
                            value={filterType}
                            onChange={e => setFilterType(e.target.value)}
                        >
                            <option value="all">All</option>
                            <option value="guest">Guest</option>
                            <option value="non-guest">Tenant</option>
                        </select>

                        {/* Sort */}
                        <select
                            className="select select-bordered w-full md:w-40"
                            value={sortOrder}
                            onChange={e => setSortOrder(e.target.value)}
                        >
                            <option value="newest">Newest First</option>
                            <option value="oldest">Oldest First</option>
                        </select>

                        <button
                            onClick={() => setIsExportModalOpen(true)}
                            className="btn btn-accent flex items-center gap-2 hover:scale-105 transition-transform duration-200 ms-auto"
                        >
                            <FileSpreadsheet size={18} />
                            Export CSV
                        </button>

                        {/* View Archive button */}
                        {currentUser.role === "itAdmin" && (
                            <button
                                onClick={handleViewArchive}
                                className="btn btn-info flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                            >
                                <Archive className="w-5 h-5" />
                                View Archive
                            </button>
                        )}

                        {/* Archive old logs */}
                        {currentUser.role === "itAdmin" && (
                            <button
                                className="btn btn-error btn-outline flex items-center gap-2 hover:scale-105 transition-transform duration-200"
                                onClick={() => setShowArchiveModal(true)}
                            >
                                <ArchiveIcon className="w-5 h-5" />
                                Archive Old Logs
                            </button>
                        )}
                    </div>
                </div>

                {/* Table */}
                <table className="table table-zebra w-full">
                    <thead className="bg-base-200">
                        <tr>
                            <th>#</th>
                            <th>Date</th>
                            <th>Time</th>
                            <th>Branch</th>
                            <th>Gate</th>
                            <th>Method</th>
                            <th>Success</th>
                            <th>Reason</th>
                            <th>Type</th>
                            <th>Plate Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {paginatedLogs.length === 0 ? (
                            <tr>
                                <td colSpan={10} className="text-center py-8 text-base-content/70">
                                    No logs found.
                                </td>
                            </tr>
                        ) : (
                            paginatedLogs.map((log, idx) => (
                                <tr key={log._id} className="hover:bg-base-200 transition">
                                    <th>{(page - 1) * LOGS_PER_PAGE + idx + 1}</th>
                                    <td>{dayjs(log.timestamp).format("MMM DD, YYYY")}</td>
                                    <td>{dayjs(log.timestamp).format("h:mm A")}</td>
                                    <td>{log.branch}</td>
                                    <td>{log.gateType}</td>
                                    <td>{log.method}</td>
                                    <td>
                                        {log.success ? (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-success border-none">
                                                <BadgeCheckIcon className="w-5 h-5" />
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-error border-none">
                                                <BadgeXIcon className="w-5 h-5" />
                                            </span>
                                        )}
                                    </td>
                                    <td className="max-w-[100px]">
                                        {log.notes ? (
                                            <div className="tooltip tooltip-left" data-tip={log.notes}>
                                                <div className="truncate cursor-help w-[100px]">{log.notes}</div>
                                            </div>
                                        ) : (
                                            "-"
                                        )}
                                    </td>
                                    <td>{log.isGuest ? "Guest" : "Tenant"}</td>
                                    <td>{log.plateNumber}</td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center my-10">
                    <div className="join">
                        {/* Prev button */}
                        <button
                            className="join-item btn btn-square btn-outline hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => setPage(prev => Math.max(prev - 1, 1))}
                            disabled={page === 1}
                        >
                            &lt;
                        </button>

                        {/* Page numbers */}
                        {(() => {
                            const maxPagesToShow = 10;
                            let startPage = Math.floor((page - 1) / maxPagesToShow) * maxPagesToShow + 1;
                            let endPage = Math.min(startPage + maxPagesToShow - 1, totalPages);

                            return Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                                const pageNumber = startPage + i;
                                return (
                                    <button
                                        key={pageNumber}
                                        className={`join-item btn btn-square ${page === pageNumber ? "btn-primary font-bold" : "btn-ghost hover:bg-gray-200"}`}
                                        onClick={() => setPage(pageNumber)}
                                    >
                                        {pageNumber}
                                    </button>
                                );
                            });
                        })()}

                        {/* Next button */}
                        <button
                            className="join-item btn btn-square btn-outline hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                            onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={page === totalPages}
                        >
                            &gt;
                        </button>
                    </div>
                </div>
            )}


            {/* Archive Confirmation Modal */}
            {showArchiveModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
                    <div className="bg-gradient-to-r from-primary to-secondary rounded-lg shadow-lg max-w-md w-full p-6 relative">
                        <button className="absolute top-3 right-3 btn btn-sm btn-ghost bg-transparent border-none" onClick={() => setShowArchiveModal(false)}>
                            <X className="w-5 h-5 text-white" />
                        </button>
                        <h2 className="text-xl font-bold text-white mb-4">Confirm Archiving</h2>
                        <p className="mb-6 text-white/80">
                            Are you sure you want to archive all logs older than 1 year? This action cannot be undone.
                        </p>
                        <div className="flex justify-end gap-4">
                            <button className="btn btn-outline" onClick={() => setShowArchiveModal(false)}>Cancel</button>
                            <button className="btn btn-error" onClick={handleArchiveOldLogs}>Archive</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Export Modal */}
            {isExportModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-base-100 rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-base-300">
                            <div>
                                <h2 className="text-2xl font-bold">Export Access Logs</h2>
                                <p className="text-sm text-base-content/60 mt-1">Customize your export options</p>
                            </div>
                            <button onClick={() => setIsExportModalOpen(false)} className="btn btn-ghost btn-sm btn-circle">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4">
                            <div>
                                <h3 className="font-semibold">Select Columns ({selectedCount})</h3>
                                <button className="btn btn-xs btn-outline mt-1 mb-2" onClick={handleSelectAll}>Toggle All</button>
                                <div className="grid grid-cols-2 gap-2">
                                    {availableColumns.map(col => (
                                        <label key={col.key} className="flex items-center gap-2">
                                            <input type="checkbox" checked={selectedColumns[col.key]} onChange={() => handleColumnToggle(col.key)} />
                                            {col.label}
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Filters */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="label">From Date</label>
                                    <input
                                        type="date"
                                        className="input input-bordered w-full"
                                        value={exportFilters.fromDate}
                                        onChange={e => setExportFilters(prev => ({ ...prev, fromDate: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="label">To Date</label>
                                    <input
                                        type="date"
                                        className="input input-bordered w-full"
                                        value={exportFilters.toDate}
                                        onChange={e => setExportFilters(prev => ({ ...prev, toDate: e.target.value }))}
                                    />
                                </div>
                                <div>
                                    <label className="label">Gate Type</label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={exportFilters.gateType}
                                        onChange={e => setExportFilters(prev => ({ ...prev, gateType: e.target.value }))}
                                    >
                                        <option value="all">All</option>
                                        <option value="entrance">Entrance</option>
                                        <option value="exit">Exit</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">Success Status</label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={exportFilters.successStatus}
                                        onChange={e => setExportFilters(prev => ({ ...prev, successStatus: e.target.value }))}
                                    >
                                        <option value="all">All</option>
                                        <option value="success">Success</option>
                                        <option value="denied">Denied</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="label">User Type</label>
                                    <select
                                        className="select select-bordered w-full"
                                        value={exportFilters.userType}
                                        onChange={e => setExportFilters(prev => ({ ...prev, userType: e.target.value }))}
                                    >
                                        <option value="all">All</option>
                                        <option value="guest">Guest</option>
                                        <option value="tenant">Tenant</option>
                                    </select>
                                </div>
                                {currentUser.role !== "parkingStaff" && (
                                    <div>
                                        <label className="label">Branch</label>
                                        <select
                                            className="select select-bordered w-full"
                                            value={exportFilters.branch || "all"}
                                            onChange={e => setExportFilters(prev => ({ ...prev, branch: e.target.value }))}
                                        >
                                            <option value="all">All</option>
                                            <option value="Main Branch">Main Branch</option>
                                            <option value="North Branch">North Branch</option>
                                            <option value="South Branch">South Branch</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="flex justify-end gap-4 p-6 border-t border-base-300">
                            <button className="btn btn-outline" onClick={() => setIsExportModalOpen(false)}>Cancel</button>
                            <button className="btn btn-accent" onClick={handleExport}>Export CSV</button>
                        </div>
                    </div>
                </div>
            )}

            {/* Archive Modal */}
            {isArchiveModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-base-100 rounded-lg shadow-xl max-w-6xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="flex justify-between items-center p-6 border-b border-base-300 from-primary to-secondary bg-gradient-to-r">
                            <div>
                                <h2 className="text-2xl font-bold text-white">Archived Logs</h2>
                                <p className="text-sm text-white/80 mt-1">View historical archived logs</p>
                            </div>
                            <button onClick={() => {
                                setIsArchiveModalOpen(false);
                                setArchiveSearchTerm("");
                                setArchivePage(1);
                            }} className="btn btn-ghost btn-sm btn-circle text-white">
                                <X size={20} />
                            </button>
                        </div>

                        <div className="p-6">
                            {archiveLoading ? (
                                <div className="flex justify-center items-center py-12">
                                    <span className="loading loading-spinner loading-lg"></span>
                                </div>
                            ) : (
                                <>
                                    {/* Search */}
                                    <div className="mb-4">
                                        <label className="input input-bordered flex items-center gap-2 w-full md:w-64">
                                            <Search className="w-4 h-4 opacity-70" />
                                            <input
                                                type="text"
                                                className="grow"
                                                placeholder="Search by plate number"
                                                value={archiveSearchTerm}
                                                onChange={e => setArchiveSearchTerm(e.target.value)}
                                            />
                                        </label>
                                    </div>

                                    {/* Archive Table */}
                                    <div className="overflow-x-auto">
                                        <table className="table table-zebra w-full">
                                            <thead className="bg-base-200">
                                                <tr>
                                                    <th>#</th>
                                                    <th>Date</th>
                                                    <th>Time</th>
                                                    <th>Branch</th>
                                                    <th>Gate</th>
                                                    <th>Method</th>
                                                    <th>Confidence</th>
                                                    <th>Success</th>
                                                    <th>Type</th>
                                                    <th>Plate Number</th>
                                                    <th>Notes</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {paginatedArchiveLogs.length === 0 ? (
                                                    <tr>
                                                        <td colSpan={11} className="text-center py-8 text-base-content/70">
                                                            No archived logs found.
                                                        </td>
                                                    </tr>
                                                ) : (
                                                    paginatedArchiveLogs.map((log, idx) => (
                                                        <tr key={log.id} className="hover:bg-base-200 transition">
                                                            <th>{(archivePage - 1) * LOGS_PER_PAGE + idx + 1}</th>
                                                            <td>{dayjs(log.timestamp).format("MMM DD, YYYY")}</td>
                                                            <td>{dayjs(log.timestamp).format("h:mm A")}</td>
                                                            <td>{log.branch}</td>
                                                            <td>{log.gate_type}</td>
                                                            <td>{log.method}</td>
                                                            <td>{log.confidence}%</td>
                                                            <td>
                                                                {log.success ? (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-success border-none">
                                                                        <BadgeCheckIcon className="w-5 h-5" />
                                                                    </span>
                                                                ) : (
                                                                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold text-error border-none">
                                                                        <BadgeXIcon className="w-5 h-5" />
                                                                    </span>
                                                                )}
                                                            </td>
                                                            <td>{log.is_guest ? "Guest" : "Tenant"}</td>
                                                            <td>{log.plate_number}</td>
                                                            <td className="max-w-xs truncate" title={log.notes || "-"}>
                                                                {log.notes || "-"}
                                                            </td>
                                                        </tr>
                                                    ))
                                                )}
                                            </tbody>
                                        </table>
                                    </div>

                                    {/* Archive Pagination */}
                                    {totalArchivePages > 1 && (
                                        <div className="flex justify-center mt-6">
                                            <div className="join">
                                                <button
                                                    className="join-item btn btn-square btn-outline hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    onClick={() => setArchivePage(prev => Math.max(prev - 1, 1))}
                                                    disabled={archivePage === 1}
                                                >
                                                    &lt;
                                                </button>

                                                {Array.from({ length: Math.min(10, totalArchivePages) }, (_, i) => {
                                                    const pageNumber = i + 1;
                                                    return (
                                                        <button
                                                            key={pageNumber}
                                                            className={`join-item btn btn-square ${archivePage === pageNumber ? "btn-primary font-bold" : "btn-ghost hover:bg-gray-200"}`}
                                                            onClick={() => setArchivePage(pageNumber)}
                                                        >
                                                            {pageNumber}
                                                        </button>
                                                    );
                                                })}

                                                <button
                                                    className="join-item btn btn-square btn-outline hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                                    onClick={() => setArchivePage(prev => Math.min(prev + 1, totalArchivePages))}
                                                    disabled={archivePage === totalArchivePages}
                                                >
                                                    &gt;
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AccessLogPage;
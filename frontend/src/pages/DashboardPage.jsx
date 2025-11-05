import {
    Activity,
    Shield,
    Users,
    TrendingUp,
    Eye,
    AlertTriangle,
    Ban,
    FileChartColumnIcon,
    ParkingCircleOffIcon,
    Archive

} from 'lucide-react';

import { useGateStore } from '../stores/useGateStore';
import { useLogStore } from '../stores/useLogStore';
import { useEffect, useState } from 'react';
// import CameraFeed from '../components/CameraFeed';

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);


const DashboardPage = () => {


    const isEntranceGateOpen = useGateStore(state => state.isEntranceGateOpen);
    const isExitGateOpen = useGateStore(state => state.isExitGateOpen);
    const lastEntranceAction = useGateStore(state => state.lastEntranceAction);
    const lastExitAction = useGateStore(state => state.lastExitAction);
    const initCrossTabSync = useGateStore(state => state.initCrossTabSync);

    // Initialize cross-tab sync on mount
    useEffect(() => {
        initCrossTabSync();
        logLiveUpdate();
    }, [initCrossTabSync]);


    const { fetchLogs, logs, logLiveUpdate } = useLogStore();

    const totalLogs = logs.length;
    const totalEntry = logs.filter((log) => log.gateType === "entrance" && log.success === true).length;
    const totalExit = logs.filter((log) => log.gateType === "exit" && log.success === true).length;
    const totalEntryFail = logs.filter((log) => log.success === false).length;
    const verificationAlerts = logs.filter((log) => log.confidence <= .30).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 2);;

    const denialRate = totalLogs === 0
        ? 0
        : ((totalEntryFail / totalLogs) * 100).toFixed(1); // 1 decimal place

    const recentLogs = logs.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 6);

    const recentBlacklistLogs = logs.filter((log) => log.blacklistHit || log.banHit || log.archiveHit === true).sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)).slice(0, 3);

    // Test

    const today = dayjs().startOf("day");
    const yesterday = dayjs().subtract(1, "day").startOf("day");

    const logsToday = logs.filter(log => dayjs(log.timestamp).isAfter(today));
    const logsYesterday = logs.filter(log => dayjs(log.timestamp).isAfter(yesterday) && dayjs(log.timestamp).isBefore(today));

    const totalToday = logsToday.length;
    const totalYesterday = logsYesterday.length;

    const percentageChange = totalYesterday === 0
        ? 100
        : ((totalToday - totalYesterday) / totalYesterday * 100).toFixed(1);


    // Group logs by hour
    const hourlyCounts = {};
    logsToday.forEach(log => {
        const hour = dayjs(log.timestamp).format("HH:00"); // e.g., "14:00"
        hourlyCounts[hour] = (hourlyCounts[hour] || 0) + 1;
    });

    // Find peak
    const peakHour = Object.entries(hourlyCounts).reduce((max, [hour, count]) => {
        return count > max.count ? { hour, count } : max;
    }, { hour: null, count: 0 }).hour;

    // Convert "HH:00" to a nice AM/PM format
    // Assume peakHour = "14:00" (from your hourlyCounts)
    const formattedPeakHour = peakHour
        ? dayjs(`${dayjs().format("YYYY-MM-DD")}T${peakHour}`).format("h:mm A")
        : "-";


    const lastExitLog = logs
        .filter(log => log.gateType === "exit" && log.success)
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))[0];

    const lastExitTime = lastExitLog
        ? dayjs(lastExitLog.timestamp).format("h:mm A")
        : "No exits yet";


    useEffect(() => {
        fetchLogs();
        logLiveUpdate();
    }, [fetchLogs]);

    useEffect(() => {
        useLogStore.getState().logLiveUpdate();
    }, [])

    useEffect(() => {
        console.log("logs: ", logs)
    }, [logs])


    return (
        <>
            <div className='min-h-screen relative overflow-hidden bg-base-100'>
                {/* Background Pattern */}
                <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
                {/* Header Section */}
                <div className="relative z-10 container mx-auto px-4 pt-16 pb-8 max-w-7xl">
                    <div className="text-center mb-5">
                        <h1 className="text-4xl font-bold mb-8 text-primary drop-shadow autumn-gradient-text text-center">
                            Dashboard
                        </h1>
                        <p className="text-center text-base-content/70">
                            Manage and visualize your ALPR system with real-time status, insights, and interactive controls.
                        </p>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 mb-12">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-t-xl">
                        <h1 className="text-2xl font-bold text-white">
                            <FileChartColumnIcon className="inline-block mr-3 h-6 w-6 stroke-current" />
                            System Summary
                        </h1>
                        <p className="text-white/80 mt-2">Summary of the system's current status and performance.</p>
                    </div>

                    {/* Stats */}
                    <div className="stats stats-vertical lg:stats-horizontal w-full bg-base-100 p-6 rounded-b-xl shadow-xl">

                        {/* Total Access */}
                        <div className="stat p-6">
                            <div className="stat-figure text-primary">
                                <Activity className="inline-block h-10 w-10 stroke-current" />
                            </div>
                            <div className="stat-title text-lg font-bold text-base-content/80">Total Attempts</div>
                            <div className="stat-value text-primary">{totalLogs}</div>
                            <div className="stat-desc text-base-content/70">{percentageChange}% from yesterday</div>
                        </div>

                        {/* Entries */}
                        <div className="stat p-6">
                            <div className="stat-figure text-secondary">
                                <TrendingUp className="inline-block h-10 w-10 stroke-current" />
                            </div>
                            <div className="stat-title text-lg font-bold text-base-content/80">Entries</div>
                            <div className="stat-value text-secondary">{totalEntry}</div>
                            <div className="stat-desc text-base-content/70">Peak: {formattedPeakHour}</div>
                        </div>

                        {/* Exits */}
                        <div className="stat p-6">
                            <div className="stat-figure text-accent">
                                <Users className="inline-block h-10 w-10 stroke-current" />
                            </div>
                            <div className="stat-title text-lg font-bold text-base-content/80">Exits</div>
                            <div className="stat-value text-accent">{totalExit}</div>
                            <div className="stat-desc text-base-content/70">Last: {lastExitTime}</div>
                        </div>

                        {/* Alerts */}
                        {/* <div className="stat p-6">
                            <div className="stat-figure text-error">
                                <AlertTriangle className="inline-block h-10 w-10 stroke-current" />
                            </div>
                            <div className="stat-title text-lg font-bold text-base-content/80">Active Alerts</div>
                            <div className="stat-value text-error">{recentBlacklistLogs.length}</div>
                            <div className="stat-desc text-base-content/70">Requires attention</div>
                        </div> */}

                        {/* Recognition Rate */}
                        <div className="stat p-6">
                            <div className="stat-figure text-primary">
                                <Shield className="inline-block h-10 w-10 stroke-current" />
                            </div>
                            <div className="stat-title text-lg font-bold text-base-content/80">Failed Attempts</div>
                            <div className="stat-value text-primary">{totalEntryFail}</div>
                            <div className="stat-desc text-base-content/70">Denial Rate: {denialRate}%</div>
                        </div>
                    </div>
                </div>



                {/* System Status */}
                <div className="max-w-7xl mx-auto px-4 mb-12">
                    {/* Section Header */}
                    <div className="bg-gradient-to-r from-primary to-secondary p-5 rounded-t-xl ">
                        <h1 className="text-2xl font-bold text-white flex items-center">
                            <Eye className="mr-3 h-6 w-6" />
                            Gate Status
                        </h1>
                        <p className="text-white/80 mt-2">Live status of the gates and their last actions.</p>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 shadow-2xl rounded-b-2xl ">
                        {/* Entrance Section */}
                        <div className="bg-base-100 rounded-b-2xl  p-6 space-y-4 hover:shadow-md transition-shadow duration-300">


                            {/* Entrance Gate */}
                            <div className="p-4 bg-base-200 rounded-lg flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-base-content">Entrance Gate</h3>
                                    <span className={`text-sm font-medium flex items-center gap-1 ${isEntranceGateOpen ? "text-success" : "text-error"
                                        }`}>
                                        <div className={`w-2 h-2 ${isEntranceGateOpen ? "bg-success" : "bg-error"} rounded-full animate-pulse`}></div>
                                        {isEntranceGateOpen ? "OPEN" : "CLOSED"}
                                    </span>
                                </div>
                                {lastEntranceAction ? (
                                    <p className="text-xs text-base-content/70">
                                        Last action: {lastEntranceAction.action} at {lastEntranceAction.time}
                                    </p>
                                ) : (
                                    <p className="text-xs text-base-content/50 italic">No actions yet</p>
                                )}
                            </div>

                            {/* Entrance Camera */}
                            {/* <div className='bg-base-200 p-4 rounded-lg'>
                                <CameraFeed title="Entrance Camera" defaultURL="rtsp://localhost:8554/mystream" />
                            </div> */}
                        </div>

                        {/* Exit Section */}
                        <div className="bg-base-100 rounded-b-2xl  p-6 space-y-4 hover:shadow-md transition-shadow duration-300">

                            {/* Exit Gate */}
                            <div className="p-4 bg-base-200 rounded-lg flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-base-content">Exit Gate</h3>
                                    <span className={`text-sm font-medium flex items-center ${isExitGateOpen ? "text-success" : "text-error"} gap-1`}>
                                        <div className={`w-2 h-2 ${isExitGateOpen ? "bg-success" : "bg-error"} rounded-full`}></div>
                                        {isExitGateOpen ? "OPEN" : "CLOSED"}
                                    </span>
                                </div>

                                {lastExitAction ? (
                                    <p className="text-xs text-base-content/70">
                                        Last action: {lastExitAction.action} at {lastExitAction.time}
                                    </p>
                                ) : (
                                    <p className="text-xs text-base-content/50 italic">No actions yet</p>
                                )}
                            </div>

                            {/* Exit Camera */}
                            {/* <div className="bg-base-200 p-4 rounded-lg">
                                <CameraFeed title="Exit Camera" defaultURL="rtsp://localhost:8554/mystream" />
                            </div> */}
                        </div>
                    </div>
                </div>


                <div className="max-w-7xl mx-auto px-4 mb-12 space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        {/* Recent Access Logs */}
                        <div className="bg-base-100 rounded-2xl shadow-lg ">
                            <div className="bg-gradient-to-r from-primary to-secondary p-5 rounded-t-xl mb-4">
                                <h2 className="text-2xl font-bold text-white flex items-center">
                                    <Activity className="mr-3 h-5 w-5 text-white" />
                                    Live Access Logs
                                </h2>
                                <p className="text-white/80 mt-2">Recent access logs</p>
                            </div>
                            {/* Recent Log Entries */}
                            {recentLogs.length > 0 ? (
                                recentLogs.map((log) => {
                                    const isEntrance = log.gateType === "entrance";
                                    const isSuccess = log.success;

                                    return (
                                        <div key={log._id} className="p-2">
                                            <div
                                                className={`flex items-center justify-between p-4 rounded-xl border-l-4 shadow-sm hover:shadow-md transition-all duration-200
            ${isSuccess
                                                        ? isEntrance
                                                            ? "bg-green-50 border-green-500"
                                                            : "bg-orange-50 border-orange-500"
                                                        : "bg-red-50 border-red-500"
                                                    }`}
                                            >
                                                <div className="flex items-start">
                                                    <div
                                                        className={`w-2 h-2 rounded-full mr-3 mt-1 ${isSuccess
                                                            ? isEntrance
                                                                ? "bg-green-500"
                                                                : "bg-orange-500"
                                                            : "bg-red-500"
                                                            }`}
                                                    />
                                                    <div>
                                                        <p className="font-semibold text-base-content">{log.plateNumber}</p>
                                                        <p className="text-xs text-base-content/60 italic mt-0.5">
                                                            {log.branch || "N/A"}
                                                        </p>
                                                        <p className="text-xs text-base-content/60 italic mt-0.5">
                                                            {log.method || "N/A"}
                                                        </p>
                                                        <p className="text-sm text-base-content/70 mt-1">
                                                            <span>
                                                                {isSuccess
                                                                    ? isEntrance
                                                                        ? "Entry • "
                                                                        : "Exit • "
                                                                    : "Failed • "}
                                                            </span>
                                                            <span>{dayjs(log.timestamp).fromNow()}</span>
                                                            <span>{log.isGuest ? " • Guest" : ""}</span>
                                                            {!isSuccess ? (
                                                                <>
                                                                    {log.banHit ? <span className="text-error/90 ms-2">• Banned</span>
                                                                        : log.archiveHit ?
                                                                            <span className="text-error/90  ms-2">• Archived</span>
                                                                            : log.blacklistHit ?
                                                                                <span className="text-error/80 ms-2">• Blacklisted</span>
                                                                                : log.isGuest ? (
                                                                                    <span className="text-error/80 ms-2">• Guest Access Expired</span>
                                                                                ) : (
                                                                                    <span className="text-error/80 ms-2">• Unrecognized Vehicle</span>
                                                                                )}
                                                                </>
                                                            ) : <span
                                                                className={`${isEntrance ? "text-success/80 ms-2" : "text-warning/80 ms-2"
                                                                    }`}
                                                            >
                                                                • {log.notes}
                                                            </span>

                                                            }
                                                        </p>
                                                    </div>
                                                </div>

                                                <span
                                                    className={`px-3 py-1 font-medium text-xs rounded-full
              ${isSuccess
                                                            ? isEntrance
                                                                ? "bg-green-100 text-green-800"
                                                                : "bg-orange-100 text-orange-800"
                                                            : "bg-red-100 text-red-800"
                                                        }`}
                                                >
                                                    {isEntrance ? "ENTRY" : "EXIT"}
                                                </span>
                                            </div>
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-sm text-base-content/50 italic">No recent logs yet</p>
                            )}


                        </div>

                        {/* Verification & Blacklist Alerts */}
                        <div className="space-y-6">
                            {/* Verification Alerts */}
                            <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300">
                                <div className="bg-gradient-to-r from-primary to-secondary p-5 rounded-t-xl mb-4">
                                    <h2 className="text-2xl font-bold text-white flex items-center">
                                        <Eye className="mr-3 h-5 w-5 text-white" />
                                        Verification Alerts
                                    </h2>
                                    <p className="text-white/80 mt-2">Latest verification alerts</p>
                                </div>
                                <div className="p-6 space-y-4">
                                    {verificationAlerts.length > 0 ? (
                                        verificationAlerts.map((alert) => (
                                            <div
                                                key={alert._id}
                                                className="p-4 bg-yellow-50 rounded-xl border border-yellow-300 shadow-sm hover:shadow-md transition-shadow duration-200"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start">
                                                        <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                                                        <div>
                                                            <p className="font-semibold text-yellow-800">
                                                                Low Confidence Reading
                                                            </p>
                                                            <p className="text-sm text-yellow-700">
                                                                {alert.plateNumber} ({alert.confidence * 100}%)
                                                            </p>
                                                            <p className="text-xs text-yellow-600 italic mt-1">
                                                                {alert.branch || "N/A"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <span className="text-xs text-yellow-600">
                                                        {dayjs(alert.timestamp).fromNow()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-base-content/50 italic">
                                            No recent verification alerts yet
                                        </p>
                                    )}
                                </div>
                            </div>


                            {/* Blacklist Alerts */}
                            <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300">
                                <div className="bg-gradient-to-r from-primary to-secondary p-5 rounded-t-xl mb-4">
                                    <h2 className="text-2xl font-bold text-white flex items-center">
                                        <Ban className="mr-3 h-5 w-5 text-white" />
                                        Security Alerts
                                    </h2>
                                    <p className="text-white/80 mt-2">Latest security alerts</p>
                                </div>
                                <div className="p-6 space-y-4">
                                    {recentBlacklistLogs.length > 0 ? (
                                        recentBlacklistLogs.map((log) => (
                                            <div
                                                key={log._id}
                                                className="p-4 bg-red-50 rounded-xl border border-red-300 shadow-sm hover:shadow-md transition-shadow duration-200"
                                            >
                                                <div className="flex items-start justify-between">
                                                    <div className="flex items-start">
                                                        {log.banHit ? <Ban className="h-5 w-5 text-red-600 mr-3 mt-0.5" /> : log.archiveHit ? <Archive className="h-5 w-5 text-red-600 mr-3 mt-0.5" /> : <ParkingCircleOffIcon className="h-5 w-5 text-red-600 mr-3 mt-0.5" />}
                                                        <div>
                                                            <p className="font-semibold text-red-800">
                                                                {log.banHit ? "Banned" : log.archiveHit ? "Archived" : "Blacklisted"} Vehicle
                                                            </p>
                                                            <p className="text-sm text-red-700">
                                                                {log.plateNumber} - Access Denied
                                                            </p>
                                                            <p className="text-xs text-red-500 italic mt-1">
                                                                {log.branch || "N/A"}
                                                            </p>
                                                        </div>
                                                    </div>

                                                    <span className="text-xs text-red-600">
                                                        {dayjs(log.timestamp).fromNow()}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-base-content/50 italic">
                                            No recent blacklist logs yet
                                        </p>
                                    )}
                                </div>

                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}

export default DashboardPage;
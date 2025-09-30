import { useState, useEffect } from "react";
import { Car, CarFront, CircleParkingOff, FilePen, Plus, CirclePlusIcon } from "lucide-react";

import AddVehicleForm from "../components/AddVehicleForm";
import VehicleList from "../components/VehicleList";
import BlacklistedVehicleList from "../components/BlacklistedVehicleList";
import VehicleRequestList from "../components/VehicleRequestList";
import AddGuestVehicleForm from "../components/AddGuestVehicleForm";
import GuestVehicleList from "../components/GuestVehicleList";
import BlacklistedGuestVehicleList from "../components/BlacklistedGuestVehicleList";
import { useVehicleStore } from "../stores/useVehicleStore";
import { useGuestVehicleStore } from "../stores/useGuestVehicleStore";



const tabs = [
    { id: "add", label: "Add Vehicle", icon: Plus },
    { id: "view", label: "View Vehicles", icon: Car },
    { id: "blacklisted", label: "Blacklisted Vehicles", icon: CircleParkingOff },
    { id: "requests", label: "Vehicle Requests", icon: FilePen },
];

const guestVehicleTabs = [
    { id: "add", label: "Add Guest Vehicle", icon: Plus },
    { id: "view", label: "View Guest Vehicles", icon: Car },
    { id: "blacklisted", label: "Blacklisted Guest Vehicles", icon: CircleParkingOff },
];

const VehicleManagementPage = () => {
    const [activeTab, setActiveTab] = useState(() => {
        // Try to get the saved tab from localStorage
        const savedTab = localStorage.getItem("activeTab");
        return savedTab || "add"; // Fallback to "add" if nothing saved
    });

    const [guestActiveTab, setGuestActiveTab] = useState(() => {
        // Try to get the saved tab from localStorage
        const savedGuestTab = localStorage.getItem("activeGuestTab");
        return savedGuestTab || "add"; // Fallback to "add" if nothing saved
    });
    const { viewVehicles, vehicles } = useVehicleStore();
    const { fetchGuestVehicles, guestVehicles} = useGuestVehicleStore();

    // Restore active tab from localStorage on mount
    useEffect(() => {
        const savedTab = localStorage.getItem("activeTab");
        const savedGuestTab = localStorage.getItem("activeGuestTab");
        if (savedTab) {
            setActiveTab(savedTab);
        }
        if (savedGuestTab) {
            setGuestActiveTab(savedGuestTab);
        }
    }, []);

    // Save active tab to localStorage whenever it changes
    useEffect(() => {
        localStorage.setItem("activeTab", activeTab);
        localStorage.setItem("activeGuestTab", guestActiveTab);
    }, [activeTab, guestActiveTab]);


    useEffect(() => {
        // Fetch vehicle data when the component mounts
        viewVehicles();
    }, [viewVehicles]);

        useEffect(() => {
        // Fetch guest vehicles data when the component mounts
        fetchGuestVehicles();
    }, [fetchGuestVehicles]);


    // Separate useEffect to log vehicles when they change
    useEffect(() => {
        console.log("Vehicles:", vehicles);
    }, [vehicles]);


        // Separate useEffect to log vehicles when they change
    useEffect(() => {
        console.log("Guest vehicles:", guestVehicles);
    }, [guestVehicles]);

    const totalVehicles = Array.isArray(vehicles) ? vehicles.filter((vehicle) => vehicle.isApproved).length : 0;
    const blacklistedVehicles = Array.isArray(vehicles) ? vehicles.filter((vehicle) => vehicle.isBlacklisted).length : 0;

    const unapprovedVehicles = Array.isArray(vehicles) ? vehicles.filter(v => {
        // Handle different possible values for isApproved
        return v.isApproved === false || v.isApproved === "false" || v.isApproved === null || v.isApproved === undefined;
    }) : [];

    const updateRequests = Array.isArray(vehicles) ? vehicles.filter(v => {
        return v.updateRequest && (!v.updateRequest.status || v.updateRequest.status === 'pending');
    }) : [];

    const deleteRequests = Array.isArray(vehicles) ? vehicles.filter(v => {
        return v.deleteRequest && (!v.deleteRequest.status || v.deleteRequest.status === 'pending');
    }) : [];

    const editDeleteRequests = updateRequests.length + deleteRequests.length;


    return (
        <div className="min-h-screen relative overflow-hidden bg-base-100">
            <div className="relative z-10 container mx-auto px-4 pt-16 mb-10 max-w-6xl">
                <h1 className="text-4xl font-bold mb-8 text-primary drop-shadow autumn-gradient-text text-center">
                    Vehicle Management
                </h1>
                <p className="text-center text-base-content/70">
                    Manage your vehicle fleet efficiently with our comprehensive tools.
                </p>
            </div>
            <div className="container mx-auto max-w-6xl shadow-xl rounded-xl border border-base-300 overflow-hidden">

                <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-t-xl">
                    <h1 className="text-2xl font-bold text-white">Vehicle Summary</h1>
                    <p className="text-white/80 mt-2">Get an overview of your vehicle fleet.</p>
                </div>

                <div className="stats stats-vertical lg:stats-horizontal  w-full">
                    <div className="stat p-6">
                        <div className="stat-figure text-primary">
                            <CarFront className="inline-block h-10 w-10 stroke-current" />
                        </div>
                        <div className="stat-title text-lg font-bold text-base-content/80">Total Vehicles</div>
                        <div className="stat-value text-primary">{totalVehicles}</div>
                    </div>

                    <div className="stat p-6">
                        <div className="stat-figure text-error">
                            <CircleParkingOff className="inline-block h-10 w-10 stroke-current" />
                        </div>
                        <div className="stat-title text-lg font-bold text-base-content/80">Blacklisted Vehicles</div>
                        <div className="stat-value text-error">{blacklistedVehicles}</div>
                    </div>

                    <div className="stat p-6">
                        <div className="stat-figure text-accent">
                            <CirclePlusIcon className="inline-block h-10 w-10 stroke-current" />
                        </div>
                        <div className="stat-title text-lg font-bold text-base-content/80">Registration Requests</div>
                        <div className="stat-value text-accent">{unapprovedVehicles.length}</div>
                    </div>

                    <div className="stat p-6">
                        <div className="stat-figure text-accent">
                            <FilePen className="inline-block h-10 w-10 stroke-current" />
                        </div>
                        <div className="stat-title text-lg font-bold text-base-content/80">Edit/Delete Requests</div>
                        <div className="stat-value text-accent">{editDeleteRequests}</div>
                    </div>
                </div>
            </div>


            <div className="shadow-xl m-8 max-w-6xl mx-auto rounded-xl border border-base-300 bg-base-200">
                <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-t-xl">
                    <h3 className="text-2xl font-bold text-white">Registered Vehicles</h3>
                    <p className="text-white/80 mt-2">Quickly add, view, or manage your registered vehicles.</p>
                </div>
                <div className="flex flex-col lg:flex-row w-full justify-center items-center space-y-4 lg:space-y-0 lg:space-x-6 py-8 bg-base-100 rounded-b-xl">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`btn btn-wide shadow-md ${tab.id === "add" ? "btn-primary" : tab.id === "view" ? "btn-secondary" : tab.id === "blacklisted" ? "btn-error" : "btn-accent"}`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon className="h-5 w-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            {activeTab === "add" && <AddVehicleForm />}
            {activeTab === "view" && <VehicleList />}
            {activeTab === "blacklisted" && <BlacklistedVehicleList />}
            {activeTab === "requests" && <VehicleRequestList />}

            <div className="shadow-xl m-8 max-w-6xl mx-auto rounded-xl border border-base-300 bg-base-200">
                <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-t-xl">
                    <h3 className="text-2xl font-bold text-white">Guest Vehicle</h3>
                    <p className="text-white/80 mt-2">Quickly add, view, or manage your guest vehicles.</p>
                </div>
                <div className="flex flex-col lg:flex-row w-full justify-center items-center space-y-4 lg:space-y-0 lg:space-x-6 py-8 bg-base-100 rounded-b-xl">
                    {guestVehicleTabs.map((tab) => (
                        <button
                            key={tab.id}
                            className={`btn btn-wide shadow-md ${tab.id === "add" ? "btn-primary" : tab.id === "view" ? "btn-secondary" : tab.id === "blacklisted" ? "btn-error" : "btn-accent"}`}
                            onClick={() => setGuestActiveTab(tab.id)}
                        >
                            <tab.icon className="h-5 w-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            {guestActiveTab === "add" && <AddGuestVehicleForm />}
            {guestActiveTab === "view" && <GuestVehicleList />}
            {guestActiveTab === "blacklisted" && <BlacklistedGuestVehicleList />}

        </div>
    );
};

export default VehicleManagementPage;
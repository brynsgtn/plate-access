import { useEffect, useState } from "react";
import { UserPlus, Users } from "lucide-react";

import CreateUserForm from "../components/CreateUserForm";
import UserList from "../components/UserList";

import { useUserStore } from "../stores/useUserStore";

const tabs = [
    { id: "create", label: "Add User", icon: UserPlus },
    { id: "users", label: "Users", icon: Users },
];


const UserManagementPage = () => {

    const { fetchAllUsers } = useUserStore();   
    useEffect( () => {
         fetchAllUsers();
    }, [fetchAllUsers]);

    const [activeTab, setActiveTab] = useState("create");
    return (
        <div className='min-h-screen relative overflow-hidden'>
            <div className='relative z-10 container mx-auto px-4 pt-16 mb-10'>
                <h1
                    className='text-4xl font-bold mb-8 text-primary text-center'
                >
                    User Management
                </h1>
                <p className='text-center text-base-content/70'>
                    Manage your users efficiently with our comprehensive tools.
                </p>
            </div>
            <div className='flex justify-center mb-8'>
                <div
                    role="tablist"
                    className="tabs tabs-lift tabs-lg bg-base-100 rounded-xl border-none "
                >
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            role="tab"
                            className={`tab flex items-center gap-2 font-semibold transition-colors duration-200
                                ${activeTab === tab.id
                                    ? "tab-active text-primary border-primary"
                                    : "text-base-content/70 hover:text-primary"
                                }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <tab.icon className="h-5 w-5" />
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>
            {activeTab === "create" && <CreateUserForm />}
            {activeTab === "users" && <UserList />}
        </div>
    )
}

export default UserManagementPage
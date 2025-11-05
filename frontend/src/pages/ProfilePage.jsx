import { Mail, UserCheck, AtSign, Calendar, Shield, MapPin } from "lucide-react";
import dayjs from "dayjs";
import { useUserStore } from "../stores/useUserStore";


const ProfilePage = () => {
    const { user } = useUserStore();

    return (
        <div className="min-h-screen bg-base-200 pt-8 pb-12">
            <div className="max-w-4xl mx-auto px-4">
                {/* Header Section */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-primary mb-2">Profile</h1>
                    <p className="text-base-content/70">Manage your account information</p>
                </div>

                <div className="grid gap-6 lg:grid-cols-3">
                    {/* Profile Card - Takes 2 columns */}
                    <div className="lg:col-span-2 bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden">
                        {/* Header with gradient */}
                        <div className="bg-gradient-to-r from-primary to-secondary p-6">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-2">
                                <Shield className="w-6 h-6" />
                                Account Information
                            </h2>
                        </div>

                        {/* Profile Fields */}
                        <div className="p-6 space-y-6">
                            {/* Username Field */}
                            <div className="group">
                                <label className="text-sm font-semibold text-base-content/70 flex items-center gap-2 mb-2">
                                    <AtSign className="w-4 h-4 text-primary" />
                                    Username
                                </label>
                                <div className="input input-bordered flex items-center bg-base-200 border-2 group-hover:border-primary/30 transition-colors w-full">
                                    <span className="text-base-content font-medium">{user.username}</span>
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="group">
                                <label className="text-sm font-semibold text-base-content/70 flex items-center gap-2 mb-2">
                                    <Mail className="w-4 h-4 text-primary" />
                                    Email Address
                                </label>
                                <div className="input input-bordered flex items-center bg-base-200 border-2 group-hover:border-primary/30 transition-colors  w-full">
                                    <span className="text-base-content font-medium">{user.email}</span>
                                </div>
                            </div>

                            {/* User Role Field */}
                            <div className="group">
                                <label className="text-sm font-semibold text-base-content/70 flex items-center gap-2 mb-2">
                                    <UserCheck className="w-4 h-4 text-primary" />
                                    User Role
                                </label>
                                <div className="input input-bordered flex items-center bg-base-200 border-2 group-hover:border-primary/30 transition-colors w-full">
                                    {user.role === "admin" ? "Admin" : user.role ==="itAdmin" ? "IT Admin" : "Parking Staff"}
                                </div>
                            </div>

                            {/* Branch Field */}
                            <div className="group">
                                <label className="text-sm font-semibold text-base-content/70 flex items-center gap-2 mb-2">
                                    <MapPin className="w-4 h-4 text-primary" />
                                    Branch
                                </label>
                                <div className="input input-bordered flex items-center bg-base-200 border-2 group-hover:border-primary/30 transition-colors w-full">
                                    {user.branch || "N/A"}
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Account Information Card - Takes 1 column */}
                    <div className="lg:col-span-1 space-y-6">
                        {/* Account Status Card */}
                        <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden">
                            <div className="bg-gradient-to-r from-primary to-secondary p-6">
                                <h3 className="text-lg font-bold text-white">Account Status</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-center flex-col gap-2">
                                    <div className="w-16 h-16 rounded-full bg-success/20 flex items-center justify-center">
                                        <UserCheck className="w-8 h-8 text-success" />
                                    </div>
                                    <span className="text-2xl font-bold text-success">Active</span>
                                    <p className="text-sm text-base-content/60 text-center">Your account is in good standing</p>
                                </div>
                            </div>
                        </div>

                        {/* Member Since Card */}
                        <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 overflow-hidden">
                            <div className="bg-gradient-to-r from-primary to-secondary p-6">
                                <h3 className="text-lg font-bold text-white">Member Since</h3>
                            </div>
                            <div className="p-6">
                                <div className="flex items-center justify-center flex-col gap-2">
                                    <div className="w-16 h-16 rounded-full bg-info/20 flex items-center justify-center">
                                        <Calendar className="w-8 h-8 text-info" />
                                    </div>
                                    <span className="text-xl font-bold text-base-content">
                                        {user.createdAt ? dayjs(user.createdAt).format("MMMM D, YYYY") : "N/A"}
                                    </span>
                                    <p className="text-sm text-base-content/60 text-center">
                                        {user.createdAt ? dayjs(user.createdAt).fromNow() : ""}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Quick Stats Section */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="stat bg-base-100 rounded-xl shadow-lg border border-base-300">
                        <div className="stat-figure text-primary">
                            <Shield className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Access Level</div>
                        <div className="stat-value text-primary text-2xl">{user.role === "itAdmin" ? "IT Access" : user.role === "admin" ? "Admin Access" : "Staff Access"}</div>
                        <div className="stat-desc">{user.role !== "parkingStaff" ? "Administrator privileges" : "Staff privileges"}</div>
                    </div>

                    <div className="stat bg-base-100 rounded-xl shadow-lg border border-base-300">
                        <div className="stat-figure text-success">
                            <UserCheck className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Account Status</div>
                        <div className="stat-value text-success text-2xl">Active</div>
                        <div className="stat-desc">All systems operational</div>
                    </div>

                    <div className="stat bg-base-100 rounded-xl shadow-lg border border-base-300">
                        <div className="stat-figure text-info">
                            <Calendar className="w-8 h-8" />
                        </div>
                        <div className="stat-title">Member Duration</div>
                        <div className="stat-value text-info text-2xl">
                            {user.createdAt ? dayjs().diff(dayjs(user.createdAt), 'day') : 0}
                        </div>
                        <div className="stat-desc">Days as a member</div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;

import { Mail, UserCheck, AtSign } from "lucide-react";
import dayjs from "dayjs";
import { useUserStore } from "../stores/useUserStore";


const ProfilePage = () => {

    const { user } = useUserStore();


    return (
        <div className="h-screen pt-15">
            <div className="max-w-2xl mx-auto p-4 py-8">
                <div className="bg-primary rounded-xl p-6 space-y-8">
                    <div className="text-center">
                        <h1 className="text-2xl font-semibold text-primary-content">Profile</h1>
                        <p className="mt-2 text-primary-content">Your profile information</p>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-400 flex items-center gap-2">
                                <AtSign className="w-4 h-4" />
                                Username
                            </div>

                            <div className="flex items-center gap-2 group">
                                <p className="px-4 py-2.5 bg-base-200 rounded-lg flex-grow bg-base-300">
                                    {user.username}
                                </p>
                            </div>

                        </div>

                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-400 flex items-center gap-2">
                                <Mail className="w-4 h-4" />
                                Email Address
                            </div>
                            <p className="px-4 py-2.5 bg-base-100 rounded-lg bg-base-300">{user.email}</p>
                        </div>

                        <div className="space-y-1.5">
                            <div className="text-sm text-zinc-400 flex items-center gap-2">
                                <UserCheck className="w-4 h-4" />
                                User Access
                            </div>
                            <p className="px-4 py-2.5 bg-base-100 rounded-lg bg-base-300">{user.isAdmin ? "Admin" : "Parking Staff"}</p>
                        </div>
                    </div>

                    <div className="mt-6 rounded-xl p-6 bg-accent">
                        <h2 className="text-lg font-medium mb-4 text-accent-content">Account Information</h2>
                        <div className="space-y-3 text-sm">
                            <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                                <span>Member Since</span>
                                <span>  {user.createdAt
                                    ? dayjs(user.createdAt).format("MMMM D, YYYY")
                                    : ""}</span>
                            </div>
                            <div className="flex items-center justify-between py-2">
                                <span>Account Status</span>
                                <span className="text-green-500">Active</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
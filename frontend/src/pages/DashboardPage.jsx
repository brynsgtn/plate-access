import { Activity, Camera, Shield, Users, TrendingUp, Eye, Lock, Unlock, UserPlus, AlertTriangle, Ban, DoorOpen, CameraOffIcon } from 'lucide-react';


const DashboardPage = () => {
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
                        <div className="w-50 h-1 bg-gradient-to-r from-primary to-secondary mx-auto mt-6 rounded-full"></div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 mb-12">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-t-xl">
                        <h1 className="text-2xl font-bold text-white">System Summary</h1>
                    </div>

                    {/* Stats */}
                    <div className="stats stats-vertical lg:stats-horizontal w-full bg-base-100 p-6 rounded-b-xl shadow-xl">

                        {/* Total Access */}
                        <div className="stat p-6">
                            <div className="stat-figure text-primary">
                                <Activity className="inline-block h-10 w-10 stroke-current" />
                            </div>
                            <div className="stat-title text-lg font-bold text-base-content/80">Access Today</div>
                            <div className="stat-value text-primary">247</div>
                            <div className="stat-desc text-base-content/70">+12% from yesterday</div>
                        </div>

                        {/* Entries */}
                        <div className="stat p-6">
                            <div className="stat-figure text-secondary">
                                <TrendingUp className="inline-block h-10 w-10 stroke-current" />
                            </div>
                            <div className="stat-title text-lg font-bold text-base-content/80">Entries</div>
                            <div className="stat-value text-secondary">134</div>
                            <div className="stat-desc text-base-content/70">Peak: 2:00 PM</div>
                        </div>

                        {/* Exits */}
                        <div className="stat p-6">
                            <div className="stat-figure text-accent">
                                <Users className="inline-block h-10 w-10 stroke-current" />
                            </div>
                            <div className="stat-title text-lg font-bold text-base-content/80">Exits</div>
                            <div className="stat-value text-accent">113</div>
                            <div className="stat-desc text-base-content/70">Last: 3:45 PM</div>
                        </div>

                        {/* Alerts */}
                        <div className="stat p-6">
                            <div className="stat-figure text-error">
                                <AlertTriangle className="inline-block h-10 w-10 stroke-current" />
                            </div>
                            <div className="stat-title text-lg font-bold text-base-content/80">Active Alerts</div>
                            <div className="stat-value text-error">3</div>
                            <div className="stat-desc text-base-content/70">Requires attention</div>
                        </div>

                        {/* Recognition Rate */}
                        <div className="stat p-6">
                            <div className="stat-figure text-primary">
                                <Shield className="inline-block h-10 w-10 stroke-current" />
                            </div>
                            <div className="stat-title text-lg font-bold text-base-content/80">Recognition Rate</div>
                            <div className="stat-value text-primary">99.2%</div>
                            <div className="stat-desc text-base-content/70">Excellent performance</div>
                        </div>
                    </div>
                </div>



                {/* System Status */}
                <div className="max-w-7xl mx-auto px-4 mb-12">
                    {/* Section Header */}
                    <div className="bg-gradient-to-r from-primary to-secondary p-5 rounded-t-xl ">
                        <h1 className="text-2xl font-bold text-white flex items-center">
                            <Eye className="mr-3 h-6 w-6" />
                            System Status
                        </h1>
                    </div>

                    {/* Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1 shadow-2xl rounded-b-2xl ">
                        {/* Entrance Section */}
                        <div className="bg-base-100 rounded-b-2xl  p-6 space-y-4 hover:shadow-md transition-shadow duration-300">


                            {/* Entrance Gate */}
                            <div className="p-4 bg-base-200 rounded-lg flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-base-content">Entrance Gate</h3>
                                    <span className="text-sm font-medium flex items-center text-green-600 gap-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        OPEN
                                    </span>
                                </div>
                                <p className="text-xs text-base-content/70">Last action: 2:34 PM</p>
                            </div>

                            {/* Entrance Camera */}
                            <div className='bg-base-200 p-4 rounded-lg'>
                                <div className="flex items-center justify-between ">
                                    <h3 className="font-semibold text-base-content">Entrance Camera</h3>
                                    <span className="text-sm font-medium flex items-center text-green-600 gap-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        ACTIVE
                                    </span>
                                </div>

                                <p className="text-xs text-base-content/70">1920x1080 • 30 FPS</p>
                            </div>
                            {/* Video Placeholder */}
                            <div className="rounded-lg  ">
                                <div className="mt-2 w-full aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-600 dark:text-gray-300">Video Feed</span>
                                </div>
                            </div>
                        </div>

                        {/* Exit Section */}
                        <div className="bg-base-100 rounded-b-2xl  p-6 space-y-4 hover:shadow-md transition-shadow duration-300">



                            {/* Exit Gate */}
                            <div className="p-4 bg-base-200 rounded-lg flex flex-col gap-1">
                                <div className="flex items-center justify-between">
                                    <h3 className="font-semibold text-base-content">Exit Gate</h3>
                                    <span className="text-sm font-medium flex items-center text-red-600 gap-1">
                                        <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                                        CLOSED
                                    </span>
                                </div>

                                <p className="text-xs text-base-content/70">Last action: 3:12 PM</p>
                            </div>

                            {/* Exit Camera */}
                            <div className='bg-base-200 p-4 rounded-lg'>
                                <div className="flex items-center justify-between ">
                                    <h3 className="font-semibold text-base-content">Exit Camera</h3>
                                    <span className="text-sm font-medium flex items-center text-green-600 gap-1">
                                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                                        ACTIVE
                                    </span>
                                </div>

                                <p className="text-xs text-base-content/70">1920x1080 • 30 FPS</p>
                            </div>
                            {/* Video Placeholder */}
                            <div className="rounded-lg  ">
                                <div className="mt-2 w-full aspect-video bg-gray-300 dark:bg-gray-700 rounded-lg flex items-center justify-center">
                                    <span className="text-gray-600 dark:text-gray-300">Video Feed</span>
                                </div>
                            </div>
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
                                    Recent Access Logs
                                </h2>
                            </div>
                            <div className="p-2 space-y-4">
                                <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border-l-4 border-green-500">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
                                        <div>
                                            <p className="font-semibold text-base-content">ABC-123</p>
                                            <p className="text-sm text-base-content/70">Entry • 3:45 PM</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-green-100 text-green-800 text-xs font-medium rounded-full">ENTRY</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl border-l-4 border-orange-500">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                                        <div>
                                            <p className="font-semibold text-base-content">XYZ-789</p>
                                            <p className="text-sm text-base-content/70">Exit • 3:42 PM</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-orange-100 text-orange-800 text-xs font-medium rounded-full">EXIT</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-error/50 rounded-xl border-l-4 border-error">
                                    <div className="flex items-center">
                                        <div className="w-2 h-2 bg-error rounded-full mr-3"></div>
                                        <div>
                                            <p className="font-semibold text-base-content">XYZ-789</p>
                                            <p className="text-sm text-base-content/70">Failed • 3:42 PM</p>
                                        </div>
                                    </div>
                                    <span className="px-3 py-1 bg-error/10 text-error/80 text-xs font-medium rounded-full">EXIT</span>
                                </div>
                            </div>
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
                            </div>
                                <div className="p-6 space-y-4">
                                    <div className="p-4 bg-yellow-50 rounded-xl border border-yellow-300">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start">
                                                <AlertTriangle className="h-5 w-5 text-yellow-600 mr-3 mt-0.5" />
                                                <div>
                                                    <p className="font-semibold text-yellow-800">Low Confidence Reading</p>
                                                    <p className="text-sm text-yellow-700">Plate: MNO-321 (68%)</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-yellow-600">2 min ago</span>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Blacklist Alerts */}
                            <div className="bg-base-100 rounded-2xl shadow-lg border border-base-300">
                            <div className="bg-gradient-to-r from-primary to-secondary p-5 rounded-t-xl mb-4">
                                <h2 className="text-2xl font-bold text-white flex items-center">
                                    <Ban className="mr-3 h-5 w-5 text-white" />
                                    Blacklist Alerts
                                </h2>
                            </div>
                                <div className="p-6 space-y-4">
                                    <div className="p-4 bg-red-50 rounded-xl border border-red-300">
                                        <div className="flex items-start justify-between">
                                            <div className="flex items-start">
                                                <Ban className="h-5 w-5 text-red-600 mr-3 mt-0.5" />
                                                <div>
                                                    <p className="font-semibold text-red-800">Blacklisted Vehicle</p>
                                                    <p className="text-sm text-red-700">Plate: STU-999 - Access Denied</p>
                                                </div>
                                            </div>
                                            <span className="text-xs text-red-600">15 min ago</span>
                                        </div>
                                    </div>
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
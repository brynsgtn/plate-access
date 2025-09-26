import { useState } from 'react';
import {
    DoorOpen,
    DoorClosed,
    Unlock,
    Lock,
    Shield,
    Camera,
    CameraOffIcon,
} from 'lucide-react';
import { useGateStore } from '../stores/useGateStore';

const AccessControlPage = () => {

    const isEntranceGateOpen = useGateStore((s) => s.isEntranceGateOpen);
    const isExitGateOpen = useGateStore((s) => s.isExitGateOpen);
    const setIsEntranceGateOpen = useGateStore((s) => s.setIsEntranceGateOpen);
    const setIsExitGateOpen = useGateStore((s) => s.setIsExitGateOpen);

    // Local state for animations and UI
    const [entranceGate, setEntranceGate] = useState(isEntranceGateOpen ? 'open' : 'closed');
    const [exitGate, setExitGate] = useState(isExitGateOpen ? 'open' : 'closed');
    const [lastActivity, setLastActivity] = useState(null);
    const [gateAttempting, setGateAttempting] = useState({ entrance: false, exit: false });


    // Gate operation functions
    const operateGate = (gateType, action) => {
        const setGate = gateType === 'entrance' ? setEntranceGate : setExitGate;
        const currentState = gateType === 'entrance' ? entranceGate : exitGate;
        const setStoreGate = gateType === 'entrance' ? setIsEntranceGateOpen : setIsExitGateOpen;

        if (action === 'open' && currentState === 'closed') {
            setGate('opening');
            setLastActivity({ type: gateType, action: 'opening', time: new Date().toLocaleTimeString() });
            setTimeout(() => {
                setGate('open');
                setStoreGate(true); // Update store state
            }, 1500);
        } else if (action === 'close' && currentState === 'open') {
            setGate('closing');
            setLastActivity({ type: gateType, action: 'closing', time: new Date().toLocaleTimeString() });
            setTimeout(() => {
                setGate('closed');
                setStoreGate(false); // Update store state
            }, 1500);
        }
    };
    const handleLPRResult = async (gateType, success) => {
        // Mark LPR as attempting
        setGateAttempting(prev => ({ ...prev, [gateType]: true }));

        setLastActivity({ type: gateType, action: 'verifying', time: new Date().toLocaleTimeString() });

        // Simulate LPR verification delay (e.g., API call)
        setTimeout(() => {
            setGateAttempting(prev => ({ ...prev, [gateType]: false }));

            if (success) {
                // Force open immediately
                if (gateType === 'entrance') {
                    setEntranceGate('opening');
                    setTimeout(() => {
                        setEntranceGate('open');
                        setIsEntranceGateOpen(true);

                        // Auto-close after 5 sec
                        setTimeout(() => {
                            setEntranceGate('closing');
                            setTimeout(() => {
                                setEntranceGate('closed');
                                setIsEntranceGateOpen(false);
                            }, 1500); // closing animation
                        }, 5000);
                    }, 1500); // opening animation
                } else {
                    setExitGate('opening');
                    setTimeout(() => {
                        setExitGate('open');
                        setIsExitGateOpen(true);

                        // Auto-close after 5 sec
                        setTimeout(() => {
                            setExitGate('closing');
                            setTimeout(() => {
                                setExitGate('closed');
                                setIsExitGateOpen(false);
                            }, 1500);
                        }, 5000);
                    }, 1500);
                }
            } else {
                alert(`${gateType} LPR failed! Access denied.`);
            }
        }, 2000);
    };


    // Emergency controls
    const openAllGates = () => {
        if (entranceGate === 'closed') {
            operateGate('entrance', 'open');
        }
        if (exitGate === 'closed') {
            operateGate('exit', 'open');
        }
        setLastActivity({ type: 'emergency', action: 'opening all gates', time: new Date().toLocaleTimeString() });
    };

    const closeAllGates = () => {
        if (entranceGate === 'open') {
            operateGate('entrance', 'close');
        }
        if (exitGate === 'open') {
            operateGate('exit', 'close');
        }
        setLastActivity({ type: 'emergency', action: 'closing all gates', time: new Date().toLocaleTimeString() });
    };

    const GateVisual = ({ type, gateState, onOpen, onClose }) => {
        const isEntrance = type === 'entrance';
        const gateColor = gateState === 'open' ? 'bg-green-500' : gateState === 'opening' || gateState === 'closing' ? 'bg-yellow-500' : 'bg-red-500';

        return (
            <div className="bg-base-100 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-base-content flex items-center">
                        {isEntrance ? <DoorOpen className="mr-2 h-5 w-5" /> : <DoorClosed className="mr-2 h-5 w-5" />}
                        {isEntrance ? 'Entrance Gate' : 'Exit Gate'}
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${gateAttempting[type] ? 'bg-yellow-200 text-yellow-800' :
                        gateState === 'open' ? 'bg-green-100 text-green-800' :
                            gateState === 'opening' || gateState === 'closing' ? 'bg-yellow-100 text-yellow-800' :
                                'bg-red-100 text-red-800'
                        }`}>
                        {gateAttempting[type] ? 'ATTEMPTING' : gateState.toUpperCase()}
                    </div>
                </div>

                {/* Gate Simulation Visual */}
                <div className="relative h-80 rounded-xl mb-6">
                    {/* Gate Structure */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="relative">
                            {/* Left Gate Post */}
                            <div className="absolute -left-4 top-1/2 w-4 h-24 bg-gray-700 rounded-lg transform -translate-y-1/2"></div>

                            {/* Right Gate Post */}
                            <div className="absolute -right-6 top-1/2 w-4 h-24 bg-gray-700 rounded-lg transform -translate-y-1/2"></div>

                            {/* Gate Barrier */}
                            <div
                                className={`w-60 h-3 ${gateColor} rounded-full transition-all duration-1500 transform origin-left ${gateState === 'open' ? '-rotate-90 translate-x-2 -translate-y-14' :
                                    gateState === 'opening' ? '-rotate-45 translate-x-1 -translate-y-7' :
                                        gateState === 'closing' ? '-rotate-45 translate-x-1 -translate-y-7' :
                                            'rotate-0'
                                    } shadow-lg`}
                            >
                                {/* Barrier stripes */}
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 transform skew-x-12"></div>

                                {/* Animation indicator */}
                                {(gateState === 'opening' || gateState === 'closing') && (
                                    <div className="absolute inset-0 bg-yellow-300 rounded-full animate-pulse opacity-50"></div>
                                )}

                                {/* Status light */}
                                <div className={`absolute -right-2 top-1/2 w-2 h-2 rounded-full transform -translate-y-1/2 ${gateState === 'open' ? 'bg-green-400' :
                                    gateState === 'opening' || gateState === 'closing' ? 'bg-yellow-400 animate-pulse' :
                                        'bg-red-400'
                                    } shadow-lg`}></div>
                            </div>

                            {/* Control Box */}
                            <div className="absolute -left-8 -bottom-8 w-6 h-8 bg-gray-600 rounded-sm">
                                <div className={`w-1 h-1 rounded-full mx-auto mt-1 ${gateState === 'open' ? 'bg-green-400' :
                                    gateState === 'opening' || gateState === 'closing' ? 'bg-yellow-400 animate-pulse' :
                                        'bg-red-400'
                                    }`}></div>
                            </div>
                        </div>
                    </div>
                </div>
                {/* Controls */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={onOpen}
                            disabled={gateState !== 'closed'}
                            className="btn btn-success btn-sm flex items-center justify-center gap-2"
                        >
                            <Unlock className="h-4 w-4" />
                            Open
                        </button>
                        <button
                            onClick={onClose}
                            disabled={gateState !== 'open'}
                            className="btn btn-error btn-sm flex items-center justify-center gap-2"
                        >
                            <Lock className="h-4 w-4" />
                            Close
                        </button>
                    </div>

                    {/* Status Indicators */}
                    {/* <div className="flex justify-between text-sm">
                        <div className="flex items-center">
                            {gateState === 'open' ? (
                                <CheckCircle className="h-4 w-4 mr-1 text-green-500" />
                            ) : gateState === 'opening' || gateState === 'closing' ? (
                                <Clock className="h-4 w-4 mr-1 text-yellow-500 animate-spin" />
                            ) : (
                                <AlertCircle className="h-4 w-4 mr-1 text-red-500" />
                            )}
                            <span className="text-base-content/70">
                                Status: {gateState === 'opening' ? 'Opening...' : gateState === 'closing' ? 'Closing...' : gateState}
                            </span>
                        </div>
                    </div> */}
                </div>

            </div>
        );
    };

    return (
        <div className="min-h-screen relative overflow-hidden bg-base-100">
            <div className="relative z-10 container mx-auto px-4 pt-16 mb-10 max-w-6xl">
                <h1 className="text-4xl font-bold mb-8 text-primary drop-shadow autumn-gradient-text text-center">
                    Access Controls
                </h1>
                <p className="text-center text-base-content/70">
                    Control and manage the entry and exit gates and Cameras for your vehicle access system.
                </p>
            </div>

            <div className="mb-5 max-w-6xl mx-auto">
                <div className="flex flex-wrap items-center justify-between gap-4">
                    {lastActivity && (
                        <div className="badge badge-primary badge-lg text-xs">
                            Last Activity: {lastActivity.type} gate {lastActivity.action} at {lastActivity.time}
                        </div>
                    )}
                </div>
            </div>
            <div>
                <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-t-xl max-w-6xl mx-auto shadow-2xl">
                    <h3 className="text-2xl font-bold text-white">Gate Controls</h3>
                    <p className="text-white/80 mt-2">Control and manage the entry and exit gates for your vehicle access system.</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-2 max-w-6xl mx-auto shadow-2xl rounded-b-2xl">

                    <GateVisual
                        type="entrance"
                        gateState={entranceGate}
                        onOpen={() => operateGate('entrance', 'open')}
                        onClose={() => operateGate('entrance', 'close')}
                    />

                    <GateVisual
                        type="exit"
                        gateState={exitGate}
                        onOpen={() => operateGate('exit', 'open')}
                        onClose={() => operateGate('exit', 'close')}
                    />
                </div>


                {/* Emergency Controls */}

                <div className="bg-base-100 rounded-b-xl p-5 max-w-6xl mx-auto shadow-2xl">
                    <h3 className="font-semibold mb-5 flex items-center text-base-content">
                        <Shield className="mr-2 h-4 w-4" />
                        Emergency Controls
                    </h3>
                    <div className="grid lg:grid-cols-2 gap-3 p-5">
                        <button
                            onClick={openAllGates}
                            className="btn btn-warning flex items-center justify-center gap-2"
                        >
                            <Unlock className="h-4 w-4" />
                            Open All
                        </button>
                        <button
                            onClick={closeAllGates}
                            className="btn btn-error flex items-center justify-center gap-2"
                        >
                            <Lock className="h-4 w-4" />
                            Close All
                        </button>
                        <button onClick={() => handleLPRResult('exit', true)} className="btn btn-success">
                            Simulate Entrance LPR Success
                        </button>

                        <button onClick={() => handleLPRResult('entrance', false)} className="btn btn-error">
                            Simulate Entrance LPR Fail
                        </button>

                    </div>
                </div>
            </div>








            {/* Camera Controls */}
            <div className="max-w-6xl mb-12 mx-auto mt-10">
                <div className="bg-gradient-to-r from-primary to-secondary p-5 rounded-t-xl">
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        <Camera className="mr-2 h-5 w-5" />
                        Camera Controls
                    </h2>
                </div>
                <div className="bg-base-100 rounded-b-xl shadow-lg">
                    <div className="p-5">
                        <div className="grid lg:grid-cols-2 gap-6 bg-base-100 rounded-b-xl p-5">
                            {/* Entrance Cameras */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center text-base-content">
                                    <Camera className="mr-2 h-4 w-4" />
                                    Entrance
                                </h3>
                                <div className="flex flex-col gap-3">
                                    <button className="btn btn-success flex items-center justify-center gap-2">
                                        <Camera className="mr-2 h-5 w-5" />
                                        Open
                                    </button>
                                    <button className="btn btn-error flex items-center justify-center gap-2">
                                        <CameraOffIcon className="mr-2 h-5 w-5" />
                                        Close
                                    </button>
                                </div>
                            </div>

                            {/* Exit Cameras */}
                            <div>
                                <h3 className="font-semibold mb-3 flex items-center text-base-content">
                                    <Camera className="mr-2 h-4 w-4" />
                                    Exit
                                </h3>
                                <div className="flex flex-col gap-3">
                                    <button className="btn btn-success flex items-center justify-center gap-2">
                                        <Camera className="mr-2 h-5 w-5" />
                                        Open
                                    </button>
                                    <button className="btn btn-error flex items-center justify-center gap-2">
                                        <CameraOffIcon className="mr-2 h-5 w-5" />
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Manual Entry Controls Section */}
            <div className="max-w-6xl mx-auto rounded-xl mb-12">
                {/* Section Header */}
                <div>
                    <div className="bg-gradient-to-r from-primary to-secondary p-5 rounded-t-xl">
                        <h2 className="text-2xl font-bold text-white flex items-center">
                            <Shield className="mr-3 h-5 w-5" />
                            Manual Entry Controls
                        </h2>
                    </div>

                    <div className='grid lg:grid-cols-2 gap-3 shadow-2xl rounded-b-2xl bg-base-100'>
                        {/* Add Guest Vehicle */}
                        <div className="p-5">
                            <h3 className="font-semibold mb-3 flex items-center text-base-content">
                                Add Guest Vehicle
                            </h3>
                            <input
                                type="text"
                                placeholder="Plate Number"
                                className="input input-bordered w-full mb-3"
                            />
                            <input
                                type="text"
                                placeholder="Make and Model"
                                className="input input-bordered w-full mb-3"
                            />
                            <input
                                type="text"
                                placeholder="Owner's Name"
                                className="input input-bordered w-full mb-3"
                            />
                            <button className="btn btn-primary w-full">Authorize Vehicle</button>
                        </div>
                        {/* Manual Plate Entry */}
                        <div className="p-5">
                            <label
                                htmlFor="license-plate"
                                className="font-semibold mb-3 flex items-center text-base-content"
                            >
                                Manual License Plate Entry
                            </label>
                            <input
                                type="text"
                                id="license-plate"
                                placeholder="Enter license plate number"
                                className="input input-bordered w-full mb-4"
                            />
                            <button className="btn btn-primary w-full">Verify</button>
                        </div>

                    </div>

                </div>
            </div>

        </div>
    );
};

export default AccessControlPage;
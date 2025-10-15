import { useEffect, useState } from 'react';
import {
    DoorOpen,
    DoorClosed,
    Unlock,
    Lock,
    Shield,
    Camera,
    Clock,
    AlertCircle,
    CheckCircle,
    LogIn,
    LogOut
} from 'lucide-react';
import { useGateStore } from '../stores/useGateStore';
import { useLogStore } from '../stores/useLogStore';
import { useGuestVehicleStore } from '../stores/useGuestVehicleStore';
import { useUserStore } from '../stores/useUserStore';

const AccessControlPage = () => {
    // Gate store states
    const isEntranceGateOpen = useGateStore(s => s.isEntranceGateOpen);
    const isExitGateOpen = useGateStore(s => s.isExitGateOpen);
    const setIsEntranceGateOpen = useGateStore(s => s.setIsEntranceGateOpen);
    const setIsExitGateOpen = useGateStore(s => s.setIsExitGateOpen);
    const initCrossTabSync = useGateStore(s => s.initCrossTabSync);
    const { listenLiveLogs } = useGateStore();
    const lastEntranceAction = useGateStore(s => s.lastEntranceAction);
    const lastExitAction = useGateStore(s => s.lastExitAction);

    // Transition states for animation
    const [entranceTransition, setEntranceTransition] = useState(null); // 'opening' | 'closing' | null
    const [exitTransition, setExitTransition] = useState(null);

    // UI state
    const [lastActivity, setLastActivity] = useState(null);
    const [gateAttempting, setGateAttempting] = useState({ entrance: false, exit: false });
    const [manualPlate, setManualPlate] = useState('');
    const [lprEntryPlate, setLprEntryPlate] = useState('');
    const [lprExitPlate, setLprExitPlate] = useState('');

    // Log store
    const { manualEntryLogAttempt, manualExitLogAttempt, lprEntryLogAttempt, lprExitLogAttempt } = useLogStore();
    const { addGuestVehicle } = useGuestVehicleStore();
    const { user } = useUserStore();
    const [guestVehicleData, setGuestVehicleData] = useState({
        plateNumber: "",
        makeModel: "",
        ownerName: "",
    });

    // Compute current gate state for UI
    const entranceGateState = entranceTransition || (isEntranceGateOpen ? 'open' : 'closed');
    const exitGateState = exitTransition || (isExitGateOpen ? 'open' : 'closed');

    // Initialize cross-tab sync and live logs
    useEffect(() => {
        initCrossTabSync();
        listenLiveLogs();
    }, [initCrossTabSync, listenLiveLogs]);

    // Update last activity on store change
    useEffect(() => {
        if (lastEntranceAction) setLastActivity({ type: 'entrance', ...lastEntranceAction });
    }, [lastEntranceAction]);

    useEffect(() => {
        if (lastExitAction) setLastActivity({ type: 'exit', ...lastExitAction });
    }, [lastExitAction]);

    // Gate operations
    const operateGate = (gateType, action) => {
        const setTransition = gateType === 'entrance' ? setEntranceTransition : setExitTransition;
        const setStoreGate = gateType === 'entrance' ? setIsEntranceGateOpen : setIsExitGateOpen;
        const isOpen = gateType === 'entrance' ? isEntranceGateOpen : isExitGateOpen;

        if (action === 'open' && !isOpen) {
            setTransition('opening');
            setLastActivity({ type: gateType, action: 'opening', time: new Date().toLocaleTimeString() });
            setTimeout(() => {
                setTransition(null);
                setStoreGate(true);
            }, 1500);
        } else if (action === 'close' && isOpen) {
            setTransition('closing');
            setLastActivity({ type: gateType, action: 'closing', time: new Date().toLocaleTimeString() });
            setTimeout(() => {
                setTransition(null);
                setStoreGate(false);
            }, 1500);
        }
    };

    // Manual and LPR attempts (generic function)
    const handleGateAttempt = async (attemptFn, plateNumber, gateType, successAction, failAction) => {
        setGateAttempting(prev => ({ ...prev, [gateType]: true }));
        setLastActivity({ type: gateType, action: `verifying ${gateType} access`, time: new Date().toLocaleTimeString() });

        setTimeout(async () => {
            setGateAttempting(prev => ({ ...prev, [gateType]: false }));

            const result = await attemptFn({ plateNumber });
            if (result.success) {
                const setStoreGate = gateType === 'entrance' ? setIsEntranceGateOpen : setIsExitGateOpen;
                const setTransition = gateType === 'entrance' ? setEntranceTransition : setExitTransition;
                setTransition('opening');
                setTimeout(() => {
                    setTransition(null);
                    setStoreGate(true);
                    setLastActivity({ type: gateType, action: successAction, time: new Date().toLocaleTimeString() });

                    setTimeout(() => {
                        setTransition('closing');
                        setTimeout(() => {
                            setTransition(null);
                            setStoreGate(false);
                        }, 1500);
                    }, 5000);
                }, 1500);
            } else {
                setLastActivity({ type: gateType, action: failAction, time: new Date().toLocaleTimeString() });
            }
        }, 2000);
    };

    const manualEntryAttemptHandler = (plate) => handleGateAttempt(manualEntryLogAttempt, plate, 'entrance', 'manual entry success', 'manual entry failed');
    const manualExitAttemptHandler = (plate) => handleGateAttempt(manualExitLogAttempt, plate, 'exit', 'manual exit success', 'manual exit failed');
    const LPREntryAttemptHandler = (plate) => handleGateAttempt(lprEntryLogAttempt, plate, 'entrance', 'LPR entrance success', 'LPR entrance failed');
    const LPRExitAttemptHandler = (plate) => handleGateAttempt(lprExitLogAttempt, plate, 'exit', 'LPR exit success', 'LPR exit failed');

    // Guest vehicle addition and entry
    const addAndAuthorizeGuestVehicleHandler = async (vehicle) => {
        try {
            const result = await addGuestVehicle(vehicle);
            if (result.success) manualEntryAttemptHandler(vehicle.plateNumber);
        } catch (error) {
            console.error("Error adding and authorizing guest vehicle:", error);
        } finally {
            setGuestVehicleData({ plateNumber: "", makeModel: "", ownerName: "" });
        }
    };

    // Emergency controls
    const openAllGates = () => {
        if (!isEntranceGateOpen) operateGate('entrance', 'open');
        if (!isExitGateOpen) operateGate('exit', 'open');
        setLastActivity({ type: 'emergency', action: 'opening all gates', time: new Date().toLocaleTimeString() });
    };

    const closeAllGates = () => {
        if (isEntranceGateOpen) operateGate('entrance', 'close');
        if (isExitGateOpen) operateGate('exit', 'close');
        setLastActivity({ type: 'emergency', action: 'closing all gates', time: new Date().toLocaleTimeString() });
    };

    // Gate visual component
    const GateVisual = ({ type, gateState, onOpen, onClose }) => {
        const isEntrance = type === 'entrance';
        const gateColor = gateState === 'open' ? 'bg-green-500' : gateState === 'opening' || gateState === 'closing' ? 'bg-yellow-500' : 'bg-red-500';

        return (
            <div className="bg-base-100 p-8">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-base-content flex items-center">
                        {isEntrance ? <DoorOpen className="mr-2 h-5 w-5" /> : <DoorClosed className="mr-2 h-5 w-5" />}
                        {isEntrance ? 'Entrance Gate' : 'Exit Gate'}
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${gateAttempting[type] ? 'bg-yellow-200 text-yellow-800' :
                        gateState === 'open' ? 'bg-green-100 text-green-800' :
                        gateState === 'opening' || gateState === 'closing' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'}`}>
                        {gateAttempting[type] ? 'ATTEMPTING' : gateState.toUpperCase()}
                    </div>
                </div>

                {/* Gate Simulation */}
                <div className="relative h-80 rounded-xl mb-6">
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="relative">
                            <div className="absolute -left-4 top-1/2 w-4 h-24 bg-gray-700 rounded-lg transform -translate-y-1/2"></div>
                            <div className="absolute -right-6 top-1/2 w-4 h-24 bg-gray-700 rounded-lg transform -translate-y-1/2"></div>
                            <div
                                className={`w-60 h-3 ${gateColor} rounded-full transition-all duration-1500 transform origin-left ${gateState === 'open' ? '-rotate-90 translate-x-2 -translate-y-14' :
                                    gateState === 'opening' ? '-rotate-45 translate-x-1 -translate-y-7' :
                                    gateState === 'closing' ? '-rotate-45 translate-x-1 -translate-y-7' :
                                    'rotate-0'} shadow-lg`}>
                                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-30 transform skew-x-12"></div>
                                {(gateState === 'opening' || gateState === 'closing') && (
                                    <div className="absolute inset-0 bg-yellow-300 rounded-full animate-pulse opacity-50"></div>
                                )}
                                <div className={`absolute -right-2 top-1/2 w-2 h-2 rounded-full transform -translate-y-1/2 ${gateState === 'open' ? 'bg-green-400' :
                                    gateState === 'opening' || gateState === 'closing' ? 'bg-yellow-400 animate-pulse' :
                                    'bg-red-400'} shadow-lg`}></div>
                            </div>
                            <div className="absolute -left-8 -bottom-8 w-6 h-8 bg-gray-600 rounded-sm">
                                <div className={`w-1 h-1 rounded-full mx-auto mt-1 ${gateState === 'open' ? 'bg-green-400' :
                                    gateState === 'opening' || gateState === 'closing' ? 'bg-yellow-400 animate-pulse' :
                                    'bg-red-400'}`}></div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Controls */}
                <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-3">
                        <button onClick={onOpen} disabled={gateState !== 'closed'} className="btn btn-success btn-sm flex items-center justify-center gap-2">
                            <Unlock className="h-4 w-4" /> Open
                        </button>
                        <button onClick={onClose} disabled={gateState !== 'open'} className="btn btn-error btn-sm flex items-center justify-center gap-2">
                            <Lock className="h-4 w-4" /> Close
                        </button>
                    </div>
                    <div className="flex justify-between text-sm">
                        <div className="flex items-center">
                            {gateState === 'open' ? <CheckCircle className="h-4 w-4 mr-1 text-green-500" /> :
                                gateState === 'opening' || gateState === 'closing' ? <Clock className="h-4 w-4 mr-1 text-yellow-500 animate-spin" /> :
                                    <AlertCircle className="h-4 w-4 mr-1 text-red-500" />}
                            <span className="text-base-content/70">Status: {gateState === 'opening' ? 'Opening...' : gateState === 'closing' ? 'Closing...' : gateState}</span>
                        </div>
                    </div>
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

            <div className="max-w-6xl mx-auto shadow-2xl rounded-2xl overflow-hidden">
                <div className="bg-gradient-to-r from-primary to-secondary p-6">
                    <h3 className="text-2xl font-bold text-white">Gate Simulation and Controls</h3>
                </div>

                <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <GateVisual type="entrance" gateState={entranceGateState} onOpen={() => operateGate('entrance', 'open')} onClose={() => operateGate('entrance', 'close')} />
                    <GateVisual type="exit" gateState={exitGateState} onOpen={() => operateGate('exit', 'open')} onClose={() => operateGate('exit', 'close')} />
                </div>

                <div className="p-6 border-t border-base-200 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-lg font-bold mb-2">Manual Entrance</h4>
                        <input type="text" value={manualPlate} onChange={(e) => setManualPlate(e.target.value)} placeholder="Enter plate number" className="input input-bordered w-full mb-2" />
                        <button onClick={() => manualEntryAttemptHandler(manualPlate)} className="btn btn-primary btn-sm w-full">Authorize Entry</button>
                    </div>

                    <div>
                        <h4 className="text-lg font-bold mb-2">Manual Exit</h4>
                        <input type="text" value={manualPlate} onChange={(e) => setManualPlate(e.target.value)} placeholder="Enter plate number" className="input input-bordered w-full mb-2" />
                        <button onClick={() => manualExitAttemptHandler(manualPlate)} className="btn btn-primary btn-sm w-full">Authorize Exit</button>
                    </div>
                </div>

                <div className="p-6 border-t border-base-200 grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div>
                        <h4 className="text-lg font-bold mb-2">Emergency Controls</h4>
                        <button onClick={openAllGates} className="btn btn-success btn-sm w-full mb-2">Open All Gates</button>
                        <button onClick={closeAllGates} className="btn btn-error btn-sm w-full">Close All Gates</button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AccessControlPage;

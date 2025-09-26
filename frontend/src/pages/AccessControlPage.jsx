import React, { useState } from 'react';
import {
    DoorOpen,
    DoorClosed,
    Unlock,
    Lock,
    Shield,
    Activity,
    AlertCircle,
    CheckCircle,
    Clock
} from 'lucide-react';

const AccessControlPage = () => {
    const [entranceGate, setEntranceGate] = useState('closed');
    const [exitGate, setExitGate] = useState('closed');
    const [lastActivity, setLastActivity] = useState(null);

    // Gate operation functions
    const operateGate = (gateType, action) => {
        const setGate = gateType === 'entrance' ? setEntranceGate : setExitGate;
        const currentState = gateType === 'entrance' ? entranceGate : exitGate;

        if (action === 'open' && currentState === 'closed') {
            setGate('opening');
            setLastActivity({ type: gateType, action: 'opening', time: new Date().toLocaleTimeString() });
            setTimeout(() => setGate('open'), 1500);
        } else if (action === 'close' && currentState === 'open') {
            setGate('closing');
            setLastActivity({ type: gateType, action: 'closing', time: new Date().toLocaleTimeString() });
            setTimeout(() => setGate('closed'), 1500);
        }
    };

    const GateVisual = ({ type, gateState, onOpen, onClose }) => {
        const isEntrance = type === 'entrance';
        const gateColor = gateState === 'open' ? 'bg-green-500' : gateState === 'opening' || gateState === 'closing' ? 'bg-yellow-500' : 'bg-red-500';

        return (
            <div className="bg-base-100 rounded-2xl shadow-xl border border-base-300 p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-bold text-base-content flex items-center">
                        {isEntrance ? <DoorOpen className="mr-2 h-5 w-5" /> : <DoorClosed className="mr-2 h-5 w-5" />}
                        {isEntrance ? 'Entrance Gate' : 'Exit Gate'}
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-medium ${gateState === 'open' ? 'bg-green-100 text-green-800' :
                        gateState === 'opening' || gateState === 'closing' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-red-100 text-red-800'
                        }`}>
                        {gateState.toUpperCase()}
                    </div>
                </div>

                {/* Gate Simulation Visual */}
                <div className="relative h-80 rounded-xl  mb-6">
                    {/* Gate Structure */}
                    <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2">
                        <div className="relative">
                            {/* Left Gate Post */}
                            <div className="absolute -left-4 top-1/2 w-4 h-24 bg-gray-700 rounded-lg transform -translate-y-1/2"></div>

                            {/* Right Gate Post */}
                            <div className="absolute -right-6 top-1/2 w-4 h-24 bg-gray-700 rounded-lg transform -translate-y-1/2"></div>

                            {/* Gate Barrier */}
                            <div
                                className={`w-80 h-3 ${gateColor} rounded-full transition-all duration-1500 transform origin-left ${gateState === 'open' ? '-rotate-90 translate-x-2 -translate-y-14' :
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
                    <div className="flex justify-between text-sm">
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
                    </div>
                </div>
            </div>
        );
    };

    return (
        <div className="min-h-screen bg-base-200 relative overflow-hidden">
            <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
                <div className="text-center">
                    <div className="bg-gradient-to-r from-primary to-secondary p-6 rounded-t-xl">
                        <h1 className="text-3xl font-bold text-white flex items-center justify-center">
                            <Shield className="mr-3 h-8 w-8" />
                            Gate Simulation Dashboard
                        </h1>
                        <p className="text-primary-content/80 mt-2">Real-time gate operation simulation</p>
                    </div>
                </div>

                <div className="bg-base-100 rounded-b-xl shadow-xl p-6 mb-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {lastActivity && (
                            <div className="badge badge-primary badge-lg">
                                Last Activity: {lastActivity.type} gate {lastActivity.action} at {lastActivity.time}
                            </div>
                        )}
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
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
            </div>
        </div>
    );
};

export default AccessControlPage;

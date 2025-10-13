import { useState } from "react";

import { useVehicleStore } from "../stores/useVehicleStore";

import { PlusCircle, Loader } from "lucide-react";


const AddVehicleForm = () => {
    const [formData, setFormData] = useState({
        plateNumber: "",
        makeModel: "",
        ownerName: "",
    });

    const { addVehicle,  addLoading } = useVehicleStore();
    const handleSubmit = (e) => {
        e.preventDefault();
        addVehicle(formData);
        console.log("Added vehicle:", formData);
        setFormData({
            plateNumber: "",
            makeModel: "",
            ownerName: "",
        });
    };


    return (
        <div
            className='bg-gradient-to-r from-primary to-secondary shadow-lg rounded-lg p-8 mb-20 max-w-6xl mx-auto'
        >
            <h2 className='text-2xl font-semibold text-white mb-2'>Add New Vehicle</h2>
            <p className='text-white/80 mb-6'>Enter the details of the vehicle you want to add:</p>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label htmlFor='plateNumber' className='block text-sm font-medium text-gray-300'>
                        Plate Number
                    </label>
                    <input
                        type='text'
                        id='plateNumber'
                        name='plateNumber'
                        placeholder="Enter plate number"
                        value={formData.plateNumber}
                        onChange={(e) => setFormData({ ...formData, plateNumber: e.target.value })}
                        className='mt-1 block w-full bg-base-200 text-base-content border border-gray-600 rounded-md shadow-sm py-2
						 px-3 focus:outline-none focus:ring-2
						focus:ring-accent focus:border-accent'
                        required
                    />
                </div>

                <div>
                    <label htmlFor='makeModel' className='block text-sm font-medium text-gray-300'>
                        Make & Model
                    </label>
                    <input
                        type='text'
                        id='makeModel'
                        name='makeModel'
                        placeholder="Enter make and model"
                        value={formData.makeModel}
                        onChange={(e) => setFormData({ ...formData, makeModel: e.target.value })}
                        className='mt-1 block w-full bg-base-200 text-base-content border border-gray-600 rounded-md shadow-sm py-2
						 px-3 focus:outline-none focus:ring-2
						focus:ring-accent focus:border-accent'
                        required
                    />
                </div>
                <div>
                    <label htmlFor='ownerName' className='block text-sm font-medium text-gray-300'>
                        Owner's Name
                    </label>
                    <input
                        type='text'
                        id='ownerName'
                        name='ownerName'
                        placeholder="Enter owner's name"
                        value={formData.ownerName}
                        onChange={(e) => setFormData({ ...formData, ownerName: e.target.value })}
                        className='mt-1 block w-full bg-base-200 text-base-content border border-gray-600 rounded-md shadow-sm py-2
						 px-3 focus:outline-none focus:ring-2
						focus:ring-accent focus:border-accent'
                        required
                    />
                </div>
                <button
                    type='submit'
                    className={`w-full flex justify-center py-2 px-4 mt-8 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-primary-content bg-accent 
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50 ${addLoading ? 'cursor-not-allowed' : 'hover:bg-warning cursor-pointer'}`}
                    disabled={addLoading}
                >
                    {addLoading ? (
                        <>
                            <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                            Loading...
                        </>
                    ) : (
                        <>
                            <PlusCircle className='mr-2 h-5 w-5' />
                            Add Vehicle
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}

export default AddVehicleForm
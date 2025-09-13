import { useState } from "react";

import { useVehicleStore } from "../stores/useVehicleStore";

import { PlusCircle, Loader } from "lucide-react";


const AddVehicleForm = () => {
    const [formData, setFormData] = useState({
        plateNumber: "",
        makeModel: "",
        ownerName: "",
    });

    const { addVehicle, addLoading, viewVehicles } = useVehicleStore();
    
    const handleSubmit = (e) => {
        e.preventDefault();
        addVehicle(formData);
        console.log("Added vehicle:", formData);
        setFormData({
            plateNumber: "",
            makeModel: "",
            ownerName: "",
        });
        viewVehicles();
    };


    return (
        <div
            className='bg-primary shadow-lg rounded-lg p-8 mb-8 max-w-6xl mx-auto'
        >
            <h2 className='text-2xl font-semibold mb-6 text-primary-content'>Add New Vehicle</h2>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label htmlFor='plateNumber' className='block text-sm font-medium text-gray-300'>
                        Plate Number
                    </label>
                    <input
                        type='text'
                        id='plateNumber'
                        name='plateNumber'
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
                    className='w-full flex justify-center py-2 px-4 mt-8 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-primary-content bg-accent hover:bg-warning cursor-pointer
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50'
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
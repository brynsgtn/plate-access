import { useState } from "react";
import { PlusCircle, Loader, Eye, EyeOff } from "lucide-react";
import { useUserStore } from "../stores/useUserStore";

const CreateUserForm = () => {
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const { createUser, loading } = useUserStore();

    const isConfirmValid = confirmPassword === formData.password;


    const handleSubmit = (e) => {
        e.preventDefault();
        if (isConfirmValid) {
            createUser(formData);
            setFormData({
                username: "",
                email: "",
                password: "",
            });
            setConfirmPassword("");
        }
    }

    return (
        <div
            className='bg-primary shadow-lg bg-gradient-to-r from-primary to-secondary p-10 rounded-xl mb-15 max-w-5xl mx-auto'
        >
            <h2 className='text-2xl font-bold mb-6 text-white'>Add New User</h2>
            <p className='text-gray-300 mb-6'>Enter the details of the user you want to add:</p>
            <form onSubmit={handleSubmit} className='space-y-4'>
                <div>
                    <label htmlFor='username' className='block text-sm font-medium text-gray-300'>
                        Username
                    </label>
                    <input
                        type='text'
                        id='username'
                        name='username'
                        value={formData.username}
                        onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                        className='mt-1 block w-full bg-base-200 text-base-content border border-gray-600 rounded-md shadow-sm py-2
						 px-3 focus:outline-none focus:ring-2
						focus:ring-accent focus:border-accent'
                        required
                    />
                </div>

                <div>
                    <label htmlFor='email' className='block text-sm font-medium text-gray-300'>
                        Email
                    </label>
                    <input
                        type='email'
                        id='email'
                        name='email'
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className='mt-1 block w-full bg-base-200 text-base-content border border-gray-600 rounded-md shadow-sm py-2
						 px-3 focus:outline-none focus:ring-2
						focus:ring-accent focus:border-accent'
                        required
                    />
                </div>



                <div>
                    <label htmlFor='password' className='block text-sm font-medium text-gray-300'>
                        Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id='password'
                            name='password'
                            value={formData.password}
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                            className={`mt-1 block w-full bg-base-200 text-base-content border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2
                                focus:ring-accent focus:border-accent
                                ${confirmPassword && !isConfirmValid ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-600"}`}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                </div>
                <div>
                    <label htmlFor='confirm-password' className='block text-sm font-medium text-gray-300'>
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            id='confirm-password'
                            name='confirm-password'
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className={`mt-1 block w-full bg-base-200 text-base-content border rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-2
                                focus:ring-accent focus:border-accent
                                ${confirmPassword && !isConfirmValid ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "border-gray-600"}`}
                            required
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-500"
                        >
                            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                        </button>
                    </div>
                    {!isConfirmValid && confirmPassword && (
                        <p className="text-red-400 text-xs mt-1">Passwords do not match.</p>
                    )}
                </div>

                <button
                    type='submit'
                    className='w-full flex justify-center py-2 px-4 mt-8 border border-transparent rounded-md 
					shadow-sm text-sm font-medium text-primary-content bg-accent hover:bg-warning cursor-pointer
					focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-accent disabled:opacity-50'
                    disabled={loading}
                >
                    {loading ? (
                        <>
                            <Loader className='mr-2 h-5 w-5 animate-spin' aria-hidden='true' />
                            Loading...
                        </>
                    ) : (
                        <>
                            <PlusCircle className='mr-2 h-5 w-5' />
                            Add User
                        </>
                    )}
                </button>
            </form>
        </div>
    )
}

export default CreateUserForm
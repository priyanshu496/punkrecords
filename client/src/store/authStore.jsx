// import axios from "axios";
// import { BACKEND_URL } from "../config.jsx";
// import { create } from "zustand";
// import toast from "react-hot-toast";

// // Configure axios to include cookies with all requests
// axios.defaults.withCredentials = true;

// export const useAuthStore = create((set) => ({
//     user: null,
//     isRegistered: false,
//     isCheckingAuth: false,
//     isLoggingIn: false,
//     isLoggedOut: false,
    
//     register: async (credentials) => {
//         set({ isRegistered: true });
//         try {
//             const response = await axios.post(BACKEND_URL + '/api/v1/auth/register', credentials);
//             console.log('Registration response:', response.data);
            
//             if (response.data.success && response.data.user) {
//                 set({ user: response.data.user, isRegistered: false });
//                 toast.success('Account created successfully.');
//                 return null; // No error
//             } else {
//                 set({ isRegistered: false, user: null });
//                 toast.error('Registration failed - no user data received');
//                 return new Error('Registration failed');
//             }
//         } catch (error) {
//             console.error('Registration error:', error);
//             set({ isRegistered: false, user: null });
//             const errorMessage = error.response?.data?.message || 'Registration failed';
//             toast.error(errorMessage);
//             return error;
//         }
//     },

//     login: async (credentials) => {
//         set({ isLoggingIn: true });
//         try {
//             console.log('Attempting login with:', credentials.email);
//             const response = await axios.post(BACKEND_URL + '/api/v1/auth/login', credentials);
//             console.log('Login API response:', response.data);
            
//             if (response.data && response.data.success && response.data.user) {
//                 console.log('Setting user in store:', response.data.user);
//                 set({ user: response.data.user, isLoggingIn: false });
//                 toast.success('Login successful!');
                
//                 // Force a small delay to ensure state is updated
//                 await new Promise(resolve => setTimeout(resolve, 50));
                
//                 return null; // No error
//             } else {
//                 console.log('Login failed - no user data in response');
//                 set({ isLoggingIn: false, user: null });
//                 return { response: { data: { message: 'Invalid response from server' } } };
//             }
//         } catch (error) {
//             console.error('Login error:', error);
//             set({ isLoggingIn: false, user: null });
//             return error; // Return error for component to handle
//         }
//     },

//     logout: async () => {
//         set({ isLoggedOut: true });
//         try {
//             await axios.post(BACKEND_URL + '/api/v1/auth/logout');
//             set({ user: null, isLoggedOut: false });
//             toast.success('Logout successful.');
//             return null;
//         } catch (error) {
//             console.error('Logout error:', error);
//             set({ isLoggedOut: false });
//             toast.error('Logout failed: ' + (error.response?.data?.message || error.message));
//             return error;
//         }
//     },

//     authCheck: async () => {
//         set({ isCheckingAuth: true });
//         try {
//             const response = await axios.get(BACKEND_URL + '/api/v1/auth/authCheck');
//             console.log('Auth check response:', response.data);
            
//             if (response.data.success && response.data.user) {
//                 console.log('Auth check successful:', response.data.user);
//                 set({ user: response.data.user, isCheckingAuth: false });
//                 return response.data.user;
//             } else {
//                 console.log('Auth check failed - no user data');
//                 set({ isCheckingAuth: false, user: null });
//                 return null;
//             }
//         } catch (error) {
//             console.log('Auth check failed - user not authenticated:', error.response?.data?.message || error.message);
//             set({ isCheckingAuth: false, user: null });
//             return null;
//         }
//     }
// }));





import axios from "axios";
import { BACKEND_URL } from "../config.jsx";
import { create } from "zustand";
import toast from "react-hot-toast";

// Configure axios to include cookies with all requests
axios.defaults.withCredentials = true;

export const useAuthStore = create((set, get) => ({
    user: null,
    isRegistered: false,
    isCheckingAuth: false,
    isLoggingIn: false,
    isLoggedOut: false,
    
    register: async (credentials) => {
        set({ isRegistered: true });
        try {
            const response = await axios.post(BACKEND_URL + '/api/v1/auth/register', credentials);
            console.log('Registration response:', response.data);
            
            if (response.data.success && response.data.user) {
                set({ user: response.data.user, isRegistered: false });
                toast.success('Account created successfully.');
                return null; // No error
            } else {
                set({ isRegistered: false, user: null });
                toast.error('Registration failed - no user data received');
                return new Error('Registration failed');
            }
        } catch (error) {
            console.error('Registration error:', error);
            set({ isRegistered: false, user: null });
            const errorMessage = error.response?.data?.message || 'Registration failed';
            toast.error(errorMessage);
            return error;
        }
    },

    login: async (credentials) => {
        set({ isLoggingIn: true });
        try {
            console.log('Attempting login with:', credentials.email);
            const response = await axios.post(BACKEND_URL + '/api/v1/auth/login', credentials);
            console.log('Login API response:', response.data);
            
            if (response.data && response.data.success && response.data.user) {
                console.log('Setting user in store:', response.data.user);
                set({ user: response.data.user, isLoggingIn: false });
                toast.success('Login successful!');
                
                // Force a small delay to ensure state is updated
                await new Promise(resolve => setTimeout(resolve, 50));
                
                return null; // No error
            } else {
                console.log('Login failed - no user data in response');
                set({ isLoggingIn: false, user: null });
                return { response: { data: { message: 'Invalid response from server' } } };
            }
        } catch (error) {
            console.error('Login error:', error);
            set({ isLoggingIn: false, user: null });
            return error; // Return error for component to handle
        }
    },

    logout: async () => {
        console.log("=== AUTH STORE LOGOUT START ===");
        const currentUser = get().user;
        console.log("Current user before logout:", currentUser);
        
        set({ isLoggedOut: true });
        
        try {
            console.log("Making logout API call to:", BACKEND_URL + '/api/v1/auth/logout');
            const response = await axios.post(BACKEND_URL + '/api/v1/auth/logout');
            console.log("Logout API response:", response.data);
            
            // Clear user state regardless of API response
            set({ user: null, isLoggedOut: false });
            console.log("User state cleared");
            
            toast.success('Logout successful.');
            console.log("=== AUTH STORE LOGOUT SUCCESS ===");
            return null;
            
        } catch (error) {
            console.error('Logout API error:', error);
            console.log("Error details:", {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
            
            // Even if API fails, clear the user state locally
            set({ user: null, isLoggedOut: false });
            console.log("User state cleared despite API error");
            
            // Show toast but don't treat as failure
            toast.error('Logout completed (server error occurred)');
            console.log("=== AUTH STORE LOGOUT COMPLETED WITH ERROR ===");
            return null; // Return null to indicate local logout was successful
        }
    },

    authCheck: async () => {
        set({ isCheckingAuth: true });
        try {
            const response = await axios.get(BACKEND_URL + '/api/v1/auth/authCheck');
            console.log('Auth check response:', response.data);
            
            if (response.data.success && response.data.user) {
                console.log('Auth check successful:', response.data.user);
                set({ user: response.data.user, isCheckingAuth: false });
                return response.data.user;
            } else {
                console.log('Auth check failed - no user data');
                set({ isCheckingAuth: false, user: null });
                return null;
            }
        } catch (error) {
            console.log('Auth check failed - user not authenticated:', error.response?.data?.message || error.message);
            set({ isCheckingAuth: false, user: null });
            return null;
        }
    },

    // Add a manual clear user function for testing
    clearUser: () => {
        console.log("Manually clearing user state");
        set({ user: null });
    }
}));
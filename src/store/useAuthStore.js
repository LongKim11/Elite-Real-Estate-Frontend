import { create } from 'zustand';

const useAuthStore = create((set) => {
    const storedUser = JSON.parse(localStorage.getItem('user')) || null;

    return {
        user: storedUser,
        setUser: (user) => {
            set({ user });
            localStorage.setItem('user', JSON.stringify(user));
        },
        clearUser: () => {
            set({ user: null });
            localStorage.removeItem('user');
        }
    };
});

export default useAuthStore;

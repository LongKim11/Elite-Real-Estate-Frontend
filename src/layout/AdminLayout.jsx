import * as React from 'react';
import {
    GalleryVerticalEnd,
    Users,
    Tag,
    CreditCard,
    BarChart3,
    Home,
    LogOut,
    Settings,
    UserPen,
    Gauge,
    Bell,
    Activity
} from 'lucide-react';
import { Link, Outlet } from 'react-router-dom';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarHeader,
    SidebarInset,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarProvider,
    SidebarRail,
    SidebarTrigger
} from '@/components/ui/sidebar';
import useAuthStore from '@/store/useAuthStore';
import { useNavigate } from 'react-router-dom';
import { removeToken } from '@/utils/auth';
import { toast } from 'sonner';

export const AdminLayout = () => {
    const adminInfo = useAuthStore((state) => state.user) || false;

    const navigate = useNavigate();

    const handleLogout = () => {
        removeToken();
        useAuthStore.getState().clearUser();
        toast.success('Logout successfully');
        navigate('/sign-in');
    };

    return (
        <SidebarProvider>
            <Sidebar>
                <SidebarHeader>
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <SidebarMenuButton size="lg" asChild>
                                <Link to={'/admin'}>
                                    <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-black text-white">
                                        <GalleryVerticalEnd className="size-4" />
                                    </div>
                                    <div className="flex flex-col gap-0.5 leading-none">
                                        <span className="font-semibold">
                                            Elite Estate
                                        </span>
                                        <span className="text-muted-foreground">
                                            Manage your business
                                        </span>
                                    </div>
                                </Link>
                            </SidebarMenuButton>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarHeader>
                <SidebarContent>
                    {/* Overview */}
                    <SidebarGroup>
                        <SidebarGroupLabel>Overview</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={'/admin'}>
                                            <Gauge className="mr-2" />
                                            <span>Dashboard</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={'#'}>
                                            <Bell className="mr-2" />
                                            <span>Notifications</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={'#'}>
                                            <Activity className="mr-2" />
                                            <span>Activity Log</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* Main Navigation */}
                    <SidebarGroup>
                        <SidebarGroupLabel>Management</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={'/admin/user-management'}>
                                            <Users className="mr-2" />
                                            <span>User Administration</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={'/admin/listing-management'}>
                                            <Home className="mr-2" />
                                            <span>Property Listings</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={'/admin/payment-management'}>
                                            <CreditCard className="mr-2" />
                                            <span>Payment Processing</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={'/admin/sales-management'}>
                                            <BarChart3 className="mr-2" />
                                            <span>Sales Analytics</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={'/admin/rental-management'}>
                                            <Tag className="mr-2" />
                                            <span>Rental Operations</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>

                    {/* Account Section */}
                    <SidebarGroup>
                        <SidebarGroupLabel>Account</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={'#'}>
                                            <UserPen className="mr-2" />
                                            <span>Profile</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link to={'#'}>
                                            <Settings className="mr-2" />
                                            <span>Settings</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarGroupContent>
                    </SidebarGroup>
                </SidebarContent>
                <SidebarFooter className="border-t p-4">
                    <SidebarMenu>
                        <SidebarMenuItem>
                            <div className="flex w-full items-center gap-3">
                                <img
                                    src="/user-default.png"
                                    alt="User avatar"
                                    className="h-10 w-10 rounded-full border-2 border-[#fece51]"
                                />
                                <div className="flex flex-col text-left">
                                    <span className="text-sm font-semibold">
                                        {adminInfo.name}
                                    </span>
                                    <span className="text-muted-foreground text-xs">
                                        Head Manager
                                    </span>
                                </div>
                                <LogOut
                                    className="ml-auto cursor-pointer text-red-600 hover:text-red-700"
                                    onClick={handleLogout}
                                />
                            </div>
                        </SidebarMenuItem>
                    </SidebarMenu>
                </SidebarFooter>

                <SidebarRail />
            </Sidebar>
            <SidebarInset>
                <header className="bg-background flex h-14 items-center gap-4 border-b px-4 lg:h-16">
                    <SidebarTrigger />
                    <div className="font-semibold">Admin Center</div>
                </header>
                <main className="flex-1 p-4 md:p-6">
                    <Outlet />
                </main>
            </SidebarInset>
        </SidebarProvider>
    );
};

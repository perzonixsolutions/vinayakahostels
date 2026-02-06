import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import AuthService from '@/integrations/AuthService';

export default function AdminDashboardPage() {
    const navigate = useNavigate();

    const handleLogout = () => {
        AuthService.logout();
        navigate('/admin');
    };

    return (
        <div className="min-h-screen bg-background flex flex-col">
            <Header />

            <div className="flex-grow w-full max-w-[100rem] mx-auto px-8 md:px-20 py-12">
                <div className="flex items-center justify-between mb-12">
                    <h1 className="font-heading text-4xl text-foreground">Admin Dashboard</h1>
                    <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="text-red-500 hover:text-red-600 hover:bg-red-50"
                    >
                        Logout
                    </Button>
                </div>

                <div className="bg-white p-8 rounded-lg shadow-sm border border-muted-grey text-center py-20">
                    <h2 className="font-heading text-2xl text-foreground mb-4">Welcome, Admin</h2>
                    <p className="font-paragraph text-lg text-foreground/60 mb-8">
                        You are successfully logged in via the secure backend.
                    </p>
                    <p className="font-paragraph text-base text-foreground/60">
                        (Statistics and management features will appear here once connected to the database)
                    </p>
                </div>
            </div>

            <Footer />
        </div>
    );
}

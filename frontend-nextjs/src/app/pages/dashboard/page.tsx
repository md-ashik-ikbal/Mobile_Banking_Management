import DashboardComponent from "@/app/components/dashboard/dashboardComponent";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: "Dashboard",
};

const Dashboard = () => {

    return(
        <>
            <DashboardComponent />
        </>
    );
}

export default Dashboard;
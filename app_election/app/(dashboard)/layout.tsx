import Sidebar from "./components/Sidebar";
import Header from "./components/Header";
import { DataProvider } from "./context/DataContext";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <DataProvider>
      <div className="flex min-h-screen">
        <Sidebar />
        <div className="flex-1 flex flex-col pl-72">
          <Header />
          <main className="flex-1 p-8">
            {children}
          </main>
        </div>
      </div>
    </DataProvider>
  );
}

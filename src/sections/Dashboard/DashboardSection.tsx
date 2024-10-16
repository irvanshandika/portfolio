import { useState, useEffect } from "react";
import { auth, db } from "@/config/FirebaseConfig";
import { doc, getDoc } from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid } from "recharts";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Users, ArrowUpRight, ArrowDownRight } from "lucide-react";

// Data pengunjung (contoh data)
const visitorData = [
  { date: "2023-06-01", visitors: 120 },
  { date: "2023-06-02", visitors: 150 },
  { date: "2023-06-03", visitors: 180 },
  { date: "2023-06-04", visitors: 220 },
  { date: "2023-06-05", visitors: 190 },
  { date: "2023-06-06", visitors: 250 },
  { date: "2023-06-07", visitors: 300 },
];

const useAdminCheck = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const userRef = doc(db, "users", user.uid);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists() && userSnap.data().role === "admin") {
          setIsAdmin(true);
        } else {
          window.location.href = "/";
        }
      } else {
        window.location.href = "/";
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  return { isAdmin, loading };
};

const DashboardSection = () => {
  const { isAdmin, loading } = useAdminCheck();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAdmin) {
    return null;
  }

  const totalVisitors = visitorData.reduce((sum, day) => sum + day.visitors, 0);
  const averageVisitors = Math.round(totalVisitors / visitorData.length);
  const lastDayVisitors = visitorData[visitorData.length - 1].visitors;
  const previousDayVisitors = visitorData[visitorData.length - 2].visitors;
  const visitorChange = lastDayVisitors - previousDayVisitors;
  const visitorChangePercentage = Math.round((visitorChange / previousDayVisitors) * 100);

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8">Visitor Analytics Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisitors}</div>
            <p className="text-xs text-muted-foreground">+{visitorChangePercentage}% from yesterday</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Average Daily Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{averageVisitors}</div>
            <p className="text-xs text-muted-foreground">For the last 7 days</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Today's Visitors</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{lastDayVisitors}</div>
            <p className="text-xs text-muted-foreground flex items-center">
              {visitorChange > 0 ? (
                <>
                  <ArrowUpRight className="text-green-500 mr-1" />
                  <span className="text-green-500">+{visitorChange}</span>
                </>
              ) : (
                <>
                  <ArrowDownRight className="text-red-500 mr-1" />
                  <span className="text-red-500">{visitorChange}</span>
                </>
              )}{" "}
              from yesterday
            </p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Visitor Trends</CardTitle>
          <CardDescription>Daily visitor count for the last 7 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer
            config={{
              visitors: {
                label: "Visitors",
                color: "hsl(var(--chart-1))",
              },
            }}
            className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={visitorData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="visitors" fill="var(--color-visitors)" />
              </BarChart>
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardSection;

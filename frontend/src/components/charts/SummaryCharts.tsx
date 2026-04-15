import { Bar, BarChart, CartesianGrid, Legend, Line, LineChart, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export function SummaryCharts() {
  const trendData = [
    { month: 'Jan', submitted: 20, approved: 15 },
    { month: 'Feb', submitted: 24, approved: 19 },
    { month: 'Mar', submitted: 28, approved: 21 }
  ];
  const rankData = [
    { name: 'H1', score: 98 },
    { name: 'H2', score: 90 },
    { name: 'H3', score: 86 }
  ];
  const statusData = [
    { name: 'Approved', value: 11 },
    { name: 'Revision', value: 3 },
    { name: 'Draft', value: 4 }
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      <div className="h-56 rounded-xl bg-white p-3"><ResponsiveContainer><LineChart data={trendData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="month" /><YAxis /><Tooltip /><Legend /><Line dataKey="submitted" stroke="#1d4ed8" /><Line dataKey="approved" stroke="#059669" /></LineChart></ResponsiveContainer></div>
      <div className="h-56 rounded-xl bg-white p-3"><ResponsiveContainer><BarChart data={rankData}><CartesianGrid strokeDasharray="3 3" /><XAxis dataKey="name" /><YAxis /><Tooltip /><Bar dataKey="score" fill="#1d4ed8" /></BarChart></ResponsiveContainer></div>
      <div className="h-56 rounded-xl bg-white p-3"><ResponsiveContainer><PieChart><Pie data={statusData} dataKey="value" nameKey="name" outerRadius={80} fill="#059669" /><Tooltip /></PieChart></ResponsiveContainer></div>
    </div>
  );
}

import React from 'react';
import { Users, Building2, Clock, DollarSign } from 'lucide-react';

const StatCard = ({ icon: Icon, label, value, color }: any) => (
  <div className="bg-white rounded-lg shadow p-6">
    <div className="flex items-center">
      <div className={`p-3 rounded-full ${color} text-white mr-4`}>
        <Icon className="w-6 h-6" />
      </div>
      <div>
        <p className="text-gray-500 text-sm">{label}</p>
        <h3 className="text-2xl font-semibold">{value}</h3>
      </div>
    </div>
  </div>
);

const Dashboard = () => {
  return (
    <div>
      <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          icon={Users}
          label="Total Employees"
          value="150"
          color="bg-blue-500"
        />
        <StatCard
          icon={Building2}
          label="Departments"
          value="8"
          color="bg-green-500"
        />
        <StatCard
          icon={Clock}
          label="Present Today"
          value="142"
          color="bg-yellow-500"
        />
        <StatCard
          icon={DollarSign}
          label="Total Payroll"
          value="$45,250"
          color="bg-purple-500"
        />
      </div>
    </div>
  );
};

export default Dashboard;
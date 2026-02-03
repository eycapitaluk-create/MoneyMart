import React from 'react';

const AdminPage = ({ users }) => {
  return (
    <div className="max-w-4xl mx-auto p-10 animate-fadeIn">
      <h2 className="text-3xl font-black text-slate-900 mb-6">Admin Dashboard</h2>
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h3 className="font-bold text-lg mb-4">가입자 목록 ({users?.length || 0}명)</h3>
        <div className="space-y-2">
          {users && users.map(u => (
            <div key={u.id} className="flex justify-between p-3 bg-slate-50 rounded-xl">
              <span className="font-bold">{u.name}</span>
              <span className="text-slate-500">{u.email}</span>
              <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded">{u.plan}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
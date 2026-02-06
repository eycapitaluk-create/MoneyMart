import React, { useState, useEffect } from 'react';
import { 
  Users, TrendingUp, Search, Download, Trash2, Shield, Loader2, RefreshCw 
} from 'lucide-react';
import { supabase } from '../lib/supabase';

const AdminPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalUsers: 0, premiumUsers: 0 });

  // 유저 목록 불러오기 (Supabase DB 연동)
  const fetchUsers = async () => {
    try {
      setLoading(true);
      
      // 1. profiles 테이블에서 유저 정보 가져오기
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setUsers(data);
      
      // 통계 계산
      setStats({
        totalUsers: data.length,
        premiumUsers: data.filter(u => u.plan === 'premium').length
      });

    } catch (error) {
      console.error('Error fetching users:', error);
      alert("ユーザー情報の取得に失敗しました");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // 유저 삭제 핸들러 (실제 삭제)
  const handleDeleteUser = async (userId) => {
    if (!window.confirm("本当にこのユーザーを削除しますか？\n(関連するポートフォリオなども全て削除されます)")) return;

    try {
        // Supabase Auth 삭제는 클라이언트에서 불가(보안상). 
        // 여기서는 DB 데이터(profiles)만 삭제하는 시늉을 하거나,
        // 실제로는 profiles 테이블의 row를 날립니다. (Cascade 설정되어 있으면 연관 데이터 다 날아감)
        const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', userId);

        if (error) throw error;

        alert("ユーザーデータを削除しました。");
        fetchUsers(); // 목록 새로고침
    } catch (err) {
        console.error("Delete error:", err);
        alert("削除に失敗しました。");
    }
  };

  if (loading) {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50">
            <Loader2 className="w-10 h-10 text-orange-500 animate-spin mb-4" />
            <p className="text-slate-500 font-bold">管理者データを読み込んでいます...</p>
        </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8 min-h-screen pb-32 animate-fadeIn bg-slate-50">
      
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2">Admin Dashboard</h1>
            <p className="text-slate-500 text-sm">ユーザー管理・システム状況</p>
        </div>
        <button 
            onClick={fetchUsers}
            className="p-3 bg-white border border-slate-200 rounded-full hover:bg-slate-50 transition text-slate-500"
        >
            <RefreshCw size={20}/>
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Users size={24}/></div>
                <div>
                    <p className="text-sm text-slate-400 font-bold">総ユーザー数</p>
                    <p className="text-2xl font-black text-slate-900">{stats.totalUsers}名</p>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-orange-100 text-orange-600 rounded-xl"><TrendingUp size={24}/></div>
                <div>
                    <p className="text-sm text-slate-400 font-bold">プレミアム会員</p>
                    <p className="text-2xl font-black text-slate-900">{stats.premiumUsers}名</p>
                </div>
            </div>
        </div>
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
            <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 text-green-600 rounded-xl"><Shield size={24}/></div>
                <div>
                    <p className="text-sm text-slate-400 font-bold">システム状態</p>
                    <p className="text-2xl font-black text-green-500">正常稼働中</p>
                </div>
            </div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
            <h3 className="font-bold text-lg text-slate-900">登録ユーザー一覧</h3>
            <div className="relative w-full md:w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18}/>
                <input type="text" placeholder="名前・メールで検索" className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-slate-900"/>
            </div>
        </div>
        
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-slate-50 text-slate-500 font-bold">
                    <tr>
                        <th className="px-6 py-4">ユーザー (名前 / ID)</th>
                        <th className="px-6 py-4">メールアドレス</th>
                        <th className="px-6 py-4">プラン</th>
                        <th className="px-6 py-4">登録日</th>
                        <th className="px-6 py-4 text-right">操作</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                    {users.map((user) => (
                        <tr key={user.id} className="hover:bg-slate-50 transition">
                            <td className="px-6 py-4">
                                <div className="font-bold text-slate-900">{user.name || 'No Name'}</div>
                                {/* ★ 여기서 ID를 작게 보여줍니다 */}
                                <div className="text-[10px] text-slate-400 font-mono">{user.id}</div>
                            </td>
                            <td className="px-6 py-4 text-slate-600">{user.email}</td>
                            <td className="px-6 py-4">
                                <span className={`px-2 py-1 rounded-md text-xs font-bold ${user.plan === 'premium' ? 'bg-orange-100 text-orange-600' : 'bg-slate-100 text-slate-500'}`}>
                                    {user.plan === 'premium' ? 'Premium' : 'Free'}
                                </span>
                            </td>
                            <td className="px-6 py-4 text-slate-500">
                                {new Date(user.created_at).toLocaleDateString()}
                            </td>
                            <td className="px-6 py-4 text-right">
                                <button 
                                    onClick={() => handleDeleteUser(user.id)}
                                    className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition"
                                    title="ユーザー削除"
                                >
                                    <Trash2 size={18}/>
                                </button>
                            </td>
                        </tr>
                    ))}
                    {users.length === 0 && (
                        <tr>
                            <td colSpan="5" className="text-center py-12 text-slate-400">
                                ユーザーがいません
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

    </div>
  );
};

export default AdminPage;
import { useState } from 'react';
import { User, Lock, Bell, Palette, Shield, Info, Save } from 'lucide-react';
import { useStore } from '../../store';
import { Card } from '../../components/UI/Card';
import { Button } from '../../components/UI/Button';
import { Input } from '../../components/UI/Input';
import { cn } from '../../utils/cn';

export function SettingsPage() {
  const { currentUser, updateUser, theme, toggleTheme } = useStore();
  const [activeTab, setActiveTab] = useState('profile');
  const [formData, setFormData] = useState({
    name: currentUser?.name || '',
    email: currentUser?.email || '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'security', label: 'Security', icon: Lock },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'about', label: 'About', icon: Info },
  ];

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (currentUser) {
      updateUser(currentUser.id, {
        name: formData.name,
        email: formData.email,
      });
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      alert('Passwords do not match!');
      return;
    }
    if (currentUser && formData.currentPassword === currentUser.password) {
      updateUser(currentUser.id, { password: formData.newPassword });
      setFormData({ ...formData, currentPassword: '', newPassword: '', confirmPassword: '' });
      alert('Password changed successfully!');
    } else {
      alert('Current password is incorrect!');
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Settings</h2>
        <p className="text-gray-500 dark:text-gray-400">Manage your account settings and preferences</p>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        {/* Tabs */}
        <Card className="lg:w-64 flex-shrink-0" padding="sm">
          <nav className="space-y-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 rounded-xl text-left transition-colors',
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                      : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800'
                  )}
                >
                  <Icon size={18} />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </nav>
        </Card>

        {/* Content */}
        <div className="flex-1">
          {activeTab === 'profile' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Profile Information</h3>
              <form onSubmit={handleSaveProfile} className="space-y-4 max-w-md">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                    {currentUser?.name.charAt(0).toUpperCase()}
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{currentUser?.name}</p>
                    <p className="text-sm text-gray-500 capitalize">{currentUser?.role}</p>
                  </div>
                </div>
                <Input
                  label="Full Name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input
                  label="Email Address"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
                <Button type="submit" icon={<Save size={16} />}>
                  {saved ? 'Saved!' : 'Save Changes'}
                </Button>
              </form>
            </Card>
          )}

          {activeTab === 'security' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Change Password</h3>
              <form onSubmit={handleChangePassword} className="space-y-4 max-w-md">
                <Input
                  label="Current Password"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                />
                <Input
                  label="New Password"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                />
                <Input
                  label="Confirm New Password"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                />
                <Button type="submit" icon={<Shield size={16} />}>
                  Update Password
                </Button>
              </form>
            </Card>
          )}

          {activeTab === 'appearance' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Appearance</h3>
              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    Theme
                  </label>
                  <div className="flex gap-4">
                    <button
                      onClick={() => theme === 'dark' && toggleTheme()}
                      className={cn(
                        'flex-1 p-4 rounded-xl border-2 transition-all',
                        theme === 'light'
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      )}
                    >
                      <div className="w-full h-20 bg-white rounded-lg shadow-sm mb-3 flex items-center justify-center">
                        <Palette className="text-gray-400" />
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">Light</p>
                    </button>
                    <button
                      onClick={() => theme === 'light' && toggleTheme()}
                      className={cn(
                        'flex-1 p-4 rounded-xl border-2 transition-all',
                        theme === 'dark'
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20'
                          : 'border-gray-200 dark:border-gray-700'
                      )}
                    >
                      <div className="w-full h-20 bg-gray-900 rounded-lg shadow-sm mb-3 flex items-center justify-center">
                        <Palette className="text-gray-600" />
                      </div>
                      <p className="font-medium text-gray-900 dark:text-white">Dark</p>
                    </button>
                  </div>
                </div>
              </div>
            </Card>
          )}

          {activeTab === 'notifications' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">Notification Preferences</h3>
              <div className="space-y-4">
                {[
                  { label: 'Book due reminders', description: 'Get notified before your book is due' },
                  { label: 'Request status updates', description: 'Get notified when your request is approved' },
                  { label: 'New arrivals', description: 'Get notified about new books in your favorite categories' },
                  { label: 'System announcements', description: 'Important updates about the library system' },
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{item.label}</p>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" defaultChecked className="sr-only peer" />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-indigo-300 dark:peer-focus:ring-indigo-800 rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-indigo-600"></div>
                    </label>
                  </div>
                ))}
              </div>
            </Card>
          )}

          {activeTab === 'about' && (
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">About LibraryOS</h3>
              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl">
                    <Info size={32} className="text-white" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-gray-900 dark:text-white">Library Resource Orchestration System</h4>
                    <p className="text-gray-500">Version 1.0.0</p>
                  </div>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-xl space-y-3">
                  <div>
                    <p className="text-sm text-gray-500">Developed by</p>
                    <p className="font-medium text-gray-900 dark:text-white">Sumit Ajay Dhokale</p>
                    <p className="text-sm text-gray-500">B.Tech CSE | URN: 1022031003</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Guided by</p>
                    <p className="font-medium text-gray-900 dark:text-white">Mrs. Anis Fatima N. Mulla</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Institution</p>
                    <p className="font-medium text-gray-900 dark:text-white">ADCET, Ashta</p>
                    <p className="text-sm text-gray-500">Academic Year 2025-26</p>
                  </div>
                </div>
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-2">Technology Stack</h5>
                  <div className="flex flex-wrap gap-2">
                    {['React', 'TypeScript', 'Tailwind CSS', 'Zustand', 'Vite'].map((tech) => (
                      <span key={tech} className="px-3 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-400 rounded-full text-sm">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

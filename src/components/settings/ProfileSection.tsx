'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Camera, Save } from 'lucide-react';

export function ProfileSection() {
  const [profile, setProfile] = useState({
    name: 'Admin User',
    email: 'admin@edutech.com',
    organization: 'ZYRA EduTech Pvt Ltd',
    role: 'Administrator',
    phone: '+91 9876543210',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    // In real app, this would save to backend
    console.log('Saving profile:', profile);
    alert('Profile updated successfully!');
    setIsEditing(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Manage your personal information</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-start gap-6 mb-6">
          {/* Avatar */}
          <div className="relative">
            <div className="w-24 h-24 bg-gradient-to-br from-primary-500 to-primary-700 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-white font-bold text-3xl">
                {profile.name.split(' ').map(n => n[0]).join('')}
              </span>
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-white rounded-full shadow-lg border-2 border-gray-200 hover:bg-gray-50 transition-colors">
              <Camera className="w-4 h-4 text-gray-600" />
            </button>
          </div>

          {/* Info */}
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-900 mb-1">{profile.name}</h3>
            <p className="text-gray-600 mb-2">{profile.role}</p>
            <p className="text-sm text-gray-500">{profile.organization}</p>
          </div>

          {/* Edit Button */}
          <Button
            variant={isEditing ? 'outline' : 'primary'}
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? 'Cancel' : 'Edit Profile'}
          </Button>
        </div>

        {/* Form */}
        <div className="space-y-4">
          <Input
            label="Full Name"
            value={profile.name}
            onChange={(e) => setProfile({ ...profile, name: e.target.value })}
            disabled={!isEditing}
          />

          <Input
            label="Email Address"
            type="email"
            value={profile.email}
            onChange={(e) => setProfile({ ...profile, email: e.target.value })}
            disabled={!isEditing}
          />

          <Input
            label="Organization"
            value={profile.organization}
            onChange={(e) => setProfile({ ...profile, organization: e.target.value })}
            disabled={!isEditing}
          />

          <Input
            label="Phone Number"
            value={profile.phone}
            onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
            disabled={!isEditing}
          />

          <Input
            label="Role"
            value={profile.role}
            disabled
            helperText="Contact system administrator to change role"
          />

          {isEditing && (
            <div className="pt-4">
              <Button
                variant="primary"
                onClick={handleSave}
                className="w-full"
              >
                <Save className="w-4 h-4 mr-2" />
                Save Changes
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
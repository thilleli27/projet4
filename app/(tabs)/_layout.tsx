import { useAuth } from '@/hooks/useAuth';
import { Ionicons } from '@expo/vector-icons';
import { Tabs, router } from 'expo-router';
import { useEffect } from 'react';

export default function TabLayout() {
  const { user, loading } = useAuth();

  useEffect(() => {
    if (loading) return;
    
    if (!user) {
      router.replace('/splash');
    }
  }, [user, loading]);

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#0d0d1a',
          borderTopColor: 'rgba(255,255,255,0.08)',
          borderTopWidth: 1,
          paddingBottom: 8,
          height: 60,
        },
        tabBarActiveTintColor: '#F72585',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.3)',
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Explore',
          tabBarIcon: ({ color }) => (
            <Ionicons name="grid-outline" size={24} color={color} />
          ),
        }}
      />
      <Tabs.Screen
        name="liked"
        options={{
          title: 'Liked',
          tabBarIcon: ({ color }) => (
            <Ionicons name="heart-outline" size={24} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}
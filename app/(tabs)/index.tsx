import { auth, db } from '@/constants/firebase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { signOut } from 'firebase/auth';
import { arrayRemove, arrayUnion, collection, doc, increment, onSnapshot, updateDoc } from 'firebase/firestore';
import { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
  
type Artwork = {
  id: string;
  imageUrl: string;
  author: string;
  authorId: string;
  likes: number;
  likedBy: string[];
  location: { lat: number; lng: number };
};

export default function HomeScreen() {
  const [artworks, setArtworks] = useState<Artwork[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'liked'>('all');
  const [loading, setLoading] = useState(true);

  const currentUserId = auth.currentUser?.uid || '';

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(db, 'artworks'), (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        likedBy: doc.data().likedBy || [],
      })) as Artwork[];

      data.sort((a: any, b: any) => b.createdAt?.seconds - a.createdAt?.seconds);
      setArtworks(data);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const handleLike = async (artwork: Artwork) => {
    const artworkRef = doc(db, 'artworks', artwork.id);
    const isLiked = artwork.likedBy.includes(currentUserId);

    try {
      if (isLiked) {
        await updateDoc(artworkRef, {
          likes: increment(-1),
          likedBy: arrayRemove(currentUserId),
        });
      } else {
        await updateDoc(artworkRef, {
          likes: increment(1),
          likedBy: arrayUnion(currentUserId),
        });
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleOpenMap = (location: { lat: number; lng: number }) => {
    const url = `https://www.google.com/maps?q=${location.lat},${location.lng}`;
    Linking.openURL(url);
  };
  const handleLogout = async () => {
    try {
      await signOut(auth);
      router.replace('/splash');
    } catch (e) {
      console.error(e);
    }
  };

  const displayedArtworks = activeTab === 'liked'
    ? artworks.filter(art => art.likedBy.includes(currentUserId))
    : artworks;

  const ArtworkCard = ({ item }: { item: Artwork }) => {
    const isLiked = item.likedBy.includes(currentUserId);

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => handleOpenMap(item.location)}
        activeOpacity={0.9}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.cardImage} />
        <View style={styles.cardMeta}>
          <View style={styles.cardInfo}>
            <View style={styles.authorRow}>
              <Ionicons name="person-circle" size={16} color="#7209B7" />
              <Text style={styles.authorText}>@{item.author}</Text>
            </View>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={12} color="rgba(255,255,255,0.4)" />
              <Text style={styles.locationText}>Tap to view on map</Text>
            </View>
          </View>
          <TouchableOpacity
            style={[styles.likeBtn, isLiked && styles.likeBtnActive]}
            onPress={() => handleLike(item)}
          >
            <Ionicons
              name={isLiked ? 'heart' : 'heart-outline'}
              size={18}
              color={isLiked ? '#F72585' : 'rgba(255,255,255,0.5)'}
            />
            <Text style={[styles.likeCount, isLiked && styles.likeCountActive]}>
              {item.likes}
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>

      {/* Header */}
      <LinearGradient colors={['#0d0d1a', '#0d0d1a']} style={styles.header}>
        <View>
          <Text style={styles.welcome}>
            Welcome, <Text style={styles.welcomePseudo}>@{auth.currentUser?.displayName || 'Artist'}</Text> 👋
          </Text>
          <Text style={styles.logo}>
            Local<Text style={styles.logoPink}>Street</Text>Art
          </Text>
        </View>
        <View style={styles.headerRight}>
  <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
    <Ionicons name="log-out-outline" size={22} color="rgba(255,255,255,0.5)" />
  </TouchableOpacity>
  <TouchableOpacity style={styles.addBtn} onPress={() => router.push('/photo')}>
    <LinearGradient
      colors={['#7209B7', '#F72585']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={styles.addBtnGradient}
    >
      <Ionicons name="add" size={18} color="#fff" />
      <Text style={styles.addBtnText}>Add</Text>
    </LinearGradient>
  </TouchableOpacity>
</View>
      </LinearGradient>

      {/* Onglets */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'all' && styles.tabActive]}
          onPress={() => setActiveTab('all')}
        >
          {activeTab === 'all' ? (
            <LinearGradient
              colors={['#7209B7', '#F72585']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.tabGradient}
            >
              <Text style={styles.tabTextActive}>All artworks</Text>
            </LinearGradient>
          ) : (
            <Text style={styles.tabText}>All artworks</Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.tab, activeTab === 'liked' && styles.tabActive]}
          onPress={() => setActiveTab('liked')}
        >
          {activeTab === 'liked' ? (
            <LinearGradient
              colors={['#7209B7', '#F72585']}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.tabGradient}
            >
              <Text style={styles.tabTextActive}>❤️ Liked</Text>
            </LinearGradient>
          ) : (
            <Text style={styles.tabText}>❤️ Liked</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Loading */}
      {loading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#F72585" />
          <Text style={styles.loadingText}>Loading artworks...</Text>
        </View>
      ) : (
        <FlatList
          data={displayedArtworks}
          keyExtractor={item => item.id}
          renderItem={({ item }) => <ArtworkCard item={item} />}
          contentContainerStyle={styles.feed}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="image-outline" size={48} color="rgba(255,255,255,0.2)" />
              <Text style={styles.emptyText}>
                {activeTab === 'liked' ? 'No liked artworks yet' : 'No artworks yet'}
              </Text>
            </View>
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d1a' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  welcome: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 2,
  },
  welcomePseudo: {
    color: '#F72585',
    fontWeight: '700',
  },
  logo: { fontSize: 20, fontWeight: 'bold', color: '#fff' },
  logoPink: { color: '#F72585' },
  addBtn: { borderRadius: 20, overflow: 'hidden' },
  addBtnGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  addBtnText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: 16,
    marginBottom: 12,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 10,
    overflow: 'hidden',
  },
  tab: { flex: 1, alignItems: 'center', justifyContent: 'center', borderRadius: 10, overflow: 'hidden' },
  tabActive: {},
  tabGradient: { width: '100%', alignItems: 'center', paddingVertical: 9 },
  tabText: { color: 'rgba(255,255,255,0.35)', fontWeight: '600', fontSize: 12, paddingVertical: 9 },
  tabTextActive: { color: '#fff', fontWeight: '700', fontSize: 12 },
  loadingContainer: { flex: 1, alignItems: 'center', justifyContent: 'center', gap: 12 },
  loadingText: { color: 'rgba(255,255,255,0.4)', fontSize: 14 },
  feed: { paddingHorizontal: 16, paddingBottom: 100 },
  card: {
    backgroundColor: '#1a1030',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  logoutBtn: {
    width: 36,
    height: 36,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardImage: { width: '100%', height: 200 },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 12,
  },
  cardInfo: { gap: 4 },
  authorRow: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  authorText: { color: '#fff', fontWeight: '700', fontSize: 13 },
  locationRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  locationText: { color: 'rgba(255,255,255,0.35)', fontSize: 11 },
  likeBtn: {
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(247,37,133,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(247,37,133,0.2)',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    flexDirection: 'row',
  },
  likeBtnActive: { backgroundColor: 'rgba(247,37,133,0.2)', borderColor: '#F72585' },
  likeCount: { color: 'rgba(255,255,255,0.4)', fontSize: 12, fontWeight: '600' },
  likeCountActive: { color: '#F72585' },
  empty: { alignItems: 'center', justifyContent: 'center', paddingTop: 80, gap: 12 },
  emptyText: { color: 'rgba(255,255,255,0.3)', fontSize: 14 },
});
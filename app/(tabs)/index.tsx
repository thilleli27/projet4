import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const FAKE_ARTWORKS = [
  {
    id: '1',
    author: 'MuralHunter',
    likes: 142,
    location: 'Paris, 11e',
    image: 'https://picsum.photos/seed/art1/400/300',
    liked: false,
  },
  {
    id: '2',
    author: 'StreetEyes_FR',
    likes: 87,
    location: 'Belleville',
    image: 'https://picsum.photos/seed/art2/400/300',
    liked: true,
  },
  {
    id: '3',
    author: 'GraffitiLover',
    likes: 213,
    location: 'Oberkampf',
    image: 'https://picsum.photos/seed/art3/400/300',
    liked: false,
  },
];

export default function HomeScreen() {
  const [artworks, setArtworks] = useState(FAKE_ARTWORKS);
  const [activeTab, setActiveTab] = useState<'all' | 'liked'>('all');

  const handleLike = (id: string) => {
    setArtworks(prev =>
      prev.map(art =>
        art.id === id
          ? { ...art, liked: !art.liked, likes: art.liked ? art.likes - 1 : art.likes + 1 }
          : art
      )
    );
  };

  const displayedArtworks = activeTab === 'liked'
    ? artworks.filter(art => art.liked)
    : artworks;

  const ArtworkCard = ({ item }: { item: typeof FAKE_ARTWORKS[0] }) => (
    <TouchableOpacity
      style={styles.card}
      onPress={() => alert(`Ouvrir Google Maps pour : ${item.location}`)}
      activeOpacity={0.9}
    >
      <Image source={{ uri: item.image }} style={styles.cardImage} />
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
          style={[styles.likeBtn, item.liked && styles.likeBtnActive]}
          onPress={() => handleLike(item.id)}
        >
          <Ionicons
            name={item.liked ? 'heart' : 'heart-outline'}
            size={18}
            color={item.liked ? '#F72585' : 'rgba(255,255,255,0.5)'}
          />
          <Text style={[styles.likeCount, item.liked && styles.likeCountActive]}>
            {item.likes}
          </Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#0d0d1a', '#0d0d1a']} style={styles.header}>
        <Text style={styles.logo}>
          Local<Text style={styles.logoPink}>Street</Text>Art
        </Text>
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
      </LinearGradient>

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

      <FlatList
        data={displayedArtworks}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <ArtworkCard item={item} />}
        contentContainerStyle={styles.feed}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Ionicons name="heart-dislike-outline" size={48} color="rgba(255,255,255,0.2)" />
            <Text style={styles.emptyText}>No artworks yet</Text>
          </View>
        }
      />
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
  feed: { paddingHorizontal: 16, paddingBottom: 100 },
  card: {
    backgroundColor: '#1a1030',
    borderRadius: 14,
    overflow: 'hidden',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.07)',
  },
  cardImage: { width: '100%', height: 200 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 12 },
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
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useEffect } from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function SplashScreen() {

  useEffect(() => {
    // Après 2.5 secondes, on redirige vers Login
    const timer = setTimeout(() => {
      router.replace('/login');
    }, 2500);

    return () => clearTimeout(timer);
  }, []);

  return (
    <LinearGradient
      colors={['#3A0CA3', '#7209B7', '#F72585']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.container}
    >
      {/* Icône caméra dans un carré arrondi */}
      <View style={styles.iconBox}>
        <Ionicons name="camera" size={48} color="#fff" />
      </View>

      {/* Nom de l'app */}
      <Text style={styles.title}>
        Local<Text style={styles.titlePink}>Street</Text>{'\n'}Art
      </Text>

      {/* Tagline */}
      <Text style={styles.tagline}>
        Document ephemeral street art
      </Text>

      {/* Petit point de chargement */}
      <View style={styles.dotsRow}>
        <View style={[styles.dot, styles.dotActive]} />
        <View style={styles.dot} />
        <View style={styles.dot} />
      </View>

    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  iconBox: {
    width: 90,
    height: 90,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  title: {
    fontFamily: 'SpaceMono', // on changera par Permanent Marker avec Firebase
    fontSize: 36,
    color: '#fff',
    textAlign: 'center',
    lineHeight: 42,
  },
  titlePink: {
    color: '#F72585',
  },
  tagline: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.6)',
    textAlign: 'center',
  },
  dotsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 32,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(255,255,255,0.25)',
  },
  dotActive: {
    backgroundColor: '#fff',
    width: 24,
  },
}); 

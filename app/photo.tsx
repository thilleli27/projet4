import { Ionicons } from '@expo/vector-icons';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { LinearGradient } from 'expo-linear-gradient';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useRef, useState } from 'react';
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';

export default function PhotoScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [locationPermission, requestLocationPermission] = Location.useForegroundPermissions();
  const [photo, setPhoto] = useState<string | null>(null);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);
  const [loading, setLoading] = useState(false);
  const cameraRef = useRef<CameraView>(null);

  // Prendre une photo
  const handleTakePhoto = async () => {
    if (!cameraRef.current) return;

    setLoading(true);
    try {
      // Prendre la photo
      const pic = await cameraRef.current.takePictureAsync({ quality: 0.7 });
      setPhoto(pic!.uri);

      // Récupérer la géolocalisation en même temps
      const loc = await Location.getCurrentPositionAsync({});
      setLocation({
        lat: loc.coords.latitude,
        lng: loc.coords.longitude,
      });
    } catch (e) {
      alert('Error taking photo');
    }
    setLoading(false);
  };

  // Sauvegarder l'oeuvre
  const handleSave = () => {
    // Plus tard : on sauvegarde sur Firebase ici
    alert('Artwork saved! (Firebase coming soon)');
    router.back();
  };

  // Recommencer
  const handleRetake = () => {
    setPhoto(null);
    setLocation(null);
  };

  // Pas encore de permission caméra
  if (!permission) {
    return <View style={styles.container} />;
  }

  // Permission refusée
  if (!permission.granted) {
    return (
      <View style={styles.permissionContainer}>
        <Ionicons name="camera-outline" size={64} color="rgba(255,255,255,0.3)" />
        <Text style={styles.permissionTitle}>Camera access needed</Text>
        <Text style={styles.permissionText}>
          We need your camera to photograph street artworks
        </Text>
        <TouchableOpacity style={styles.btnWrapper} onPress={requestPermission}>
          <LinearGradient
            colors={['#3A0CA3', '#7209B7', '#F72585']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btn}
          >
            <Text style={styles.btnText}>Allow Camera</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={22} color="rgba(255,255,255,0.7)" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Artwork</Text>
        <View style={{ width: 32 }} />
      </View>

      {/* Photo prise ou Caméra */}
      {photo ? (
        // Aperçu de la photo prise
        <View style={styles.previewContainer}>
          <Image source={{ uri: photo }} style={styles.preview} />

          {/* Infos géolocalisation */}
          <View style={styles.infoBox}>
            <View style={styles.infoRow}>
              <Ionicons name="location-outline" size={16} color="#7209B7" />
              {location ? (
                <Text style={styles.infoText}>
                  {location.lat.toFixed(4)}° N, {location.lng.toFixed(4)}° E
                </Text>
              ) : (
                <Text style={styles.infoText}>Getting location...</Text>
              )}
            </View>
            <View style={styles.infoRow}>
              <Ionicons name="person-outline" size={16} color="#7209B7" />
              <Text style={styles.infoText}>@YourPseudo</Text>
            </View>
          </View>

          {/* Boutons */}
          <View style={styles.actionRow}>
            {/* Reprendre */}
            <TouchableOpacity style={styles.retakeBtn} onPress={handleRetake}>
              <Ionicons name="refresh-outline" size={20} color="#fff" />
              <Text style={styles.retakeBtnText}>Retake</Text>
            </TouchableOpacity>

            {/* Sauvegarder */}
            <TouchableOpacity style={styles.saveWrapper} onPress={handleSave}>
              <LinearGradient
                colors={['#7209B7', '#F72585']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.saveBtn}
              >
                <Ionicons name="checkmark-outline" size={20} color="#fff" />
                <Text style={styles.saveBtnText}>Save Artwork</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      ) : (
        // Viewfinder caméra
        <View style={styles.cameraContainer}>
          <CameraView style={styles.camera} ref={cameraRef} facing="back">
            {/* Coins du viewfinder */}
            <View style={styles.vfCorner} />
            <View style={[styles.vfCorner, styles.vfTR]} />
            <View style={[styles.vfCorner, styles.vfBL]} />
            <View style={[styles.vfCorner, styles.vfBR]} />
          </CameraView>

          {/* Bouton capture */}
          <View style={styles.captureSection}>
            <Text style={styles.captureHint}>Point at the artwork and tap to capture</Text>
            <TouchableOpacity
              style={styles.captureBtn}
              onPress={handleTakePhoto}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="large" />
              ) : (
                <LinearGradient
                  colors={['#7209B7', '#F72585']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.captureBtnGradient}
                >
                  <Ionicons name="camera" size={32} color="#fff" />
                </LinearGradient>
              )}
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d1a',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 56,
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  backBtn: {
    width: 32,
    height: 32,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#F72585',
  },
  permissionContainer: {
    flex: 1,
    backgroundColor: '#0d0d1a',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    gap: 16,
  },
  permissionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
    textAlign: 'center',
  },
  permissionText: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.4)',
    textAlign: 'center',
    lineHeight: 22,
  },
  btnWrapper: {
    borderRadius: 13,
    overflow: 'hidden',
    width: '100%',
    marginTop: 8,
  },
  btn: {
    paddingVertical: 14,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
  cameraContainer: {
    flex: 1,
    gap: 0,
  },
  camera: {
    flex: 1,
    margin: 16,
    borderRadius: 16,
    overflow: 'hidden',
    position: 'relative',
  },
  vfCorner: {
    position: 'absolute',
    top: 16,
    left: 16,
    width: 24,
    height: 24,
    borderTopWidth: 2,
    borderLeftWidth: 2,
    borderColor: '#F72585',
    borderTopLeftRadius: 4,
  },
  vfTR: {
    top: 16,
    left: undefined,
    right: 16,
    borderTopWidth: 2,
    borderLeftWidth: 0,
    borderRightWidth: 2,
    borderTopRightRadius: 4,
    borderTopLeftRadius: 0,
  },
  vfBL: {
    top: undefined,
    bottom: 16,
    left: 16,
    borderTopWidth: 0,
    borderLeftWidth: 2,
    borderBottomWidth: 2,
    borderBottomLeftRadius: 4,
    borderTopLeftRadius: 0,
  },
  vfBR: {
    top: undefined,
    bottom: 16,
    left: undefined,
    right: 16,
    borderTopWidth: 0,
    borderLeftWidth: 0,
    borderRightWidth: 2,
    borderBottomWidth: 2,
    borderBottomRightRadius: 4,
    borderTopLeftRadius: 0,
  },
  captureSection: {
    alignItems: 'center',
    paddingVertical: 24,
    gap: 16,
  },
  captureHint: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.3)',
    textAlign: 'center',
  },
  captureBtn: {
    width: 72,
    height: 72,
    borderRadius: 36,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  captureBtnGradient: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewContainer: {
    flex: 1,
    padding: 16,
    gap: 16,
  },
  preview: {
    flex: 1,
    borderRadius: 16,
  },
  infoBox: {
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: 12,
    padding: 14,
    gap: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 13,
  },
  actionRow: {
    flexDirection: 'row',
    gap: 12,
    paddingBottom: 16,
  },
  retakeBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 13,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
  },
  retakeBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  saveWrapper: {
    flex: 2,
    borderRadius: 13,
    overflow: 'hidden',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 14,
  },
  saveBtnText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
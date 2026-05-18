import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform, ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function LoginScreen() {
  // Les valeurs des champs du formulaire
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  // Fonction de connexion — on branchera Firebase après
  const handleLogin = () => {
    // Vérification basique
    if (!email || !password) {
      setError('Please fill in all fields');
      return;
    }
    // Pour l'instant on va direct sur Home
    // Plus tard : Firebase Auth ici
    router.replace('/(tabs)');
  };

  return (
    // KeyboardAvoidingView = remonte le contenu quand le clavier s'ouvre
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Logo en haut */}
        <View style={styles.logoSection}>
          <LinearGradient
            colors={['#3A0CA3', '#7209B7', '#F72585']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.logoBox}
          >
            <Ionicons name="camera" size={32} color="#fff" />
          </LinearGradient>
          <Text style={styles.logoText}>
            Local<Text style={styles.logoPink}>Street</Text>Art
          </Text>
        </View>

        {/* Titre */}
        <Text style={styles.title}>Welcome back</Text>
        <Text style={styles.subtitle}>Sign in to continue</Text>

        {/* Message d'erreur */}
        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={16} color="#F72585" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {/* Champ Email */}
        <Text style={styles.label}>Email</Text>
        <View style={styles.inputBox}>
          <Ionicons name="mail-outline" size={18} color="rgba(255,255,255,0.3)" />
          <TextInput
            style={styles.input}
            placeholder="your@email.com"
            placeholderTextColor="rgba(255,255,255,0.25)"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
        </View>

        {/* Champ Password */}
        <Text style={styles.label}>Password</Text>
        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={18} color="rgba(255,255,255,0.3)" />
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="rgba(255,255,255,0.25)"
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
          />
          {/* Bouton afficher/cacher le mot de passe */}
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color="rgba(255,255,255,0.3)"
            />
          </TouchableOpacity>
        </View>

        {/* Bouton Sign In */}
        <TouchableOpacity
          style={styles.btnWrapper}
          onPress={handleLogin}
          activeOpacity={0.85}
        >
          <LinearGradient
            colors={['#3A0CA3', '#7209B7', '#F72585']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btn}
          >
            <Text style={styles.btnText}>Sign In</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Séparateur */}
        <View style={styles.divider}>
          <View style={styles.dividerLine} />
          <Text style={styles.dividerText}>or</Text>
          <View style={styles.dividerLine} />
        </View>

        {/* Bouton S'inscrire */}
        <TouchableOpacity
          style={styles.registerBtn}
          onPress={() => router.push('/register')}
        >
          <Text style={styles.registerText}>
            No account yet? <Text style={styles.registerLink}>Create one</Text>
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0d0d1a',
  },
  scrollContent: {
    padding: 24,
    paddingTop: 60,
    flexGrow: 1,
  },
  logoSection: {
    alignItems: 'center',
    marginBottom: 40,
    gap: 12,
  },
  logoBox: {
    width: 64,
    height: 64,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#fff',
  },
  logoPink: {
    color: '#F72585',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.4)',
    marginBottom: 28,
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(247,37,133,0.1)',
    borderWidth: 1,
    borderColor: 'rgba(247,37,133,0.3)',
    borderRadius: 10,
    padding: 10,
    marginBottom: 16,
  },
  errorText: {
    color: '#F72585',
    fontSize: 13,
  },
  label: {
    fontSize: 11,
    fontWeight: '700',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 6,
  },
  inputBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    backgroundColor: 'rgba(255,255,255,0.055)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 13,
    marginBottom: 16,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    fontFamily: 'System',
  },
  btnWrapper: {
    borderRadius: 13,
    overflow: 'hidden',
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
  divider: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginVertical: 24,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  dividerText: {
    color: 'rgba(255,255,255,0.3)',
    fontSize: 12,
  },
  registerBtn: {
    alignItems: 'center',
  },
  registerText: {
    color: 'rgba(255,255,255,0.4)',
    fontSize: 13,
  },
  registerLink: {
    color: '#F72585',
    fontWeight: '700',
  },
});
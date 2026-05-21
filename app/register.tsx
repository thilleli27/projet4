import { auth } from '@/constants/firebase';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

export default function RegisterScreen() {
  const [pseudo, setPseudo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    // Vérification que les champs ne sont pas vides
    if (!pseudo || !email || !password || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }
  
    // Vérification longueur du pseudo
    if (pseudo.length < 3) {
      setError('Pseudonym must be at least 3 characters');
      return;
    }
  
    // Vérification que le pseudo ne contient pas de caractères spéciaux
    const pseudoRegex = /^[a-zA-Z0-9_]+$/;
    if (!pseudoRegex.test(pseudo)) {
      setError('Pseudonym can only contain letters, numbers and _');
      return;
    }
  
    // Vérification du format email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Invalid email format');
      return;
    }
  
    // Vérification longueur mot de passe
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
  
    // Vérification que les mots de passe correspondent
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }
  
    setLoading(true);
    setError('');
  
    try {
      // Crée le compte Firebase
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      
      // Sauvegarde le pseudo dans le profil Firebase
      await updateProfile(userCredential.user, {
        displayName: pseudo,
      });
  
      // Compte créé → on va sur Home
      router.replace('/(tabs)');
    } catch (e: any) {
      switch (e.code) {
        case 'auth/email-already-in-use':
          setError('This email is already used');
          break;
        case 'auth/invalid-email':
          setError('Invalid email address');
          break;
        case 'auth/weak-password':
          setError('Password must be at least 6 characters');
          break;
        default:
          setError('An error occurred. Please try again');
      }
    }
    setLoading(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="chevron-back" size={20} color="rgba(255,255,255,0.5)" />
          <Text style={styles.backText}>Back to Login</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Join the{'\n'}<Text style={styles.titlePink}>community</Text></Text>
        <Text style={styles.subtitle}>Create your account and start documenting street art</Text>

        {error ? (
          <View style={styles.errorBox}>
            <Ionicons name="alert-circle-outline" size={16} color="#F72585" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        <Text style={styles.label}>Pseudonym</Text>
        <View style={styles.inputBox}>
          <Ionicons name="at" size={18} color="rgba(255,255,255,0.3)" />
          <TextInput
            style={styles.input}
            placeholder="YourPseudo"
            placeholderTextColor="rgba(255,255,255,0.25)"
            value={pseudo}
            onChangeText={setPseudo}
            autoCapitalize="none"
          />
        </View>

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
          <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
            <Ionicons
              name={showPassword ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color="rgba(255,255,255,0.3)"
            />
          </TouchableOpacity>
        </View>

        <Text style={styles.label}>Confirm Password</Text>
        <View style={styles.inputBox}>
          <Ionicons name="lock-closed-outline" size={18} color="rgba(255,255,255,0.3)" />
          <TextInput
            style={styles.input}
            placeholder="••••••••"
            placeholderTextColor="rgba(255,255,255,0.25)"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry={!showPassword}
          />
          {confirmPassword.length > 0 && (
            <Ionicons
              name={password === confirmPassword ? 'checkmark-circle' : 'close-circle'}
              size={18}
              color={password === confirmPassword ? '#4ade80' : '#F72585'}
            />
          )}
        </View>

        <TouchableOpacity
          style={styles.btnWrapper}
          onPress={handleRegister}
          activeOpacity={0.85}
          disabled={loading}
        >
          <LinearGradient
            colors={['#3A0CA3', '#7209B7', '#F72585']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.btn}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.btnText}>Create my account →</Text>
            )}
          </LinearGradient>
        </TouchableOpacity>

        <TouchableOpacity style={styles.loginBtn} onPress={() => router.back()}>
          <Text style={styles.loginText}>
            Already have an account? <Text style={styles.loginLink}>Sign in</Text>
          </Text>
        </TouchableOpacity>

      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0d0d1a' },
  scrollContent: { padding: 24, paddingTop: 60, flexGrow: 1 },
  backBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, marginBottom: 28 },
  backText: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  title: { fontSize: 32, fontWeight: 'bold', color: '#fff', marginBottom: 8, lineHeight: 38 },
  titlePink: { color: '#F72585' },
  subtitle: { fontSize: 13, color: 'rgba(255,255,255,0.35)', marginBottom: 28, lineHeight: 20 },
  errorBox: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: 'rgba(247,37,133,0.1)', borderWidth: 1,
    borderColor: 'rgba(247,37,133,0.3)', borderRadius: 10, padding: 10, marginBottom: 16,
  },
  errorText: { color: '#F72585', fontSize: 13 },
  label: { fontSize: 11, fontWeight: '700', color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: 6 },
  inputBox: {
    flexDirection: 'row', alignItems: 'center', gap: 10,
    backgroundColor: 'rgba(255,255,255,0.055)', borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 13, marginBottom: 16,
  },
  input: { flex: 1, color: '#fff', fontSize: 14 },
  btnWrapper: { borderRadius: 13, overflow: 'hidden', marginTop: 8, marginBottom: 16 },
  btn: { paddingVertical: 14, alignItems: 'center' },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
  loginBtn: { alignItems: 'center', paddingVertical: 8 },
  loginText: { color: 'rgba(255,255,255,0.4)', fontSize: 13 },
  loginLink: { color: '#F72585', fontWeight: '700' },
});
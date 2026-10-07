import { useEffect, useState } from 'react';
import {
  FlatList,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { buscarDuplicado, crearMateriaValida, validarFormulario } from '@/features/materias/materia.logic';
import { cargarMaterias, guardarMaterias } from '@/features/materias/materia.storage';
import type { Materia, MateriaValidationErrors } from '@/features/materias/materia.types';

const COLORS = {
  header: '#001F3F',
  primary: '#357ca5',
  background: '#e2e4e9',
  card: '#FFFFFF',
  text: '#111111',
  secondary: '#5a6e82',
  border: '#b5bbc8',
  error: '#d33724',
};

const EMPTY_ERRORS: MateriaValidationErrors = { nombre: null, nota: null };

export default function HomeScreen() {
  const [materias, setMaterias] = useState<Materia[]>([]);
  const [nombre, setNombre] = useState('');
  const [notaTexto, setNotaTexto] = useState('');
  const [errors, setErrors] = useState(EMPTY_ERRORS);
  const [message, setMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    cargarMaterias()
      .then((loaded) => {
        if (mounted) {
          setMaterias(loaded);
        }
      })
      .catch(() => {
        if (mounted) {
          setMessage('No se pudieron cargar las materias.');
          setMaterias([]);
        }
      })
      .finally(() => {
        if (mounted) {
          setIsLoading(false);
        }
      });

    return () => {
      mounted = false;
    };
  }, []);

  async function handleSave() {
    setMessage(null);
    const validation = validarFormulario(nombre, notaTexto);
    setErrors(validation.errors);
    if (!validation.isValid) {
      return;
    }

    if (buscarDuplicado(nombre, materias)) {
      setMessage('La materia ya está registrada.');
      return;
    }

    const materia = crearMateriaValida(nombre, notaTexto);
    const nextMaterias = [...materias, materia];
    try {
      await guardarMaterias(nextMaterias);
      setMaterias(nextMaterias);
      setNombre('');
      setNotaTexto('');
      setErrors(EMPTY_ERRORS);
      setMessage('Materia guardada correctamente.');
    } catch {
      setMessage('No se pudo guardar la materia. Intenta nuevamente.');
    }
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Mis materias</Text>
          <Text style={styles.headerSubtitle}>Registra tu nota del primer bimestre</Text>
        </View>

        <FlatList
          data={materias}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.listContent}
          ListHeaderComponent={
            <View style={styles.formCard}>
              <Text style={styles.sectionTitle}>Registrar materia</Text>
              <Text style={styles.label}>Nombre de la materia</Text>
              <TextInput
                value={nombre}
                onChangeText={setNombre}
                placeholder="Ej. Matemáticas"
                placeholderTextColor={COLORS.secondary}
                style={styles.input}
                accessibilityLabel="Nombre de la materia"
                returnKeyType="next"
              />
              {errors.nombre && <Text style={styles.errorText}>{errors.nombre}</Text>}

              <Text style={styles.label}>Nota del primer bimestre</Text>
              <TextInput
                value={notaTexto}
                onChangeText={setNotaTexto}
                placeholder="0.00 a 20.00"
                placeholderTextColor={COLORS.secondary}
                keyboardType="decimal-pad"
                style={styles.input}
                accessibilityLabel="Nota del primer bimestre"
              />
              <Text style={styles.helpText}>Usa punto como separador decimal.</Text>
              {errors.nota && <Text style={styles.errorText}>{errors.nota}</Text>}

              <Pressable
                onPress={handleSave}
                style={({ pressed }) => [styles.button, pressed && styles.buttonPressed]}
                accessibilityRole="button"
                accessibilityLabel="Guardar materia">
                <Text style={styles.buttonText}>Guardar materia</Text>
              </Pressable>
              {message && <Text style={styles.messageText}>{message}</Text>}
            </View>
          }
          ListEmptyComponent={
            isLoading ? (
              <Text style={styles.emptyText}>Cargando materias...</Text>
            ) : (
              <Text style={styles.emptyText}>Todavía no tienes materias registradas.</Text>
            )
          }
          renderItem={({ item }) => (
            <View style={styles.materiaCard}>
              <Text style={styles.materiaName}>{item.nombre}</Text>
              <Text style={styles.materiaDetail}>
                Primer bimestre: {item.notaPrimerBimestre}
              </Text>
              <Text style={styles.materiaDetail}>Segundo bimestre: pendiente</Text>
            </View>
          )}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: COLORS.header,
    paddingHorizontal: 20,
    paddingVertical: 18,
  },
  headerTitle: {
    color: COLORS.card,
    fontSize: 24,
    fontWeight: '700',
  },
  headerSubtitle: {
    color: COLORS.card,
    fontSize: 14,
    marginTop: 4,
  },
  listContent: {
    padding: 16,
    gap: 12,
  },
  formCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  label: {
    color: COLORS.text,
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 6,
  },
  input: {
    minHeight: 48,
    borderColor: COLORS.border,
    borderWidth: 1,
    borderRadius: 8,
    color: COLORS.text,
    backgroundColor: COLORS.card,
    paddingHorizontal: 12,
    fontSize: 16,
    marginBottom: 8,
  },
  helpText: {
    color: COLORS.secondary,
    fontSize: 13,
    marginBottom: 6,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 14,
    marginBottom: 8,
  },
  button: {
    minHeight: 48,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: COLORS.primary,
    borderRadius: 8,
    marginTop: 8,
    paddingHorizontal: 16,
  },
  buttonPressed: {
    opacity: 0.8,
  },
  buttonText: {
    color: COLORS.card,
    fontSize: 16,
    fontWeight: '700',
  },
  messageText: {
    color: COLORS.text,
    fontSize: 14,
    marginTop: 12,
  },
  emptyText: {
    color: COLORS.secondary,
    fontSize: 15,
    textAlign: 'center',
    padding: 16,
  },
  materiaCard: {
    backgroundColor: COLORS.card,
    borderRadius: 12,
    padding: 16,
  },
  materiaName: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 8,
  },
  materiaDetail: {
    color: COLORS.text,
    fontSize: 15,
    marginTop: 3,
  },
});

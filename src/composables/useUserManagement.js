import { ref } from 'vue';
import { useFirestore } from './useFirestore';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/firebase/config';
export function useUserManagement() {
    const { addDocument, getDocument, updateDocument } = useFirestore();
    const loading = ref(false);
    const error = ref(null);
    // Crear o actualizar perfil de usuario automáticamente
    const createOrUpdateUserProfile = async (firebaseUser, additionalData) => {
        console.log('createOrUpdateUserProfile iniciado para:', firebaseUser.email);
        loading.value = true;
        error.value = null;
        try {
            // Comparación más robusta para evitar problemas de encoding
            const isAdminValue = firebaseUser.email?.trim().toLowerCase() === 'melanasdoblaktocas3@gmail.com';
            console.log('Verificando isAdmin:', {
                userEmail: firebaseUser.email,
                userEmailLength: firebaseUser.email?.length,
                adminEmail: 'melanasdoblaktocas3@gmail.com',
                adminEmailLength: 'melanasdoblaktocas3@gmail.com'.length,
                areEqual: firebaseUser.email === 'melanasdoblaktocas3@gmail.com',
                isAdminValue,
                userEmailCharCodes: firebaseUser.email?.split('').map(c => c.charCodeAt(0)),
                adminEmailCharCodes: 'melanasdoblaktocas3@gmail.com'.split('').map(c => c.charCodeAt(0))
            });
            const userData = {
                email: firebaseUser.email,
                displayName: firebaseUser.displayName || 'Usuario',
                avatar: firebaseUser.photoURL || undefined,
                isAdmin: isAdminValue,
                emailVerified: firebaseUser.emailVerified,
                ...additionalData
            };
            // Si el displayName está vacío o es solo la parte del email, intentar obtenerlo del perfil de Firebase
            if (!userData.displayName || userData.displayName === 'Usuario') {
                // Recargar el usuario para obtener el displayName actualizado
                await firebaseUser.reload();
                if (firebaseUser.displayName) {
                    userData.displayName = firebaseUser.displayName;
                }
            }
            console.log('Datos del usuario a guardar:', userData);
            // Verificar si el usuario ya existe
            console.log('Verificando si el usuario existe con ID:', firebaseUser.uid);
            const existingUser = await getDocument('userProfiles', firebaseUser.uid);
            console.log('Usuario existente encontrado:', existingUser);
            if (existingUser) {
                // Actualizar usuario existente, pero mantener isAdmin si ya existe
                console.log('Actualizando usuario existente...');
                const updateData = {
                    ...userData,
                    // isAdmin: existingUser.isAdmin !== undefined ? existingUser.isAdmin : isAdminValue, // Mantener isAdmin existente
                    emailVerified: firebaseUser.emailVerified
                };
                console.log('Datos de actualización:', updateData);
                await updateDocument('userProfiles', firebaseUser.uid, updateData);
                console.log('Perfil de usuario actualizado:', firebaseUser.email);
            }
            else {
                // Crear nuevo usuario usando el UID como ID del documento
                console.log('Creando nuevo usuario...');
                const docRef = doc(db, 'userProfiles', firebaseUser.uid);
                await setDoc(docRef, {
                    ...userData,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                console.log('Nuevo perfil de usuario creado con ID:', firebaseUser.uid, 'para:', firebaseUser.email);
            }
            return true;
        }
        catch (err) {
            error.value = `Error al crear/actualizar perfil: ${err}`;
            console.error('Error en createOrUpdateUserProfile:', err);
            return false;
        }
        finally {
            loading.value = false;
        }
    };
    // Obtener perfil de usuario
    const getUserProfile = async (userId) => {
        loading.value = true;
        error.value = null;
        try {
            const userProfile = await getDocument('userProfiles', userId);
            if (userProfile) {
                return {
                    id: userProfile.id,
                    email: userProfile.email || '',
                    displayName: userProfile.displayName,
                    bio: userProfile.bio,
                    avatar: userProfile.avatar,
                    isAdmin: userProfile.isAdmin || false,
                    emailVerified: userProfile.emailVerified || false,
                    createdAt: userProfile.createdAt?.toDate() || new Date(),
                    updatedAt: userProfile.updatedAt?.toDate() || new Date()
                };
            }
            return null;
        }
        catch (err) {
            error.value = `Error al obtener perfil: ${err}`;
            return null;
        }
        finally {
            loading.value = false;
        }
    };
    // Verificar si el usuario es administrador
    const isUserAdmin = (userEmail) => {
        const result = userEmail?.trim().toLowerCase() === 'melanasdoblaktocas3@gmail.com';
        console.log('isUserAdmin check:', {
            userEmail,
            adminEmail: 'melanasdoblaktocas3@gmail.com',
            result
        });
        return result;
    };
    return {
        loading,
        error,
        createOrUpdateUserProfile,
        getUserProfile,
        isUserAdmin
    };
}

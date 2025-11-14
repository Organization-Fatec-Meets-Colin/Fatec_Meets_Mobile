import { StatusBar } from 'expo-status-bar';
import React, { useContext, useState, useEffect } from 'react';
import { View, Text, StyleSheet, Alert, TouchableOpacity, TextInput, ActivityIndicator, RefreshControl, Dimensions, Modal, ScrollView } from 'react-native';
import { Image } from 'expo-image';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import * as ImagePicker from 'expo-image-picker';
import { AuthContext } from '../../../context/AuthContext';
import StylizedButton from '../../components/StylizedButton';
import StylizedInput from '../../components/StylizedInput';
import Post from '../../components/Post';
import { updateUser, getUserById } from '../../service/userService';
import { listPostagens } from '../../service/postagemService';

export default function UserScreen({ navigation }) {
    const { logout, user, updateUser: updateContextUser } = useContext(AuthContext);

    // Estados
    const [userData, setUserData] = useState(user);
    const [userPosts, setUserPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [editedBio, setEditedBio] = useState(user?.bio || '');
    const [editedNome, setEditedNome] = useState(user?.nome || '');
    const [saving, setSaving] = useState(false);

    // Buscar dados do usuário e posts
    const fetchUserData = async () => {
        try {
            setLoading(true);

            // Buscar dados atualizados do usuário
            const updatedUser = await getUserById(user.id);
            setUserData(updatedUser);
            setEditedBio(updatedUser.bio || '');
            setEditedNome(updatedUser.nome || '');

            // Buscar posts do usuário
            const allPosts = await listPostagens();
            const myPosts = allPosts.filter(post => post.usuario.id === user.id);
            setUserPosts(myPosts);
        } catch (error) {
            console.error('Erro ao buscar dados:', error);
            Alert.alert('Erro', 'Não foi possível carregar os dados do perfil.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchUserData();
        setRefreshing(false);
    };

    // Selecionar foto de perfil
    const pickProfileImage = async () => {
        try {
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert('Permissão necessária', 'Precisamos de permissão para acessar suas fotos.');
                return;
            }

            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsEditing: true,
                aspect: [1, 1],
                quality: 0.8,
            });

            if (!result.canceled && result.assets && result.assets[0]) {
                const imageUri = result.assets[0].uri;

                // Atualizar localmente primeiro
                const updatedData = { ...userData, fotoPerfil: imageUri };
                setUserData(updatedData);

                // Salvar no backend
                await saveProfile({ fotoPerfil: imageUri });
            }
        } catch (error) {
            console.error('Erro ao selecionar imagem:', error);
            Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
        }
    };

    // Salvar alterações do perfil
    const saveProfile = async (additionalData = {}) => {
        try {
            setSaving(true);

            const updatedData = {
                nome: editedNome.trim() || userData.nome,
                email: userData.email,
                bio: editedBio.trim(),
                fotoPerfil: userData.fotoPerfil,
                ...additionalData
            };

            // Atualizar no backend
            const updated = await updateUser(user.id, updatedData);

            // Atualizar contexto
            await updateContextUser(updated);

            // Atualizar estado local
            setUserData(updated);
            setEditMode(false);

            Alert.alert('Sucesso', 'Perfil atualizado com sucesso!');
        } catch (error) {
            console.error('Erro ao salvar perfil:', error);
            Alert.alert(
                'Erro',
                error.response?.data?.message || 'Não foi possível atualizar o perfil. Tente novamente.'
            );
        } finally {
            setSaving(false);
        }
    };

    const handleLogout = () => {
        Alert.alert(
            'Sair',
            'Deseja realmente sair da sua conta?',
            [
                {
                    text: 'Cancelar',
                    style: 'cancel'
                },
                {
                    text: 'Sair',
                    style: 'destructive',
                    onPress: async () => {
                        await logout();
                    }
                }
            ]
        );
    };

    const handlePostPress = (post) => {
        navigation.navigate('PostDetails', { post });
    };

    if (loading && !refreshing) {
        return (
            <View style={[styles.safeArea, styles.centerContent]}>
                <StatusBar style="dark" />
                <ActivityIndicator size="large" color="#9C2222" />
                <Text style={styles.loadingText}>Carregando perfil...</Text>
            </View>
        );
    }

    return (
        <View style={styles.safeArea}>
            <StatusBar style="dark" />
            <ScrollView
                style={styles.scrollView}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#9C2222']}
                        tintColor="#9C2222"
                    />
                }
            >
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>Perfil</Text>
                </View>

                {/* Informações do Usuário */}
                {!editMode ? (
                    <View style={styles.profileContainer}>
                        {/* Foto de Perfil */}
                        <TouchableOpacity
                            style={styles.profileImageContainer}
                            onPress={pickProfileImage}
                            activeOpacity={0.7}
                        >
                            <Image
                                style={styles.profileImage}
                                source={{
                                    uri: userData?.fotoPerfil || 'https://via.placeholder.com/150',
                                }}
                                contentFit="cover"
                                transition={300}
                            />
                        </TouchableOpacity>

                        {/* Informações no Centro */}
                        <View style={styles.userInfoCenter}>
                            <View style={styles.nameRow}>
                                <Text style={styles.userName} numberOfLines={1}>{userData?.nome}</Text>
                            </View>
                            <Text style={styles.userHandle} numberOfLines={1}>{userData?.email}</Text>
                            {userData?.bio && (
                                <Text style={styles.userBio} numberOfLines={3}>{userData.bio}</Text>
                            )}
                        </View>

                        {/* Ícone de Editar */}
                        <TouchableOpacity
                            style={styles.editIconButton}
                            onPress={() => setEditMode(true)}
                        >
                            <FontAwesome name="edit" size={20} color="#666" />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.editModeContainer}>
                        {/* Foto de Perfil em Modo de Edição */}
                        <TouchableOpacity
                            style={styles.editProfileImageContainer}
                            onPress={pickProfileImage}
                            activeOpacity={0.7}
                        >
                            <Image
                                style={styles.profileImage}
                                source={{
                                    uri: userData?.fotoPerfil || 'https://via.placeholder.com/150',
                                }}
                                contentFit="cover"
                                transition={300}
                            />
                            <View style={styles.editImageOverlay}>
                                <FontAwesome name="camera" size={16} color="#fff" />
                            </View>
                        </TouchableOpacity>

                        {/* Formulário de Edição */}
                        <View style={styles.editFormContainer}>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.inputLabel}>Nome</Text>
                                <StylizedInput
                                    placeholder="Seu nome"
                                    value={editedNome}
                                    onchangeText={setEditedNome}
                                    maxLength={100}
                                />
                            </View>
                            <View style={styles.inputWrapper}>
                                <Text style={styles.inputLabel}>Bio</Text>
                                <TextInput
                                    style={styles.bioInput}
                                    placeholder="Conte um pouco sobre você..."
                                    placeholderTextColor="#999"
                                    value={editedBio}
                                    onChangeText={setEditedBio}
                                    multiline
                                    maxLength={500}
                                />
                                <Text style={styles.charCount}>{editedBio.length}/500</Text>
                            </View>
                            <View style={styles.editActions}>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.cancelButton]}
                                    onPress={() => {
                                        setEditMode(false);
                                        setEditedBio(userData?.bio || '');
                                        setEditedNome(userData?.nome || '');
                                    }}
                                    disabled={saving}
                                >
                                    <Text style={styles.cancelButtonText}>Cancelar</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    style={[styles.actionButton, styles.saveButton]}
                                    onPress={() => saveProfile()}
                                    disabled={saving || !editedNome.trim()}
                                >
                                    {saving ? (
                                        <ActivityIndicator size="small" color="#fff" />
                                    ) : (
                                        <Text style={styles.saveButtonText}>Salvar</Text>
                                    )}
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                )}

                {/* Botão Editar Perfil estilo Threads */}
                {!editMode && (
                    <TouchableOpacity
                        style={styles.editProfileButton}
                        onPress={() => setEditMode(true)}
                        activeOpacity={0.7}
                    >
                        <Text style={styles.editProfileButtonText}>Editar perfil</Text>
                    </TouchableOpacity>
                )}

                {/* Estatísticas */}
                <View style={styles.statsContainer}>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>{userPosts.length}</Text>
                        <Text style={styles.statLabel}>Posts</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>
                            {userPosts.reduce((acc, post) => acc + (post.likes?.length || 0), 0)}
                        </Text>
                        <Text style={styles.statLabel}>Curtidas</Text>
                    </View>
                    <View style={styles.statBox}>
                        <Text style={styles.statNumber}>
                            {userPosts.filter(post => post.evento).length}
                        </Text>
                        <Text style={styles.statLabel}>Eventos</Text>
                    </View>
                </View>

                {/* Posts do Usuário */}
                <View style={styles.postsSection}>
                    <Text style={styles.sectionTitle}>Minhas Postagens</Text>
                    {userPosts.length > 0 ? (
                        userPosts.map((post) => (
                            <Post key={post.id} post={post} onPress={() => handlePostPress(post)} />
                        ))
                    ) : (
                        <View style={styles.emptyPosts}>
                            <FontAwesome name="file-text-o" size={40} color="#ccc" />
                            <Text style={styles.emptyText}>Nenhuma postagem ainda</Text>
                            <Text style={styles.emptySubtext}>Compartilhe suas ideias!</Text>
                        </View>
                    )}
                </View>

                {/* Botão de Logout */}
                <View style={styles.logoutContainer}>
                    <StylizedButton
                        onPress={handleLogout}
                        title="Sair da Conta"
                        style="secondary"
                    />
                </View>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fdfdfd',
    },
    scrollView: {
        paddingHorizontal: 20,
        paddingVertical: 30,
    },
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 16,
        color: '#666',
        marginTop: 10,
    },
    headerContainer: {
        alignItems: 'center',
        marginBottom: 20,
        borderBottomEndRadius: 10,
        borderBottomStartRadius: 10,
        paddingBottom: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#D88D8D',
    },
    title: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#9C2222',
    },
    profileContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        paddingVertical: 10,
        paddingHorizontal: 10,
        marginBottom: 15,
        borderWidth: 1,
        borderColor: '#B7B7B7',
        borderRadius: 20,
        gap: 10,
        width: '100%',
    },
    profileImageContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        overflow: 'hidden',
        marginRight: 12,
    },
    editProfileImageContainer: {
        width: 70,
        height: 70,
        borderRadius: 35,
        overflow: 'hidden',
        marginRight: 15,
        position: 'relative',
    },
    profileImage: {
        width: '100%',
        height: '100%',
    },
    editImageOverlay: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingVertical: 5,
        alignItems: 'center',
        justifyContent: 'center',
    },
    userInfoCenter: {
        flex: 1,
        justifyContent: 'center',
        minWidth: 0,
    },
    nameRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 2,
    },
    userName: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#000',
    },
    userHandle: {
        fontSize: 14,
        color: '#666',
        marginBottom: 10,
    },
    userBio: {
        fontSize: 14,
        color: '#000',
        lineHeight: 18,
    },
    editIconButton: {
        padding: 8,
    },
    editProfileButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#B7B7B7',
        borderRadius: 100,
        paddingVertical: 10,
        alignItems: 'center',
        marginBottom: 20,
    },
    editProfileButtonText: {
        fontSize: 15,
        fontWeight: '600',
        color: '#000',
    },
    editModeContainer: {
        paddingVertical: 20,
        paddingHorizontal: 0,
        marginBottom: 15,
    },
    editFormContainer: {
        width: '100%',
    },
    inputWrapper: {
        marginBottom: 15,
    },
    inputLabel: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 8,
    },
    bioInput: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#B7B7B7',
        borderRadius: 15,
        padding: 15,
        fontSize: 15,
        color: '#333',
        minHeight: 100,
        textAlignVertical: 'top',
    },
    charCount: {
        textAlign: 'right',
        color: '#999',
        fontSize: 12,
        marginTop: 5,
    },
    editActions: {
        flexDirection: 'row',
        gap: 10,
        marginTop: 10,
    },
    actionButton: {
        flex: 1,
        paddingVertical: 12,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButton: {
        backgroundColor: '#fff',
        borderWidth: 1,
        borderColor: '#9C2222',
    },
    cancelButtonText: {
        color: '#9C2222',
        fontSize: 16,
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: '#9C2222',
    },
    saveButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    statsContainer: {
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#B7B7B7',
        padding: 15,
        marginBottom: 20,
        gap: 10,
    },
    statBox: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 10,
    },
    statNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#9C2222',
        marginBottom: 5,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
    },
    postsSection: {
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        color: '#9C2222',
        marginBottom: 15,
    },
    emptyPosts: {
        backgroundColor: '#fff',
        padding: 40,
        borderRadius: 15,
        borderWidth: 1,
        borderColor: '#E0E0E0',
        alignItems: 'center',
    },
    emptyText: {
        fontSize: 16,
        fontWeight: '600',
        color: '#666',
        marginTop: 15,
    },
    emptySubtext: {
        fontSize: 14,
        color: '#999',
        marginTop: 5,
    },
    logoutContainer: {
        marginTop: 20,
        marginBottom: 60,
    },
})

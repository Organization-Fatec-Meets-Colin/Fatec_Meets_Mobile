import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Dimensions, Alert } from "react-native";
import { useState, useContext } from "react";
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AuthContext } from "../../../context/AuthContext";
import { createPostagem } from "../../service/postagemService";
import StylizedButton from "../../components/StylizedButton";

export default function CreatePostScreen({ navigation }) {
    const { user } = useContext(AuthContext);
    const [titulo, setTitulo] = useState('');
    const [conteudo, setConteudo] = useState('');
    const [imagens, setImagens] = useState([]);
    const [loading, setLoading] = useState(false);

    const pickImage = async () => {
        try {
            // Solicita permissão para acessar a galeria
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Permissão Necessária',
                    'Precisamos de permissão para acessar suas fotos.'
                );
                return;
            }

            // Abre a galeria
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,
                allowsMultipleSelection: true,
                quality: 0.8,
                aspect: [4, 3],
            });

            if (!result.canceled && result.assets) {
                // Limita a 5 imagens no total
                const novasImagens = result.assets.slice(0, 5 - imagens.length);
                setImagens([...imagens, ...novasImagens]);
            }
        } catch (error) {
            console.error('Erro ao selecionar imagem:', error);
            Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
        }
    };

    const removeImage = (index) => {
        const novasImagens = imagens.filter((_, i) => i !== index);
        setImagens(novasImagens);
    };

    const handleCreatePost = async () => {
        if (!titulo.trim()) {
            Alert.alert('Atenção', 'Por favor, adicione um título ao seu post.');
            return;
        }

        if (!conteudo.trim()) {
            Alert.alert('Atenção', 'Por favor, escreva o conteúdo do post.');
            return;
        }

        try {
            setLoading(true);

            if (imagens.length > 0) {
                // Cria FormData para enviar com imagens
                const formData = new FormData();
                formData.append('titulo', titulo.trim());
                formData.append('conteudo', conteudo.trim());
                formData.append('usuarioId', user.id.toString());

                // Adiciona as imagens ao FormData
                imagens.forEach((imagem, index) => {
                    const uriParts = imagem.uri.split('.');
                    const fileType = uriParts[uriParts.length - 1].toLowerCase();
                    
                    // Formato correto para React Native
                    const imageFile = {
                        uri: imagem.uri,
                        name: `image_${Date.now()}_${index}.${fileType}`,
                        type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`,
                    };
                    
                    console.log('📸 Adicionando imagem:', imageFile);
                    formData.append('imagens', imageFile);
                });

                console.log('📤 Enviando postagem com', imagens.length, 'imagem(ns)');
                const resultado = await createPostagem(formData, true);
                console.log('✅ Postagem criada:', resultado.id, 'com', resultado.imagens?.length || 0, 'imagens');
            } else {
                // Envia JSON sem imagens
                const novaPostagem = {
                    titulo: titulo.trim(),
                    conteudo: conteudo.trim(),
                    usuario: {
                        id: user.id
                    }
                };

                console.log('📤 Enviando postagem:', novaPostagem);
                await createPostagem(novaPostagem, false);
            } Alert.alert(
                'Sucesso!',
                'Post criado com sucesso!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            setTitulo('');
                            setConteudo('');
                            setImagens([]);
                            navigation.goBack();
                        }
                    }
                ]
            );
        } catch (error) {
            console.error('Erro ao criar post:', error);
            Alert.alert(
                'Erro',
                error.response?.data?.message || 'Não foi possível criar o post. Tente novamente.'
            );
        } finally {
            setLoading(false);
        }
    };

    const handleCancel = () => {
        if (titulo.trim() || conteudo.trim() || imagens.length > 0) {
            Alert.alert(
                'Descartar Post?',
                'Você tem alterações não salvas. Deseja realmente sair?',
                [
                    { text: 'Continuar Editando', style: 'cancel' },
                    {
                        text: 'Descartar',
                        style: 'destructive',
                        onPress: () => navigation.goBack()
                    }
                ]
            );
        } else {
            navigation.goBack();
        }
    };

    return (
        <View style={styles.safeArea}>
            <StatusBar style="dark" />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    onPress={handleCancel}
                    style={styles.cancelButton}
                >
                    <FontAwesome name="times" size={24} color="#666" />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>Criar Post</Text>
                <View style={styles.placeholder} />
            </View>

            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
            >
                {/* User Info */}
                <View style={styles.userContainer}>
                    <View style={styles.userImageContainer}>
                        <Image
                            style={styles.userImage}
                            source={{
                                uri: user?.fotoPerfil || 'https://via.placeholder.com/150',
                            }}
                            contentFit="cover"
                            transition={300}
                        />
                    </View>
                    <View style={styles.userInfo}>
                        <Text style={styles.userName}>{user?.nome || 'Usuário'}</Text>
                    </View>
                </View>

                {/* Title Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.titleInput}
                        placeholder="Adicione um título..."
                        placeholderTextColor="#979797"
                        value={titulo}
                        onChangeText={setTitulo}
                        maxLength={200}
                    />
                    <Text style={styles.charCount}>{titulo.length}/200</Text>
                </View>

                {/* Content Input */}
                <View style={styles.inputContainer}>
                    <TextInput
                        style={styles.textInput}
                        placeholder="Quais as novidades?"
                        placeholderTextColor="#979797"
                        multiline
                        value={conteudo}
                        onChangeText={setConteudo}
                        textAlignVertical="top"
                        maxLength={1000}
                    />
                    <Text style={styles.charCount}>{conteudo.length}/1000</Text>
                </View>

                {/* Preview de Imagens */}
                {imagens.length > 0 && (
                    <View style={styles.imagesPreviewContainer}>
                        <ScrollView
                            horizontal
                            showsHorizontalScrollIndicator={false}
                            style={styles.imagesScroll}
                        >
                            {imagens.map((imagem, index) => (
                                <View key={index} style={styles.imagePreviewWrapper}>
                                    <Image
                                        source={{ uri: imagem.uri }}
                                        style={styles.imagePreview}
                                        contentFit="cover"
                                    />
                                    <TouchableOpacity
                                        style={styles.removeImageButton}
                                        onPress={() => removeImage(index)}
                                    >
                                        <FontAwesome name="times-circle" size={20} color="#9C2222" />
                                    </TouchableOpacity>
                                </View>
                            ))}
                        </ScrollView>
                    </View>
                )}

                {/* Actions Placeholder */}
                <View style={styles.actionsContainer}>
                    <Text style={styles.actionsTitle}>Adicionar ao seu post</Text>
                    <View style={styles.actionButtons}>
                        <TouchableOpacity
                            style={[styles.actionButton, imagens.length < 5 && styles.actionButtonActive]}
                            onPress={pickImage}
                            disabled={imagens.length >= 5}
                        >
                            <FontAwesome
                                name="image"
                                size={24}
                                color={imagens.length < 5 ? "#9C2222" : "#ccc"}
                            />
                            <Text style={[
                                styles.actionLabel,
                                imagens.length < 5 && styles.actionLabelActive
                            ]}>
                                Foto {imagens.length > 0 && `(${imagens.length}/5)`}
                            </Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} disabled>
                            <FontAwesome name="calendar" size={24} color="#ccc" />
                            <Text style={styles.actionLabel}>Evento</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.actionButton} disabled>
                            <FontAwesome name="map-marker" size={24} color="#ccc" />
                            <Text style={styles.actionLabel}>Local</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ScrollView>

            {/* Footer with Post Button */}
            <View style={styles.footer}>
                <View style={styles.buttonContainer}>
                    <StylizedButton
                        title={loading ? "Publicando..." : "Publicar"}
                        onPress={handleCreatePost}
                        disabled={loading || !titulo.trim() || !conteudo.trim()}
                    />
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fdfdfd',
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingVertical: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#E0E0E0',
        backgroundColor: '#fff',
        marginTop: 40,
    },
    cancelButton: {
        padding: 5,
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#9C2222',
    },
    placeholder: {
        width: 34,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },
    userContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    userImageContainer: {
        width: Dimensions.get("window").width * 0.12,
        height: Dimensions.get("window").width * 0.12,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#B7B7B7',
        padding: 2,
        overflow: 'hidden',
        marginRight: 12,
    },
    userImage: {
        borderRadius: 100,
        width: '100%',
        height: '100%',
    },
    userInfo: {
        flex: 1,
    },
    userName: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#9C2222',
        marginBottom: 2,
    },
    userEmail: {
        fontSize: 14,
        color: '#666',
    },
    inputContainer: {
        marginBottom: 20,
    },
    titleInput: {
        fontSize: 18,
        fontWeight: '600',
        color: '#333',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    textInput: {
        fontSize: 16,
        color: '#333',
        minHeight: 200,
        textAlignVertical: 'top',
        padding: 10,
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#E0E0E0',
    },
    charCount: {
        textAlign: 'right',
        color: '#999',
        fontSize: 12,
        marginTop: 5,
    },
    imagesPreviewContainer: {
        marginBottom: 20,
    },
    imagesScroll: {
        flexDirection: 'row',
        overflow: 'visible',
    },
    imagePreviewWrapper: {
        position: 'relative',
        marginRight: 10,
    },
    imagePreview: {
        width: 120,
        height: 120,
        borderRadius: 15,
        backgroundColor: '#F5F5F5',
    },
    removeImageButton: {
        position: 'absolute',
        paddingHorizontal: 2,
        top: -8,
        right: -8,
        backgroundColor: '#fff',
        borderRadius: 100,
    },
    actionsContainer: {
        marginBottom: 20,
    },
    actionsTitle: {
        fontSize: 14,
        fontWeight: '600',
        color: '#666',
        marginBottom: 15,
    },
    actionButtons: {
        flexDirection: 'row',
        gap: 15,
    },
    actionButton: {
        flex: 1,
        backgroundColor: '#F5F5F5',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        justifyContent: 'center',
        gap: 8,
        opacity: 0.5,
    },
    actionButtonActive: {
        opacity: 1,
        backgroundColor: '#FFE8E8',
    },
    actionLabel: {
        fontSize: 12,
        color: '#666',
        fontWeight: '500',
    },
    actionLabelActive: {
        color: '#9C2222',
    },
    footer: {
        padding: 20,
        backgroundColor: '#fff',
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
    },
    buttonContainer: {
        width: '100%',
    },
});

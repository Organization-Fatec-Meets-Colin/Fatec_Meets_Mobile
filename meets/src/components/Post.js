import { StatusBar } from "expo-status-bar";
import { Dimensions, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, Pressable } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Image } from 'expo-image';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Material from '@expo/vector-icons/MaterialCommunityIcons';
import { useState, useContext } from "react";
import PostButtons from "./PostButtons";
import { getTimeAgo } from "../utils/dateUtils";
import { addLike, removeLike } from "../service/postagemService";
import { AuthContext } from "../../context/AuthContext";
import { cancelarParticipacao, participarEvento } from "../service";
import { getImageUrl } from "../libs/api";

export default function Post({ post, onPress }) {
    const { user } = useContext(AuthContext);

    // Debug: Log das imagens
    if (post.imagens && post.imagens.length > 0) {
        console.log('📸 Post', post.id, 'tem', post.imagens.length, 'imagem(ns):', post.imagens.map(img => img.url));
    }

    const [postData, setPostData] = useState({
        id: post.id,
        username: post.usuario.nome,
        userImage: post.usuario.fotoPerfil,
        content: post.conteudo,
        postTime: getTimeAgo(post.dataCriacao),
        midia: post.imagens || [],

        likes: post.likes || [],
        totalLikes: post.likes ? post.likes.length : 0,
        comments: post.comentarios || [],
        shares: post.compartilhamentos || 0,

        isEvent: post.evento != null,
        evento: post.evento,
    });

    const handlePostPress = () => {
        if (onPress) {
            console.log("Post pressed:", post);
            onPress(postData);
        }
    };

    const handleLikePress = async (isLiked) => {
        try {
            if (!user || !user.id) {
                console.error('Usuário não autenticado');
                return;
            }

            if (isLiked) {
                await addLike(postData.id, user.id);
            } else {
                await removeLike(postData.id, user.id);
            }
        } catch (error) {
            console.error('Erro ao processar like:', error);
        }
    };

    const handlePresencePress = async (isPresent) => {
        try {
            // Lógica para adicionar/remover presença no evento

            if (!user || !user.id) {
                console.error('Usuário não autenticado');
                return;
            }

            if (isPresent) {
                await participarEvento(postData.evento.id, user.id);
            } else {
                // Chamar serviço para remover presença
                await cancelarParticipacao(postData.evento.id, user.id);
            }

        } catch (error) {
            console.error('Erro ao processar presença:', error);
        }
    };

    return (
        <View style={[styles.postContainer, postData.isEvent && { borderColor: '#D88D8D' }]}>
            <TouchableOpacity
                activeOpacity={0.7}
                onPress={handlePostPress}
                style={styles.postHeader}
            >
                <View style={styles.userImageContainer}>
                    <Image
                        style={styles.userImage}
                        source={{
                            uri: postData.userImage,
                        }}
                        contentFit="cover"
                        transition={300}
                    />
                </View>
            </TouchableOpacity>
            <View style={styles.postBody}>
                <TouchableOpacity
                    activeOpacity={0.7}
                    onPress={handlePostPress}
                >
                    <View style={styles.userData}>
                        <Text style={styles.username}>{postData.username}</Text>
                        <Text style={styles.postTime}> • {postData.postTime}</Text>
                    </View>
                    <View style={styles.postContent}>
                        <Text>
                            {postData.content}
                        </Text>
                    </View>
                </TouchableOpacity>

                {postData.midia && postData.midia.length > 0 && <ScrollView
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                    style={styles.postImageContainer}>
                    <View style={[styles.postImageWrapper]}>
                        {postData.midia.map((imagem, index) => (
                            <Image
                                key={imagem.id || index}
                                style={styles.postImage}
                                source={{
                                    uri: getImageUrl(imagem.url),
                                }}
                                contentFit="cover"
                                transition={300}
                            />
                        ))}
                    </View>
                </ScrollView>}

                <View style={styles.postData}>
                    <PostButtons
                        initialLikes={postData.likes}
                        comments={postData.comments}
                        isEvent={postData.isEvent}
                        presenceInitial={postData.evento?.participantes}
                        onLikePress={handleLikePress}
                        onPresencePress={handlePresencePress}
                        currentUserId={user?.id}
                    />
                </View>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    postContainer: {
        marginBottom: 20,
        borderWidth: 1,
        borderColor: '#B7B7B7',
        borderRadius: 20,
        flexDirection: 'row',
        overflow: 'hidden',
    },
    postHeader: {
        padding: 5,
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    userImageContainer: {
        width: Dimensions.get("window").width * 0.1,
        height: Dimensions.get("window").width * 0.1,
        borderRadius: 100,
        borderWidth: 1,
        borderColor: '#B7B7B7',
        padding: 2,
        overflow: 'hidden',
        marginRight: 0,
    },
    userImage: {
        borderRadius: 100,
        width: '100%',
        height: '100%',
    },
    postBody: {
        flex: 1,
        paddingVertical: 5,
        paddingRight: 10,
    },
    userData: {
        marginBottom: 3,
        flexDirection: 'row',
        alignItems: 'center',
    },
    username: {
        color: '#9C2222',
        fontWeight: 'bold',
        fontSize: 16,
    },
    postTime: {
        color: '#555',
        fontSize: 14,
    },
    postContent: {
        marginBottom: 10,
    },
    postImageContainer: {
        width: '100%',
        borderRadius: 10,
        overflow: 'visible',
        marginBottom: 10,
    },
    postImageWrapper: {
        flexDirection: 'row',
        gap: 10,
        padding: 5,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#B7B7B7',
    },
    postImage: {
        width: undefined,
        height: 200,
        aspectRatio: 4 / 3,
        borderRadius: 15,

    },

    postData: {
        marginBottom: 10,
        flexDirection: 'row',
        gap: 10,
    },
})
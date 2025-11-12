import { StatusBar } from "expo-status-bar";
import { Dimensions, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View, Pressable, RefreshControl } from "react-native";
import { ScrollView } from "react-native";
import { Image } from 'expo-image';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Material from '@expo/vector-icons/MaterialCommunityIcons';
import { useState, useContext, useEffect } from "react";
import PostButtons from "../../components/PostButtons";
import { getTimeAgo } from "../../utils/dateUtils";
import { addLike, removeLike, getPostagemById } from "../../service/postagemService";
import { participarEvento, cancelarParticipacao } from "../../service/eventoService";
import { AuthContext } from "../../../context/AuthContext";

export default function PostScreen({ route, navigation }) {
    const { user } = useContext(AuthContext);

    // Pega o ID do post dos parâmetros da rota
    const { post } = route.params;
    const postId = post.id;

    const [postData, setPostData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [error, setError] = useState(null);

    // Função para buscar os dados do post da API
    const fetchPost = async () => {
        try {
            setLoading(true);
            const fetchedPost = await getPostagemById(postId);

            setPostData({
                id: fetchedPost.id,
                username: fetchedPost.usuario.nome,
                userImage: fetchedPost.usuario.fotoPerfil,
                content: fetchedPost.conteudo,
                postTime: getTimeAgo(fetchedPost.dataCriacao),
                midia: fetchedPost.imagens || [],

                likes: fetchedPost.likes || [],
                totalLikes: fetchedPost.likes ? fetchedPost.likes.length : 0,
                comments: fetchedPost.comentarios || [],
                shares: fetchedPost.compartilhamentos || 0,

                isEvent: fetchedPost.evento != null,
                evento: fetchedPost.evento,
            });
            setError(null);
        } catch (err) {
            console.error('Erro ao buscar post:', err);
            setError('Não foi possível carregar o post.');
        } finally {
            setLoading(false);
        }
    };

    // Função para refresh (pull-to-refresh)
    const onRefresh = async () => {
        setRefreshing(true);
        await fetchPost();
        setRefreshing(false);
    };

    // Busca inicial dos dados
    useEffect(() => {
        fetchPost();
    }, [postId]);

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

    const handlePresencePress = async () => {
        try {
            if (!user || !user.id) {
                console.error('Usuário não autenticado');
                return;
            }

            if (!postData.evento) {
                console.error('Evento não encontrado');
                return;
            }

            // Verifica se o usuário já está participando
            const isParticipating = postData.evento.participantes?.some(
                participante => participante.id === user.id
            );

            if (isParticipating) {
                // Remover participação
                const response = await cancelarParticipacao(postData.evento.id, user.id);

                // Atualiza o estado local com o evento retornado
                setPostData(prev => ({
                    ...prev,
                    evento: response.data
                }));

                console.log('Participação cancelada com sucesso');
            } else {
                // Adicionar participação
                const response = await participarEvento(postData.evento.id, user.id);

                // Atualiza o estado local com o evento retornado
                setPostData(prev => ({
                    ...prev,
                    evento: response.data
                }));

                console.log('Participação confirmada com sucesso');
            }

        } catch (error) {
            console.error('Erro ao processar presença:', error);
            if (error.response?.data?.message) {
                console.error('Mensagem do servidor:', error.response.data.message);
            }
        } finally {
            onRefresh();
        }
    };

    // Estados de carregamento e erro
    if (loading) {
        return (
            <View style={[styles.safeArea, styles.centerContent]}>
                <StatusBar style="dark" />
                <Text style={styles.loadingText}>Carregando...</Text>
            </View>
        );
    }

    if (error || !postData) {
        return (
            <View style={[styles.safeArea, styles.centerContent]}>
                <StatusBar style="dark" />
                <Text style={styles.errorText}>{error || 'Post não encontrado'}</Text>
                <TouchableOpacity
                    style={styles.retryButton}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.retryButtonText}>Voltar</Text>
                </TouchableOpacity>
            </View>
        );
    }

    return (
        <View style={styles.safeArea}>
            <StatusBar style="dark" />
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollViewContent}
                showsVerticalScrollIndicator={true}
                refreshControl={
                    <RefreshControl
                        refreshing={refreshing}
                        onRefresh={onRefresh}
                        colors={['#9C2222']}
                        tintColor="#9C2222"
                    />
                }
            >

                {/* Post Area */}
                <View style={styles.postContainer}>
                    <View
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
                    </View>
                    <View style={styles.postBody}>
                        <View style={styles.userData}>
                            <Text style={styles.username}>{postData.username}</Text>
                            <Text style={styles.postTime}> • {postData.postTime}</Text>
                        </View>
                        <View style={styles.postContent}>
                            <Text>
                                {postData.content}
                            </Text>
                        </View>

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
                                            uri: imagem.url,
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
                                // isEvent={postData.isEvent}
                                // presenceInitial={postData.evento?.participantes || []}
                                onLikePress={handleLikePress}
                                onPresencePress={handlePresencePress}
                                currentUserId={user?.id}
                            />
                        </View>
                    </View>
                </View>
                {/* Fim Post Area */}

                {/* Informações do Evento */}
                {postData.isEvent && postData.evento && (
                    <View style={styles.eventoContainer}>
                        <View style={styles.eventoHeader}>
                            <FontAwesome name="calendar" size={24} color="#fff" />
                            <Text style={styles.eventoHeaderTitle}>Informações do Evento</Text>
                        </View>

                        <View style={styles.eventoContent}>
                            {/* Título do Evento */}
                            <View style={styles.eventoSection}>
                                <Text style={styles.eventoTitulo}>{postData.evento.titulo}</Text>
                            </View>

                            {/* Descrição */}
                            {postData.evento.descricao && (
                                <View style={styles.eventoSection}>
                                    <Text style={styles.eventoDescricao}>{postData.evento.descricao}</Text>
                                </View>
                            )}

                            {/* Data e Horário */}
                            <View style={styles.eventoInfoRow}>
                                <FontAwesome name="calendar-o" size={18} color="#666" />
                                <View style={styles.eventoInfoText}>
                                    <Text style={styles.eventoLabel}>Data</Text>
                                    <Text style={styles.eventoValue}>
                                        {postData.evento.dataEvento ?
                                            new Date(postData.evento.dataEvento).toLocaleDateString('pt-BR') :
                                            'Data não informada'}
                                    </Text>
                                </View>
                            </View>

                            {postData.evento.horarioInicio && (
                                <View style={styles.eventoInfoRow}>
                                    <FontAwesome name="clock-o" size={18} color="#666" />
                                    <View style={styles.eventoInfoText}>
                                        <Text style={styles.eventoLabel}>Horário</Text>
                                        <Text style={styles.eventoValue}>
                                            {postData.evento.horarioInicio.substring(0, 5)}
                                            {postData.evento.horarioFim && ` - ${postData.evento.horarioFim.substring(0, 5)}`}
                                        </Text>
                                    </View>
                                </View>
                            )}

                            {/* Local */}
                            {postData.evento.local && (
                                <View style={styles.eventoInfoRow}>
                                    <FontAwesome name="map-marker" size={18} color="#666" />
                                    <View style={styles.eventoInfoText}>
                                        <Text style={styles.eventoLabel}>Local</Text>
                                        <Text style={styles.eventoValue}>{postData.evento.local}</Text>
                                    </View>
                                </View>
                            )}

                            {/* Endereço */}
                            {postData.evento.endereco && (
                                <View style={styles.eventoInfoRow}>
                                    <FontAwesome name="location-arrow" size={18} color="#666" />
                                    <View style={styles.eventoInfoText}>
                                        <Text style={styles.eventoLabel}>Endereço</Text>
                                        <Text style={styles.eventoValue}>{postData.evento.endereco}</Text>
                                    </View>
                                </View>
                            )}

                            {/* Capacidade e Participantes */}
                            <View style={styles.eventoStatsContainer}>
                                <View style={styles.eventoStatBox}>
                                    <FontAwesome name="users" size={20} color="#9C2222" />
                                    <Text style={styles.eventoStatNumber}>
                                        {postData.evento.participantes?.length || 0}
                                    </Text>
                                    <Text style={styles.eventoStatLabel}>Confirmados</Text>
                                </View>

                                {postData.evento.capacidadeMaxima && (
                                    <View style={styles.eventoStatBox}>
                                        <FontAwesome name="ticket" size={20} color="#9C2222" />
                                        <Text style={styles.eventoStatNumber}>
                                            {postData.evento.capacidadeMaxima - (postData.evento.participantes?.length || 0)}
                                        </Text>
                                        <Text style={styles.eventoStatLabel}>Vagas Restantes</Text>
                                    </View>
                                )}
                            </View>

                            {/* Botão de Participar */}
                            <TouchableOpacity
                                style={[
                                    styles.eventoButton,
                                    postData.evento.participantes?.some(p => p.id === user?.id) && styles.eventoButtonActive
                                ]}
                                onPress={handlePresencePress}
                                activeOpacity={0.8}
                            >
                                <FontAwesome
                                    name={postData.evento.participantes?.some(p => p.id === user?.id) ? "times-circle" : "check-circle"}
                                    size={20}
                                    color={postData.evento.participantes?.some(p => p.id === user?.id) ? "#9C2222" : "#fff"}
                                />
                                <Text style={[styles.eventoButtonText, postData.evento.participantes?.some(p => p.id === user?.id) && styles.eventoButtonTextActive]}>
                                    {postData.evento.participantes?.some(p => p.id === user?.id)
                                        ? "Cancelar Presença"
                                        : "Confirmar Presença"}
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                )}
                {/* Fim Informações do Evento */}

                {/** Comentários Area **/}
                <View style={styles.commentsContainer}>
                    <Text style={styles.commentsTitle}>Comentários</Text>
                    {postData.comments && postData.comments.length > 0 ? (
                        postData.comments.map((comment, index) => (
                            <View key={index} style={styles.commentContainer}>
                                <View style={styles.postBody}>
                                    <View style={styles.userData}>
                                        <Text style={styles.username}>
                                            {comment.usuario?.nome || comment.usuario?.email || 'Usuário'}
                                        </Text>
                                        {/* <Text style={styles.postTime}> • {comment.dataHora}</Text> */}
                                    </View>
                                    <View style={styles.postContent}>
                                        <Text>
                                            {comment.conteudo}
                                        </Text>
                                    </View>

                                    {/* <View style={styles.postData}>
                                        <PostButtons initialLikes={postData.likes} comments={postData.comments} isEvent={postData.isEvent} presenceInitial={postData.participantes} />
                                    </View> */}
                                </View>
                            </View>
                        ))
                    ) : (
                        <Text style={styles.noComments}>Nenhum comentário ainda.</Text>
                    )}
                </View>
            </ScrollView>
        </View>
    )
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        backgroundColor: '#fdfdfd',
    },
    scrollView: {
        flex: 1,
    },
    scrollViewContent: {
        paddingHorizontal: 20,
        paddingTop: 80,
        paddingBottom: 100, // Espaço extra para garantir que todo conteúdo seja visível
    },
    postContainer: {
        marginBottom: 20,
        flexDirection: 'row',
        borderBottomWidth: 1,
        borderBottomColor: '#B7B7B7',
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

    commentsTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },

    commentContainer: {
        marginBottom: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#B7B7B7',
        paddingBottom: 10,
    },

    noComments: {
        fontStyle: 'italic',
        color: '#666',
    },

    // Estilos do Evento
    eventoContainer: {
        marginBottom: 20,
        backgroundColor: '#fff',
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#9C2222',
        overflow: 'hidden',
    },
    eventoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#9C2222',
        padding: 15,
        gap: 10,
    },
    eventoHeaderTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#fff',
    },
    eventoContent: {
        padding: 15,
    },
    eventoSection: {
        marginBottom: 15,
    },
    eventoTitulo: {
        fontSize: 22,
        fontWeight: 'bold',
        color: '#9C2222',
        marginBottom: 5,
    },
    eventoDescricao: {
        fontSize: 15,
        color: '#555',
        lineHeight: 22,
    },
    eventoInfoRow: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginBottom: 12,
        gap: 12,
    },
    eventoInfoText: {
        flex: 1,
    },
    eventoLabel: {
        fontSize: 12,
        color: '#999',
        marginBottom: 2,
        textTransform: 'uppercase',
    },
    eventoValue: {
        fontSize: 15,
        color: '#333',
        fontWeight: '500',
    },
    eventoStatsContainer: {
        flexDirection: 'row',
        gap: 10,
        marginVertical: 15,
    },
    eventoStatBox: {
        flex: 1,
        backgroundColor: '#FFF5F5',
        borderRadius: 15,
        padding: 15,
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#FFE0E0',
    },
    eventoStatNumber: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#9C2222',
        marginTop: 8,
    },
    eventoStatLabel: {
        fontSize: 12,
        color: '#666',
        marginTop: 4,
        textAlign: 'center',
    },
    eventoButton: {
        backgroundColor: '#9C2222',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 10,
        borderRadius: 100,
        gap: 10,
        marginTop: 10,
    },
    eventoButtonActive: {
        backgroundColor: '#ffffff',
        borderColor: '#9C2222',
        borderWidth: 1,
    },
    eventoButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },
    eventoButtonTextActive: {
        color: '#9C2222',
        fontSize: 16,
        fontWeight: 'bold',
    },

    // Estilos de Loading e Error
    centerContent: {
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: 18,
        color: '#666',
        fontWeight: '500',
    },
    errorText: {
        fontSize: 16,
        color: '#9C2222',
        fontWeight: '500',
        textAlign: 'center',
        marginBottom: 20,
        paddingHorizontal: 40,
    },
    retryButton: {
        backgroundColor: '#9C2222',
        paddingVertical: 12,
        paddingHorizontal: 30,
        borderRadius: 25,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold',
    },

})
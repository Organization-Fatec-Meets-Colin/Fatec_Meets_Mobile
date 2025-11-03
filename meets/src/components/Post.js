import { StatusBar } from "expo-status-bar";
import { Dimensions, StyleSheet, Text, TouchableHighlight, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Image } from 'expo-image';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import Material from '@expo/vector-icons/MaterialCommunityIcons';
import { useState } from "react";

export default function Post({ post }) {

    const [postData, setPostData] = useState({
        id: post.id,
        username: post.usuario.username,
        userImage: post.usuario.fotoPerfil,
        content: post.conteudo,
        postTime: post.postTime,
        midia: post.midia,

        likes: post.likes || 0,
        comments: post.comentarios || null,
        shares: post.compartilhamentos || 0,

        isEvent: post.isEvento || false,
        participantes: post.participantes || 0,
    });


    return (
        <View style={[styles.postContainer, postData.isEvent && { borderColor: '#D88D8D'}]}>
            <View style={styles.postHeader}>
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

                {postData.midia && postData.midia.length > 0 && <ScrollView horizontal={true} showsHorizontalScrollIndicator={false}
                    style={styles.postImageContainer}>
                    <View style={[styles.postImageWrapper]}>
                        {postData.midia.length > 0 ? postData.midia.map((midia, index) => {
                            if (midia.tipo === 'imagem') {
                                return (
                                    <Image
                                        key={index}
                                        style={styles.postImage}
                                        source={{
                                            uri: midia.url,
                                        }}
                                    />
                                )
                            }

                        }) : null}
                    </View>
                </ScrollView>}

                <View style={styles.postData}>
                    <PostButtons initialLikes={postData.likes} comments={postData.comments} isEvent={postData.isEvent} presenceInitial={postData.participantes} />
                </View>
            </View>
        </View>
    )
}

function PostButtons({ initialLikes = 0, comments = 0, isEvent = false, presenceInitial = 0 }) {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(initialLikes);
    const [comentsCount, setComentsCount] = useState(0);
    const [presence, setPresence] = useState(false);
    const [presenceCount, setPresenceCount] = useState(presenceInitial);

    const handleLike = () => {
        setLiked(!liked);
        setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    };

    const handleComents = () => {
        console.log("Coment function");
    }

    const handleShare = () => {
        console.log("Share function");
    }

    const handlePresence = () => {
        setPresence(!presence);
        setPresenceCount(presence ? presenceCount - 1 : presenceCount + 1);
    }

    return (
        <View style={styles.postButtonsContainer}>

            <View style={styles.postLikeContainer}>
                <TouchableOpacity
                    onPress={handleLike}
                    style={styles.postButton}
                >
                    <FontAwesome
                        name={liked ? "heart" : "heart-o"}
                        size={15}
                        color={liked ? "#9C2222" : "#666"}
                    />
                    <Text style={[styles.statsCount, liked && styles.likeCountActive]}>
                        {likeCount}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.postCommentContainer}>
                <TouchableOpacity
                    onPress={handleComents}
                    style={styles.postButton}
                >
                    <FontAwesome
                        name="comment-o"
                        size={15}
                        color="#666"
                    />
                    <Text style={styles.statsCount}>
                        {comments.length}
                    </Text>
                </TouchableOpacity>
            </View>
            <View style={styles.postShareContainer}>
                <TouchableOpacity
                    onPress={handleShare}
                    style={styles.postButton}
                >
                    <FontAwesome
                        name="send-o"
                        size={15}
                        color="#666"
                    />
                </TouchableOpacity>
            </View>
            {isEvent &&
                <View style={styles.postPresenceContainer}>
                    <TouchableOpacity
                        onPress={handlePresence}
                        style={[presence ?
                            styles.postButton
                            : {
                                backgroundColor: '#9C2222',
                                borderRadius: 100,
                                paddingVertical: 5,
                                paddingHorizontal: 20,
                                width: '100%',
                                transition: 'all 0.3s',
                            }]}
                    >
                        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                            {presence ?
                                <FontAwesome
                                    name="check"
                                    size={15}
                                    color="#9C2222"
                                /> :
                                <Text style={[styles.txtBtnPrimary, { color: '#fff' }]}>Participar</Text>

                            }

                            <Text style={[styles.txtBtnPrimary, { color: presence ? '#9C2222' : '#fff' }]}>{presenceCount}</Text>
                        </View>
                    </TouchableOpacity>
                </View>}

        </View>
    );
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
    postButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    postButton: {
        paddingVertical: 5,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingHorizontal: 10,
    },
    statsCount: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    likeCountActive: {
        color: '#9C2222',
        fontWeight: 'bold',
    },

    btnPrimary: {
        borderColor: '#9C2222',
        borderRadius: 100,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    txtBtnPrimary: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center'
    },
})
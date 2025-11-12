import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useState } from "react";

export default function PostButtons({
    initialLikes = [],
    comments = [],
    isEvent = false,
    presenceInitial = [],
    onLikePress,
    onPresencePress,
    currentUserId
}) {
    const userLiked = initialLikes.some(user => user.id === currentUserId);
    const userPresence = presenceInitial.some(user => user.id === currentUserId);
    const [liked, setLiked] = useState(userLiked);
    const [likeCount, setLikeCount] = useState(initialLikes.length);
    const [comentsCount, setComentsCount] = useState(0);
    const [presence, setPresence] = useState(userPresence);
    const [presenceCount, setPresenceCount] = useState(presenceInitial.length);
    const handleLike = () => {
        const newLikedState = !liked;
        setLiked(newLikedState);
        setLikeCount(newLikedState ? likeCount + 1 : likeCount - 1);

        if (onLikePress) {
            onLikePress(newLikedState);
        }
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

        if (onPresencePress) {
            onPresencePress(!presence);
        }
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
                        {Array.isArray(comments) ? comments.length : 0}
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

                            <Text style={[styles.txtBtnPrimary, { color: presence ? '#9C2222' : '#fff' }]}>
                                {presenceCount}
                            </Text>
                        </View>
                    </TouchableOpacity>
                </View>}
        </View>
    );
}

const styles = StyleSheet.create({
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
    txtBtnPrimary: {
        color: '#fff',
        fontSize: 12,
        fontWeight: 'bold',
        textAlign: 'center'
    },
});

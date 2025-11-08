import { StatusBar } from "expo-status-bar";
import { Dimensions, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ScrollView } from "react-native-gesture-handler";
import { Image } from 'expo-image';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { useEffect, useState } from "react";
import Post from "../../components/Post";
import mockPosts from "../../data/mockPosts.json";

//added comment

export default function FeedScreen({ navigation }) {
    const [postData, setPostData] = useState([]);

    useEffect(() => {
        // Fetch or generate post data here
        const getPosts = async () => {
            setPostData(mockPosts)
        }
        getPosts();
    }, []);

    const handlePostPress = (post) => {
        navigation.navigate('PostDetails', { post });

        console.log('Post pressionado:', post);
        // Aqui você pode navegar para uma tela de detalhes do post, por exemplo:
        // navigation.navigate('PostDetails', { post });
    };

    return (
        <View style={styles.safeArea}>
            <StatusBar style="dark" />
            <ScrollView style={styles.scrollView}>
                <View style={styles.headerContainer}>
                    <Text style={styles.title}>meets</Text>
                </View>

                <View style={styles.feedContainer}>
                    {/* Feed content goes here */}

                    {postData ? postData.map((post) => (
                        <Post key={post.id} post={post} onPress={() => handlePostPress(post)} />
                    )) : null}
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
        paddingHorizontal: 20,
        paddingVertical: 30,
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

    feedContainer: {
        flex: 1,
        marginBottom: 60,
    },


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
        height: 250,
        aspectRatio: 4 / 3,
        borderRadius: 15,

    },
    postData: {
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#eee',
        flexDirection: 'row',
        gap: 15,
    },
    likeButton: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5,
        paddingVertical: 5,
        paddingHorizontal: 10,
    },
    likeCount: {
        fontSize: 16,
        color: '#666',
        fontWeight: '500',
    },
    likeCountActive: {
        color: '#9C2222',
        fontWeight: 'bold',
    },

})
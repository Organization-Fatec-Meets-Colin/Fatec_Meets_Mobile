import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, ScrollView, Dimensions, Alert } from "react-native";
import { useState, useContext } from "react";
import { Image } from 'expo-image';
import * as ImagePicker from 'expo-image-picker';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { AuthContext } from "../../../context/AuthContext";
import { createPostagem } from "../../service/postagemService";
import StylizedButton from "../../components/StylizedButton";
import EventForm from "../../components/EventForm";
import ImagePreview from "../../components/ImagePreview";
import PostActions from "../../components/PostActions";

/**
 * Tela de criação de postagens e eventos
 * 
 * Permite ao usuário:
 * - Criar posts simples com título e conteúdo
 * - Adicionar até 5 imagens ao post
 * - Criar eventos com data, horário, local e capacidade
 * - Vincular imagens aos eventos
 * 
 * Validações implementadas:
 * - Título e conteúdo obrigatórios
 * - Local obrigatório para eventos
 * - Data mínima: hoje
 * - Limite de 5 imagens
 */
export default function CreatePostScreen({ navigation }) {
    // Contexto do usuário autenticado
    const { user } = useContext(AuthContext);

    // ========== ESTADOS DO POST ==========
    const [titulo, setTitulo] = useState('');           // Título da postagem (máx 200 caracteres)
    const [conteudo, setConteudo] = useState('');       // Conteúdo da postagem (máx 1000 caracteres)
    const [imagens, setImagens] = useState([]);         // Array de imagens selecionadas (máx 5)
    const [loading, setLoading] = useState(false);      // Estado de carregamento durante envio

    // ========== ESTADOS DO EVENTO ==========
    const [isEvento, setIsEvento] = useState(false);    // Define se a postagem é um evento
    const [eventoData, setEventoData] = useState({
        dataEvento: new Date(),                         // Data do evento (DateObject)
        horarioInicio: new Date(),                      // Horário de início (DateObject)
        horarioFim: new Date(),                         // Horário de fim (DateObject)
        local: '',                                      // Local do evento (obrigatório)
        endereco: '',                                   // Endereço completo (opcional)
        capacidadeMaxima: ''                            // Número máximo de participantes (opcional)
    });

    // ========== CONTROLE DE PICKERS ==========
    // Estados para mostrar/ocultar os DateTimePickers nativos
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [showTimeInicioPicker, setShowTimeInicioPicker] = useState(false);
    const [showTimeFimPicker, setShowTimeFimPicker] = useState(false);

    /**
     * Abre o seletor de imagens da galeria
     * Solicita permissão e permite seleção múltipla (até 5 imagens)
     */
    const pickImage = async () => {
        try {
            // Solicita permissão para acessar a galeria de fotos
            const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();

            if (status !== 'granted') {
                Alert.alert(
                    'Permissão Necessária',
                    'Precisamos de permissão para acessar suas fotos.'
                );
                return;
            }

            // Abre a galeria com configurações
            const result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ImagePicker.MediaTypeOptions.Images,  // Apenas imagens
                allowsMultipleSelection: true,                     // Permite múltiplas seleções
                quality: 0.8,                                      // Compressão 80%
                aspect: [4, 3],                                    // Proporção sugerida
            });

            // Se não cancelou e retornou imagens
            if (!result.canceled && result.assets) {
                // Calcula quantas imagens ainda podem ser adicionadas (máx 5 total)
                const espacoDisponivel = 5 - imagens.length;
                const novasImagens = result.assets.slice(0, espacoDisponivel);
                setImagens([...imagens, ...novasImagens]);
            }
        } catch (error) {
            console.error('Erro ao selecionar imagem:', error);
            Alert.alert('Erro', 'Não foi possível selecionar a imagem.');
        }
    };

    /**
     * Remove uma imagem do array pelo índice
     * @param {Number} index - Índice da imagem a ser removida
     */
    const removeImage = (index) => {
        const novasImagens = imagens.filter((_, i) => i !== index);
        setImagens(novasImagens);
    };

    /**
     * Manipula a criação da postagem/evento
     * 
     * Fluxo:
     * 1. Valida campos obrigatórios (título, conteúdo, local se for evento)
     * 2. Monta FormData com texto, imagens e dados do evento
     * 3. Formata datas/horários para o padrão do backend (DD/MM/AAAA e HH:MM)
     * 4. Envia para o backend via service
     * 5. Limpa o formulário e retorna à tela anterior
     */
    const handleCreatePost = async () => {
        // ========== VALIDAÇÕES ==========
        if (!titulo.trim()) {
            Alert.alert('Atenção', 'Por favor, adicione um título ao seu post.');
            return;
        }

        if (!conteudo.trim()) {
            Alert.alert('Atenção', 'Por favor, escreva o conteúdo do post.');
            return;
        }

        // Validação específica para eventos: local é obrigatório
        if (isEvento) {
            if (!eventoData.local || !eventoData.local.trim()) {
                Alert.alert('Atenção', 'Por favor, informe o local do evento.');
                return;
            }
        }

        try {
            setLoading(true);

            // ========== MONTA FORMDATA ==========
            // Usa FormData quando há imagens OU quando é evento
            if (imagens.length > 0 || isEvento) {
                const formData = new FormData();

                // Dados básicos da postagem
                formData.append('titulo', titulo.trim());
                formData.append('conteudo', conteudo.trim());
                formData.append('usuarioId', user.id.toString());

                // ========== ADICIONA DADOS DO EVENTO ==========
                if (isEvento) {
                    /**
                     * Converte Date para string no formato DD/MM/AAAA
                     * @param {Date} date - Objeto Date a ser formatado
                     * @returns {String} Data formatada
                     */
                    const formatDate = (date) => {
                        const day = String(date.getDate()).padStart(2, '0');
                        const month = String(date.getMonth() + 1).padStart(2, '0');
                        const year = date.getFullYear();
                        return `${day}/${month}/${year}`;
                    };

                    /**
                     * Converte Date para string no formato HH:MM
                     * @param {Date} date - Objeto Date a ser formatado
                     * @returns {String} Hora formatada
                     */
                    const formatTime = (date) => {
                        const hours = String(date.getHours()).padStart(2, '0');
                        const minutes = String(date.getMinutes()).padStart(2, '0');
                        return `${hours}:${minutes}`;
                    };

                    formData.append('isEvento', 'true');
                    formData.append('dataEvento', formatDate(eventoData.dataEvento));
                    formData.append('horarioInicio', formatTime(eventoData.horarioInicio));
                    if (eventoData.horarioFim) formData.append('horarioFim', formatTime(eventoData.horarioFim));
                    formData.append('local', eventoData.local);
                    if (eventoData.endereco) formData.append('endereco', eventoData.endereco);
                    if (eventoData.capacidadeMaxima) formData.append('capacidadeMaxima', eventoData.capacidadeMaxima);
                }

                // ========== ADICIONA IMAGENS ==========
                imagens.forEach((imagem, index) => {
                    // Extrai extensão do arquivo
                    const uriParts = imagem.uri.split('.');
                    const fileType = uriParts[uriParts.length - 1].toLowerCase();

                    // Monta objeto de arquivo no formato esperado pelo FormData
                    const imageFile = {
                        uri: imagem.uri,
                        name: `image_${Date.now()}_${index}.${fileType}`,
                        type: `image/${fileType === 'jpg' ? 'jpeg' : fileType}`, // Converte jpg para jpeg
                    };

                    console.log('📸 Adicionando imagem:', imageFile);
                    formData.append('imagens', imageFile);
                });

                // Envia com FormData (multipart/form-data)
                console.log('📤 Enviando postagem' + (isEvento ? ' (EVENTO)' : '') + ' com', imagens.length, 'imagem(ns)');
                const resultado = await createPostagem(formData, true);
                console.log('✅ Postagem criada:', resultado.id, (isEvento ? '(EVENTO) ' : '') + 'com', resultado.imagens?.length || 0, 'imagens');
            } else {
                // ========== ENVIA JSON SIMPLES ==========
                // Usado quando não há imagens nem evento
                const novaPostagem = {
                    titulo: titulo.trim(),
                    conteudo: conteudo.trim(),
                    usuario: {
                        id: user.id
                    }
                };

                console.log('📤 Enviando postagem:', novaPostagem);
                await createPostagem(novaPostagem, false);
            }

            // ========== SUCESSO ==========
            Alert.alert(
                'Sucesso!',
                isEvento ? 'Evento criado com sucesso!' : 'Post criado com sucesso!',
                [
                    {
                        text: 'OK',
                        onPress: () => {
                            // Limpa todos os estados do formulário
                            setTitulo('');
                            setConteudo('');
                            setImagens([]);
                            setIsEvento(false);
                            setEventoData({
                                dataEvento: new Date(),
                                horarioInicio: new Date(),
                                horarioFim: new Date(),
                                local: '',
                                endereco: '',
                                capacidadeMaxima: ''
                            });
                            setShowDatePicker(false);
                            setShowTimeInicioPicker(false);
                            setShowTimeFimPicker(false);
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

    /**
     * Manipula o cancelamento da criação da postagem
     * 
     * Verifica se há alterações não salvas (título, conteúdo, imagens ou dados do evento).
     * Se houver, mostra um alerta de confirmação antes de descartar.
     * Se não houver alterações, volta direto para a tela anterior.
     */
    const handleCancel = () => {
        // Detecta se há qualquer conteúdo preenchido no post ou evento
        const temAlteracoes = titulo.trim() || conteudo.trim() || imagens.length > 0 ||
            isEvento || eventoData.local;

        if (temAlteracoes) {
            // Mostra alerta de confirmação para evitar perda acidental de dados
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
            // Sem alterações, volta direto
            navigation.goBack();
        }
    };

    // ========== RENDERIZAÇÃO ==========
    return (
        <View style={styles.safeArea}>
            <StatusBar style="dark" />

            {/* ========== CABEÇALHO ========== */}
            {/* Botão de cancelar, título da tela e espaçamento */}
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
                {/* ========== INFORMAÇÕES DO USUÁRIO ========== */}
                {/* Foto de perfil e nome do usuário logado */}
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

                {/* ========== CAMPO DE TÍTULO ========== */}
                {/* Input para o título da postagem com contador de caracteres */}
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

                {/* ========== CAMPO DE CONTEÚDO ========== */}
                {/* Área de texto para o conteúdo da postagem com contador */}
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

                {/* ========== PREVIEW DE IMAGENS ========== */}
                {/* Componente que exibe imagens selecionadas em scroll horizontal com botão de remover */}
                <ImagePreview imagens={imagens} onRemove={removeImage} />

                {/* ========== FORMULÁRIO DE EVENTO ========== */}
                {/* Componente com campos de data, horário, local, endereço e capacidade */}
                {isEvento && (
                    <EventForm
                        eventoData={eventoData}
                        setEventoData={setEventoData}
                        showDatePicker={showDatePicker}
                        setShowDatePicker={setShowDatePicker}
                        showTimeInicioPicker={showTimeInicioPicker}
                        setShowTimeInicioPicker={setShowTimeInicioPicker}
                        showTimeFimPicker={showTimeFimPicker}
                        setShowTimeFimPicker={setShowTimeFimPicker}
                    />
                )}

                {/* ========== AÇÕES ADICIONAIS ========== */}
                {/* Componente com botões para adicionar foto e alternar modo evento */}
                <PostActions
                    imagensCount={imagens.length}
                    onPickImage={pickImage}
                    isEvento={isEvento}
                    onToggleEvento={() => setIsEvento(!isEvento)}
                />
            </ScrollView>

            {/* ========== RODAPÉ COM BOTÃO DE PUBLICAR ========== */}
            {/* Botão de publicação fixo no rodapé, desabilitado se campos obrigatórios vazios */}
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

/**
 * ESTILOS DO COMPONENTE
 * 
 * NOTA: Alguns estilos que estavam aqui foram movidos para os componentes respectivos:
 * - Estilos de preview de imagens → ImagePreview.js
 * - Estilos de formulário de evento → EventForm.js
 * - Estilos de botões de ação → PostActions.js
 */
const styles = StyleSheet.create({
    // ========== CONTAINER PRINCIPAL ==========
    safeArea: {
        flex: 1,
        backgroundColor: '#fdfdfd',
    },

    // ========== CABEÇALHO ==========
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
        width: 34, // Espaçador para centralizar o título
    },

    // ========== ÁREA DE ROLAGEM ==========
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        padding: 20,
    },

    // ========== INFORMAÇÕES DO USUÁRIO ==========
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

    // ========== INPUTS DE TEXTO ==========
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

    // ========== RODAPÉ ==========
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

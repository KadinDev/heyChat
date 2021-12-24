import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  SafeAreaView, 
  TouchableOpacity, 
  FlatList, 
  StyleSheet, 
  StatusBar,
  Modal,
  ActivityIndicator,
  Alert
} from 'react-native';
// SafeAreaView - para caso o usuário esteja no IOS vai tá a tela sempre em uma area de visualização

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

import { useNavigation, useIsFocused } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import { FabButton } from '../../components/FabButton';
import { ModalNewRoom } from '../../components/ModalNewRoom';
import { ChatList } from '../../components/ChatList';

export function ChatRoom(){
  const navigation = useNavigation();

  // useIsFocused, é a tela que estou atualmente.
  // quando eu estiver nessa tela, ele vai dizer que estou nela. vai ser true
  const isFocused = useIsFocused();

  const [modalVisible, setModalVisible] = useState(false);
  const [user, setUser] = useState(null);

  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updateModal, setUpdateModal] = useState(false);

  useEffect( ()=> {
    // currentUser, é se tem algum usuário logado
    // se tiver vai para o auth() - toJSON, devolvendo em JSON
    // se não tiver : - volta como null mesmo
    const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null;
    
    setUser(hasUser);

    // isFocused, toda vez que esse component(ChatRoom) estiver em foco, ou seja,
    // toda vez que eu estiver na tela, ela vai chamar o useEffect novamente!
  },[isFocused]);


  useEffect(()=>{

    let isActive = true;
    
    // pegando as salas de chat
    function getChat(){
      firestore()
      .collection("MESSAGE_THREADS")
      .orderBy("lastMessage.createdAt", "desc")
      .limit(10) // buscar os 10 primeiros grupos
      .get()
      .then((snapshot) => {
        // documentSnapshot, aqui terei acesso a todos os items, e o nome que dei é opcional
        const threads = snapshot.docs.map( documentSnapshot => {
          return {
            id: documentSnapshot.id,
            name: "",
            lastMessage: { text: '' },
            ...documentSnapshot.data(), // tudo o que estiver em documentSnapshot
          }
        } )


        // hackzinho para evitar perda de perfomance
        // como está true, vai fazer as alterações nesses 2 useStates
        // quando eu demontar o component(sair ou mudar de tela), isActive será = false
        // não vai fazer alterações nos 2 useStates
        if (isActive){
          setThreads(threads);
          setLoading(false);
        }
        

      })
    };

    getChat();

    return () => { // funcção que é chamada quando o component é desmontado,
      // ou seja, quando vc muda ou sai de tela
      isActive = false;
    }

  },[ isFocused, updateModal]);


  function handleSignOut(){
    auth()
    .signOut()
    .then(() => {
      setUser(null); // só para zerar e garantir que esteja vazio
      navigation.navigate("SignIn");
    })
    .catch(() => {
      console.log('Não possui nenhum usuário')
    })
  };

  function deleteRoom( ownerId, idRoom ){ // idRoom é o id da sala
    // se quem está tentando deletar não for o dono da sala
    if( ownerId !== user?.uid ) return;

    Alert.alert(
      "Atenção!",
      "Você tem certeza que deseja deletar essa sala?",
      [
        {
          text: "Cancelar",
          onPress: () => {},
          style: "cancel"
        },
        {
          text: "OK",
          onPress: () => handleDeleteRoom(idRoom)
        }
      ]
    )

  };

  async function handleDeleteRoom(idRoom){
    await firestore()
    .collection("MESSAGE_THREADS")
    .doc(idRoom)
    .delete();

    // o nome no curso desse state é updateScreen
    // coloquei modal não sei pq kkk
    // vai chamar novamente o useEffect montando o componente em tela
    // tirando a sala que foi excluída
    setUpdateModal(!updateModal)    

  }



  if (loading){
    return (
      <ActivityIndicator size="large" color="#555" style={{marginTop: 50}} />
    )
  }

  return (
    <SafeAreaView style={styles.container}>

      <StatusBar backgroundColor="#2E54D4" />
      
      <View style={styles.headerRoom}>
        <View style={styles.headerRoomLeft}>

          { user && (
            <TouchableOpacity
            activeOpacity={0.8}
            onPress={ handleSignOut }
            >
              <MaterialIcons
                name="arrow-back"
                size={30}
                color="#FFF"
              />
            </TouchableOpacity>
          ) }

          <Text style={styles.title}>Grupos</Text>
        </View>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={ () => navigation.navigate("Search") }
        >
          
          <MaterialIcons
            name="search"
            size={30}
            color="#FFF"
          />

        </TouchableOpacity>

      </View>


      <FlatList
        data={threads}
        keyExtractor={ item => item._id } // o _id, é o id da sala
        showsVerticalScrollIndicator={false}
        renderItem={ ({ item }) => (
          
          <ChatList 
            data={item} 
            deleteRoom={ () => deleteRoom( item.owner, item.id ) } 
            userStatus={user} //para ver se tem usuario logado
          />
        
          ) }
      />

      <FabButton 
        openModal={ setModalVisible } 
        userStatus={user} // user, está com a informação se tem ou nao usuario logado  
      />

      <Modal
        visible={modalVisible}
        animationType="fade"
        transparent={true}
      >

        <ModalNewRoom
          closeModal={setModalVisible}
          

          // esse modo vai ficar trocando o valor da updateModal toda vez que abrir e fechar o modal
          // como coloquei [ isFocused, updateModal] no useEffect, ele vai entender que o modal tbm faz parte
          // de carregar todas as salas em tela quando houver mudanças nele, ele tbm vai chamar o useEffect
          // que carrega as salas em tela. (sempre que eu criar uma nova sala)
          modal={ () => setUpdateModal(!updateModal) } 
        />

      </Modal>

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF'
  },
  headerRoom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 40,
    paddingBottom: 20,
    paddingHorizontal: 10,
    backgroundColor: '#2E54D4',
    elevation: 5
  },
  headerRoomLeft: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFF',
    paddingLeft: 10,
  }
})
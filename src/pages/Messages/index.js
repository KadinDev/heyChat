import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View,
  Text,
  TextInput, 
  FlatList, 
  SafeAreaView, 
  KeyboardAvoidingView,
  Platform,
  TouchableOpacity
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import Feather from 'react-native-vector-icons/Feather';

import { ChatMessage } from '../../components/ChatMessage';

// quando se manda dados atráves do navigate, vc pega aqui como route
export function Messages( {route} ){
  // esse thread veio do --- Messages", { thread: data }
  const { thread } = route.params;

  // pegar todo o objeto do usuário logado
  const user = auth().currentUser.toJSON();
  const [input, setInput] = useState('')

  const [messages, setMessages] = useState([]);


  useEffect(() => {

    const unsubscribeListener = firestore().collection("MESSAGE_THREADS")
    .doc(thread.id) // acessando a sala que vc escolheu
    .collection("MESSAGES")
    .orderBy("createdAt", "desc")
    .onSnapshot( querySnapshot => { //querySnapshot, o nome vc escolhe
      
      const messages = querySnapshot.docs.map(doc => {
        const firebaseData = doc.data();

        const data = {
          _id: doc.id,
          text: '',
          createdAt: firestore.FieldValue.serverTimestamp(),
          ...firebaseData
        }

        // se a mensagem veio de um usuáriom vai acrescer esse abaixo
        // ao const data acima.
        // não virá com uma mensagem padrão do sistema que vc definiu
        if( !firebaseData.system ) {
          data.user = {
            ...firebaseData.user,
            name: firebaseData.user.displayName,
          }
        }

        return data;

      })


      setMessages(messages);

    } )

    // desmonta todo o useEffect quando vc mudar de tela
    return () => unsubscribeListener();

  },[]);


  async function handleSendMessage (){
    if (input === "") return;

    await firestore()
    .collection("MESSAGE_THREADS") //acessa a coleção MESSAGE_THREADS
    .doc(thread.id) // acessa o documento da sala que vc clicou
    .collection("MESSAGES") // e acessa a coleção de mensagens desse documento
    .add({
      text: input,
      createdAt: firestore.FieldValue.serverTimestamp(),
      user: {
        _id: user.uid, // id da pessoa que estiver enviando a mensagem
        displayName: user.displayName
      }
    })

    // atualizando o lastMessage no firestore
    await firestore()
    .collection("MESSAGE_THREADS")
    .doc(thread.id)
    .set(
      {
        lastMessage: {
          text: input,
          createdAt: firestore.FieldValue.serverTimestamp(),
        }
      },

      // quer dizer que vai pegar pegar essa parte de cima que vc está enviando,
      // e vai juntar com a que já tinha no bando de dados
      { merge: true } // merge = juntar
    
    )

    setInput('');

  };


  return (
    <SafeAreaView style={styles.container}>

      <FlatList
        style={{ width: '100%' }}
        data={messages}
        keyExtractor={ item => item._id }
        renderItem={ ({item}) => <ChatMessage data={item} /> }

        inverted={true} // invertendo a lista
      />


      <KeyboardAvoidingView
        // tudo que estiver aqui dentro vai subir quando o teclado abrir
        // no android já é padrão, mas no IOS não
        behavior={ Platform.OS === 'ios' ? "padding" : 'height' }
        style={{width: '100%'}}

        keyboardVerticalOffset={100}
      >
        <View style={styles.containerInput}>
          
          <View style={styles.mainContainerInput}> 
          
            <TextInput
              placeholder="Mensagem..."
              style={styles.textInput}
              value={input}
              multiline={true} // o input ficará crescendo(várias linhas)
              autoCorrect={false}

              onChangeText={ (text) => setInput(text) }
            />

          </View>

          <TouchableOpacity
          onPress={ handleSendMessage }
          activeOpacity={0.8}>

            <View style={styles.buttonContainer}>
              
              <Feather
                name="send"
                size={25}
                color="#FFF"
              />

            </View>

          </TouchableOpacity>

        </View>

      </KeyboardAvoidingView>

    </SafeAreaView>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerInput: {
    flexDirection: 'row',
    margin: 10,
    alignItems: 'flex-end'
  },
  mainContainerInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFF',
    flex: 1,
    borderRadius: 25,
    marginRight: 10,
    elevation: 2
  },
  textInput: {
    flex: 1,
    marginHorizontal: 10,
    maxHeight: 140,
    minHeight: 45,
  },
  buttonContainer: {
    backgroundColor: '#51C880',
    height: 48,
    width: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  }
})
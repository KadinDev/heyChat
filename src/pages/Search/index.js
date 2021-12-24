import React, { useState, useEffect } from 'react';
import { 
  View, 
  TouchableOpacity,
  SafeAreaView,
  TextInput,
  StyleSheet,
  Keyboard,
  FlatList
} from 'react-native';

import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

import { useIsFocused } from '@react-navigation/native';

import { ChatList } from '../../components/ChatList';

export function Search(){
  // tela em foco
  const isFocused = useIsFocused();

  const [input, setInput] = useState('');
  const [user, setUser] = useState(null);
  const [chatsRoom, setChatsRoom] = useState([]);

  useEffect( () => {
    const hasUser = auth().currentUser ? auth().currentUser.toJSON() : null;
    setUser(hasUser);

  },[isFocused]); 


  async function handleSearch() {
    if (input === "") return;

    const responseSearch = await firestore()
    .collection("MESSAGE_THREADS")
    //quando se utiliza o .where, no firebase ele pede para inserir
    //um UNICODE.
    /*
    no firebase vc vai em criar index.
    - código do conjunto = é o nome da coleção (MESSAGE_THREADS)
    - caminho do campo é o nome = name / descending
    - o outro foi = createdAt / descending

    Escopos da consulta
    - Coleção
    */
    .where('name', '>=', input)
    .where('name', '<=', input + '\uf8ff' )
    .get()
    .then( (querySnapshot) => {
      // vai percorrer todos os docs (salas) que vc criou
      //documentSnapshot, o nome é opcional
      const threads = querySnapshot.docs.map( documentSnapshot => {
        return {
          id: documentSnapshot.id,
          name: '',
          lastMessage: { text: '' },
          ...documentSnapshot.data(), // e passa tudo o que mais tiver
        }
      })

      setChatsRoom(threads);
      console.log(threads);
      setInput('');
      Keyboard.dismiss();

    } )
  };


  return (
    <SafeAreaView>
    
      <View style={styles.containerInput}>
        <TextInput
          placeholder="Digite o nome da sala"
          value={input}
          onChangeText={ setInput }
          style={styles.input}
          autoCapitalize={'none'} // evita de não começar com a primeir letra maiscula
        />

        <TouchableOpacity
          style={styles.buttonSearch}
          activeOpacity={0.8}
          onPress={ handleSearch }
        >
          <MaterialIcons
            name="search"
            size={30}
            color="#FFF"
          />
        </TouchableOpacity>

      </View>

      <FlatList
      showsVerticalScrollIndicator={false}
      data={chatsRoom}
      keyExtractor={ item => item._id  }
      renderItem={ ({ item }) => 
        // aproveitando o mesmo componente
        <ChatList data={item} userStatus={user} /> 
      }
      />

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  containerInput: {
    flexDirection: 'row',
    justifyContent: 'center',
    width: '100%',
    marginVertical: 14,
  },
  input: {
    backgroundColor: '#EBEBEB',
    marginLeft: 10,
    height: 50,
    width: '80%',
    borderRadius: 4,
    padding: 5,
    elevation: 2,
  },
  buttonSearch: {
    backgroundColor: '#2E54D4',
    borderRadius: 4,
    alignItems: 'center',
    justifyContent: 'center',
    width: '15%',
    marginLeft: 5,
    marginRight: 10,
    elevation: 2,

  }
})
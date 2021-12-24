import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
} from 'react-native';

import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';

export function ModalNewRoom ({ closeModal, modal }) {

    const [roomName, setRoomName] = useState('');

    const user = auth().currentUser.toJSON(); //pega user logado

    function handleButtonCreateRomm(){
        if (roomName === "") return;

        // deixar apenas cada usuário criar 3 grupos
        firestore().collection("MESSAGE_THREADS")
        .get()
        .then((snapshot) => {
            // fazendo o contador de quantas salas cada usuário está criando
            let myRooms = 0;

            snapshot.docs.map( docItem => {
                if(docItem.data().owner === user.uid){
                    myRooms += 1; // pega o valor da variavel e soma mais 1
                }
            })

            if (myRooms >= 3){
                alert('Cada usuário só pode criar 3 salas!')
            }
            else {
                createRoom();
            }
        })
    };

    // criar nova sala no firestore
    function createRoom(){
        firestore()
        .collection("MESSAGE_THREADS")
        .add({ // esse .add já cria um ID aleatório
            name: roomName, // nome da sala
            owner: user.uid, // usuário que está criando a sala
            lastMessage: {
                text: `Grupo ${roomName} criado. Bem vindo(a)!`,
                
                // pega a data atual do firestore, data que está criando a sala
                createdAt: firestore.FieldValue.serverTimestamp(), 
            }
        })
        // quando criar o de cima, vai acessar ele e dentro dele criar outro documento, esse de baixo
        .then (( docRef ) => {
            docRef.collection("MESSAGES").add({ // criando mais uma coleção
                text: `Grupo ${roomName} criado. Bem vindo(a)!`,
                createdAt: firestore.FieldValue.serverTimestamp(),
                system: true, // quer dizer que é uma mensagem automatica do sistema após criar o grupo
            })
            .then( () => {
                // quando criar a sala, quando criar esse docRef, aí sim fecha o modal
                closeModal(false);
                
                modal(); // quando criar a sala, assim que fechar o modal conforma definido em index do ChatRoom,
                // ele vai chamar o useEffect lá novamente, o que carrega as salas em tela
            } )
        } )

        .catch(( err ) => {
            console.log(err);
        })
    };

    return (
        <View style={styles.container}>
            
            <TouchableWithoutFeedback
                onPress={ () => closeModal(false) }
            >
                <View style={styles.modal}></View>
            </TouchableWithoutFeedback>

            <View style={styles.modalContent}>
                <Text style={styles.title}> Criar Novo Grupo? </Text>
                <TextInput
                    style={styles.input}
                    value={roomName}
                    onChangeText={ (text) => setRoomName(text) }
                    placeholder="Nome para sua sala"
                    placeholderTextColor="#888"
                />
                
                <TouchableOpacity
                style={styles.buttonCreate}
                activeOpacity={0.8}
                onPress={ handleButtonCreateRomm }
                >
                    <Text style={styles.buttonText}>Criar Sala</Text>

                </TouchableOpacity>

            </View>

        </View>
    )
};

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: 'rgba(34, 34, 34, 0.4)'
    },
    modal: {
        flex: 1, //ideia de uma view vazia com flex 1, para a outra ter flex 1 tbm,
        // e cada uma pegar 50% da tela, fazendo a de baixo ficar no final da tela
    },
    modalContent: {
        flex: 1,
        backgroundColor: '#FFFFFF',
        padding: 15,
    },
    title: {
      textAlign: 'center',
      fontSize: 19,
      fontWeight: 'bold',
      marginTop: 14,
      color: '#2E54D4'
    },
    input: {
        borderRadius: 4,
        height: 45,
        backgroundColor: '#DDD',
        marginVertical: 15,
        fontSize: 16,
        paddingHorizontal: 5,
    },
    buttonCreate: {
        borderRadius: 4,
        backgroundColor: '#2E54D4',
        height: 45,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#FFF',
    }
})
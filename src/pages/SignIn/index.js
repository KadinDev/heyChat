import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput, 
  SafeAreaView,
  Platform
} from 'react-native';

import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';

export function SignIn(){
  const navigation = useNavigation();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [type, setType] = useState(false);

  function handleType (){
    // essa ideia !type, se o type for verdadeiro muda para false,
    //se for false, muda para true. ele vai ficar trocando entre true e false em todo click
    setType(!type);
  };

  async function handleLogin(){
    
    if (type) {
      // cadastrar
      if( name === "" || email === "" || password === "") return;

      await auth().createUserWithEmailAndPassword(email, password)
      .then(( user ) => { // esse nome dentro do .then é opcional, vc escolhe
        user.user.updateProfile({
          displayName: name,
        })
        // apos tudo dar certo
        .then( () => { // .then é quando tudo der certo, faz o que estiver dentro. navigation.goBack();
          navigation.goBack();
        } )
      })  
      .catch((error) => {
        if (error.code === 'auth/email-already-in-use') {
          alert('Email já em uso por outro usuário!')
        }

        if (error.code === 'auth/invalid-email') {
          alert('Email inválido!')
        }
      })

    } else {
      // logar
      await auth().signInWithEmailAndPassword(email, password)
      .then(() => {
        navigation.goBack()
      })
      .catch( (error => {
        if (error.code === 'auth/invalid-email') {
          alert('Email inválido!')
        }
      }) )
    }
  }

  return (
    <SafeAreaView style={styles.container}>

      <Text style={styles.logo}> HeyGrupos </Text>
      <Text style={{marginBottom: 20}}> Ajude, colabore, faça networking </Text>

      { type && ( // && = apenas quando for true, ele vai renderizar o que estiver dentro
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={ (text) => setName(text) }
          placeholder="Seu nome"
          placeholderTextColor="#99999B"
        />
      ) }

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={ (text) => setEmail(text) }
        placeholder="Seu email"
        placeholderTextColor="#99999B"
      />

      <TextInput
        style={styles.input}
        value={password}
        onChangeText={ (text) => setPassword(text) }
        placeholder="Sua senha"
        placeholderTextColor="#99999B"
        secureTextEntry={true}
        
      />

      <TouchableOpacity 
        style={[styles.buttonLogin, { backgroundColor: type ? "#F53745" : "#57DD86" } ]}
        activeOpacity={0.8}
        onPress={ handleLogin }
      >
        <Text style={styles.buttonText}>
          { type ? 'Cadastrar' : 'Acessar' }
        </Text>
      </TouchableOpacity>

      <TouchableOpacity
        activeOpacity={0.8}
        onPress={ handleType }
      >
        <Text style={{fontSize: 18}}>
          { type ? 'Já possuo uma conta' : 'Criar minha conta' }
        </Text>
      </TouchableOpacity>

    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: "#FFF"
  },

  logo: {
    marginTop: Platform.OS === "android" ? 55 : 80,
    fontSize: 28,
    fontWeight: "bold",
  },
  input: {
    color: "#121212",
    backgroundColor: "#EBEBEB",
    width: "90%",
    borderRadius: 6,
    marginBottom: 10,
    paddingHorizontal: 8,
    height: 50,
    fontSize: 18
  },
  buttonLogin: {
    width: "90%",
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 10,
    borderRadius: 6,
  },
  buttonText: {
    color: '#FFF',
    fontWeight: 'bold',
    fontSize: 19
  }

})
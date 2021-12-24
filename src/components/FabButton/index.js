import React from 'react';
import { TouchableOpacity, StyleSheet, View } from 'react-native';

import auth from '@react-native-firebase/auth';
import { useNavigation } from '@react-navigation/native';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons'

export function FabButton( {openModal, userStatus} ) {

    const navigation = useNavigation();

    function handleNavigationButton(){
        userStatus ? openModal(true) : navigation.navigate("SignIn")
    }

    return (
        <TouchableOpacity
            style={styles.button}
            activeOpacity={0.8}
            onPress={ handleNavigationButton }
            >
                <MaterialIcons
                    name="add"
                    size={30}
                    color="#FFF"
                />
        </TouchableOpacity>
        
    )
};

const styles = StyleSheet.create({
    button: {
      backgroundColor: '#2E54D4',
      width: 60,
      height: 60,
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: 30,
      position: "absolute",
      bottom: 40,
      right: 20,
      elevation: 2,
      zIndex: 10
    },

  })
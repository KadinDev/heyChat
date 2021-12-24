import React from 'react';
import { 
    View, 
    Text, 
    StyleSheet, 
    TouchableOpacity 
} from 'react-native';

import { useNavigation } from '@react-navigation/native';

export function ChatList( {data, deleteRoom, userStatus} ){

    const navigation = useNavigation();

    function openChat(){
        if (userStatus){
            // passando dados de um componente pelo navigate para a próxima tela,
            // os dados dessa tela vou poder acessar lá
            // thread é o nome que criei
            navigation.navigate("Messages", { thread: data } );
        }
        else {
            navigation.navigate("SignIn");
        }
    };

    return (
        <TouchableOpacity
            activeOpacity={0.8}
            onPress={ openChat }

            // se tiver uma função deleteRoom, chama ela
            onLongPress={ () => deleteRoom && deleteRoom() }
        >
            <View style={styles.row}>
                <View style={styles.content}>
                    <View style={styles.header}>
                        <Text style={styles.nameText} numberOfLines={1} > {data.name} </Text>
                    </View>

                    <Text style={styles.contentText} numberOfLines={1} >
                        {data.lastMessage.text}
                    </Text>

                </View>
            </View>
        </TouchableOpacity>
    )
};

const styles = StyleSheet.create({
    row: {
        paddingHorizontal: 10,
        paddingVertical: 15,
        flexDirection: 'row',
        alignContent: 'center',
        backgroundColor: 'rgba(241, 240, 245, 0.5)',
        marginVertical: 4,
        elevation: 1
    },
    content: {
        flexShrink: 1,
    },
    header: {
        flexDirection: 'row',
    },
    contentText: {
        color: '#777',
        fontSize: 16,
        marginTop: 2,
    },
    nameText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#111',
        opacity: 0.8,
    }
})
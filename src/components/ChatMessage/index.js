// useMemo para ter mais perfomance na verificação do envio de mensagens,
// para ver se foi o usuário(dono da sala) que mandou messagem ou outro
import React, { useMemo } from 'react';

import { 
    View, 
    Text, 
    StyleSheet 
} from 'react-native';

import auth from '@react-native-firebase/auth';

export function ChatMessage( { data } ){
    const user = auth().currentUser.toJSON();

    const isMyMessage = useMemo( () => {
        // ? = se estiver o data, o user
        // como estou buscando algo que seja true, e ainda não tem
        // ? = essa ideia vai fazer com que o app não trave até ter o resultado que busco,
        return data?.user?._id === user.uid; 
    },[data] ); //toda vez que o data mudar ele chama essa função

    return (
        <View style={styles.container}>

            <View 
                style={[
                    styles.messageBox,
                    {
                        backgroundColor: isMyMessage ? '#DCF8C5' : '#FFF',
                        marginLeft: isMyMessage ? 50 : 0,
                        marginRight: isMyMessage ? 0 : 50,
                    }
                ]}
            >   
                { !isMyMessage && (
                    <Text style={styles.name}> { data?.user?.displayName } </Text>
                ) }

                <Text style={styles.message}> {data.text} </Text>
            </View>


        </View>
    )
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
    },
    messageBox: {
        borderRadius: 5,
        padding: 10,
    },
    name: {
        color: '#F53545',
        fontWeight: 'bold',
        marginBottom: 5,
    },

})
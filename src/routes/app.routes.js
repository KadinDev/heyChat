import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { SignIn } from '../pages/SignIn';
import { ChatRoom } from '../pages/ChatRoom';
import { Messages } from '../pages/Messages';
import { Search } from '../pages/Search';

const AppStack = createNativeStackNavigator();

export function AppRoutes(){

    return(
        //initialRouteName="ChatRoom" primeira tela a ser aberta
        <AppStack.Navigator initialRouteName="ChatRoom">
            
            <AppStack.Screen
                name="SignIn"
                component={SignIn}
                options={{
                    title: "Faça seu login"
                }}
            />

            <AppStack.Screen
                name="ChatRoom"
                component={ChatRoom}
                options={{
                    headerShown: false
                }}
            />

            <AppStack.Screen
                name="Messages"
                component={Messages}
                // atrávez do params {route} que passei ali,
                // posso ter acesso as informações que estão passando para essa tela de Messages
                options={ ({ route }) => ({
                    title: route.params.thread.name, // aqui coloco o title de cada um
                }) }
            />

            <AppStack.Screen
                name="Search"
                component={Search}
                // atrávez do params {route} que passei ali,
                // posso ter acesso as informações que estão passando para essa tela de Messages
                options={{
                    title: "Procurando algum grupo?"
                }}
            />
        
        </AppStack.Navigator>
    )

}
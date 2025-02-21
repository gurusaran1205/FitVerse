import { View, Text, Button, Alert, TouchableOpacity} from 'react-native'
import React from 'react';
import { getAuth, signOut } from 'firebase/auth';
import { useRouter } from 'expo-router';
import LogoutButton from '../../components/LogoutButton';

export default function profile() {
  return (
    <View>
      <Text>profile</Text>
      <LogoutButton/>
      
    </View>
  )
}
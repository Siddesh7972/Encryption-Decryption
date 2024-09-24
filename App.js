import 'react-native-gesture-handler';
import React, {useState} from 'react';
import {View, TextInput, Button, Alert, SafeAreaView} from 'react-native';
import {
  createCipheriv,
  createDecipheriv,
  randomBytes,
} from 'react-native-quick-crypto';
import {Buffer} from 'buffer';

global.Buffer = Buffer;

const ALGORITHM = 'aes-256-cbc';
const KEY = randomBytes(32);
const IV = randomBytes(16);

const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [encryptedData, setEncryptedData] = useState('');

  const encryptData = data => {
    const cipher = createCipheriv(ALGORITHM, KEY, IV);
    let encrypted = cipher.update(data, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return `${IV.toString('hex')}:${encrypted}`;
  };

  const decryptData = data => {
    const [ivHex, encryptedText] = data.split(':');
    const decipher = createDecipheriv(
      ALGORITHM,
      KEY,
      Buffer.from(ivHex, 'hex'),
    );
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  };

  const handleStoreData = () => {
    const userData = JSON.stringify({username, password});
    const encrypted = encryptData(userData);
    setEncryptedData(encrypted);
    Alert.alert('Success', 'User data encrypted and stored!');
  };

  const handleRetrieveData = () => {
    if (encryptedData) {
      const decrypted = decryptData(encryptedData);
      Alert.alert('Decrypted User Data', decrypted);
    } else {
      Alert.alert('Error', 'No data found to decrypt.');
    }
  };

  return (
    <SafeAreaView>
      <View style={{padding: 20}}>
        <TextInput
          placeholder="Username"
          value={username}
          onChangeText={setUsername}
          style={{borderWidth: 1, marginBottom: 10, padding: 8}}
        />
        <TextInput
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={{borderWidth: 1, marginBottom: 10, padding: 8}}
        />
        <Button title="Store Encrypted Data" onPress={handleStoreData} />
        <Button title="Retrieve Decrypted Data" onPress={handleRetrieveData} />
      </View>
    </SafeAreaView>
  );
};

export default App;

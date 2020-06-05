import React, { useState, useEffect } from 'react';
import { Feather as Icon } from '@expo/vector-icons';
import { View, ImageBackground, Text, Image, StyleSheet } from 'react-native';
import { RectButton } from 'react-native-gesture-handler';
import { useNavigation } from '@react-navigation/native';
import RNPickerSelect from 'react-native-picker-select';
import axios from 'axios';

interface IBGEUFRes {
  sigla: string;
}

interface IBGECityRes {
  nome: string;
}

interface SelectItem {
  label: string;
  value: string;
}

const Home = () => {
  const [UFs, setUFs] = useState<SelectItem[]>([]);
  const [cities, setCities] = useState<SelectItem[]>([]);

  const [selectedUF, setSelectedUF] = useState('0');
  const [selectedCity, setSelectedCity] = useState('0');

  const navigation = useNavigation();

  useEffect(() => {
    axios.get<IBGEUFRes[]>('https://servicodados.ibge.gov.br/api/v1/localidades/estados')
      .then(res => {
        const UFInitials = res.data.map(uf => {
          const item = {
            label: uf.sigla,
            value: uf.sigla
          }

          return item;
        });

        setUFs(UFInitials);
      });
  }, []);

  useEffect(() => {
    if (selectedUF === '0') {
      return;
    }

    axios.get<IBGECityRes[]>(`https://servicodados.ibge.gov.br/api/v1/localidades/estados/${selectedUF}/municipios`)
      .then(res => {
        const citiesName = res.data.map(city => {
          const item = {
            label: city.nome,
            value: city.nome
          }

          return item;
        });

        setCities(citiesName);
      });
  }, [selectedUF]);

  function handleNavigateToPoints() {
    navigation.navigate('Points', {
      uf: selectedUF,
      city: selectedCity,
    });
  }

  return (
    <ImageBackground
      source={require('../../assets/home-background.png')}
      style={styles.container}
      imageStyle={{ width: 274, height: 368 }}
    >
      <View style={styles.main}>
        <Image source={require('../../assets/logo.png')} />
        <View>
          <Text style={styles.title}>Seu marketplace de coleta de resíduos</Text>
          <Text style={styles.description}>Ajudamos pessoas a encontratem pontos de coleta de forma eficiente.</Text>
        </View>
      </View>

      <View style={styles.footer}>
        <View style={styles.input}>
          <RNPickerSelect
            placeholder={{
              label: 'Selecione um estado',
              value: null,
            }}
            onValueChange={(value) => setSelectedUF(value)}
            items={UFs}
          />
        </View>
        <View style={styles.input}>
          <RNPickerSelect
            placeholder={{
              label: 'Selecione uma cidade',
              value: null,
            }}
            onValueChange={(value) => setSelectedCity(value)}
            items={cities}
          />
        </View>

        <RectButton style={styles.button} onPress={handleNavigateToPoints}>
          <View style={styles.buttonIcon}>
            <Icon name="arrow-right" color="#FFF" size={24} />
          </View>
          <Text style={styles.buttonText}>Entrar</Text>
        </RectButton>
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 32,
  },

  main: {
    flex: 1,
    justifyContent: 'center',
  },

  title: {
    color: '#322153',
    fontSize: 32,
    fontFamily: 'Ubuntu_700Bold',
    maxWidth: 260,
    marginTop: 64,
  },

  description: {
    color: '#6C6C80',
    fontSize: 16,
    marginTop: 16,
    fontFamily: 'Roboto_400Regular',
    maxWidth: 260,
    lineHeight: 24,
  },

  footer: {},

  select: {},

  input: {
    height: 60,
    backgroundColor: '#FFF',
    borderRadius: 10,
    marginBottom: 8,
    paddingHorizontal: 16,
    justifyContent: 'center',
    alignItems: 'center'
  },

  button: {
    backgroundColor: '#34CB79',
    height: 60,
    flexDirection: 'row',
    borderRadius: 10,
    overflow: 'hidden',
    alignItems: 'center',
    marginTop: 8,
  },

  buttonIcon: {
    height: 60,
    width: 60,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderTopLeftRadius: 10,
    borderBottomLeftRadius: 10,
  },

  buttonText: {
    flex: 1,
    justifyContent: 'center',
    textAlign: 'center',
    color: '#FFF',
    fontFamily: 'Roboto_500Medium',
    fontSize: 16,
  }
});

export default Home;

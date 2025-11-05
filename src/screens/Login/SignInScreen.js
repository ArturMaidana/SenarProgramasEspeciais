import React, { useState, useEffect, useRef, useContext } from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Animated,
  Easing,
  Dimensions,
  ActivityIndicator,
  TouchableWithoutFeedback,
  Keyboard,
  Text,
} from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';

import LogoSenar2 from '../../assets/LogoSenar2.svg';
import NomeSenar from '../../assets/NameApp.svg';
import Famato from '../../assets/Famato.svg';
import { s, vs, ms } from 'react-native-size-matters';
import {
  EmailIcon,
  LockIcon,
  EyeIcon,
  EyeOffIcon,
} from '../../components/Icons/Icons'; // Importe os ícones de olho
import { UserContext } from '../../contexts/UserContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

import Api from '../../Api';

const { height } = Dimensions.get('window');

export default function SignInScreen() {
  const { signIn, loadingAuth } = useContext(UserContext);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false); // Estado para mostrar/ocultar senha
  const navigation = useNavigation();

  const logoContainerY = useRef(new Animated.Value(0)).current;
  const logoX = useRef(new Animated.Value(-55)).current;
  const nomeX = useRef(new Animated.Value(60)).current;
  const nomeY = useRef(new Animated.Value(0)).current;
  const formY = useRef(new Animated.Value(height)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(logoContainerY, {
        toValue: -(height / 3),
        duration: 800,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.timing(logoX, {
        toValue: 0,
        duration: 800,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.timing(nomeX, {
        toValue: 0,
        duration: 800,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.timing(nomeY, {
        toValue: 5,
        duration: 800,
        easing: Easing.elastic(1),
        useNativeDriver: true,
      }),
      Animated.timing(formY, {
        toValue: 0,
        duration: 600,
        delay: 200,
        easing: Easing.out(Easing.ease),
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleSignClick = async () => {
    if (ValidarAcesso()) {
      return Dialog.show({
        type: ALERT_TYPE.DANGER,
        title: 'Erro',
        textBody: messageAlert,
        button: 'Fechar',
      });
    }
    const response = signIn(email, password);
  };

  const ValidarAcesso = () => {
    messageAlert = '';
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;
    let result = false;
    if (email === '') {
      result = true;
      messageAlert = 'O campo Endereço de e-mail é obrigatório.';
    } else if (password === '') {
      result = true;
      messageAlert = 'O campo Senha é obrigatório.';
    } else if (!reg.test(email.trim())) {
      result = true;
      messageAlert =
        'O Endereço de e-mail deve ser um endereço de e-mail válido.';
    }
    return result;
  };

  // Função para alternar a visibilidade da senha
  const toggleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.containerLogo,
          { transform: [{ translateY: logoContainerY }] },
        ]}
      >
        <Animated.View style={{ transform: [{ translateX: logoX }] }}>
          <LogoSenar2 width={106} height={99} />
        </Animated.View>
        <Animated.View
          style={{
            transform: [{ translateX: nomeX }, { translateY: nomeY }],
          }}
        >
          <NomeSenar width={105} height={55} />
        </Animated.View>
      </Animated.View>

      <Animated.View
        style={[styles.containerForm, { transform: [{ translateY: formY }] }]}
      >
        <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
          <KeyboardAwareScrollView
            style={{ width: '100%' }}
            contentContainerStyle={styles.scrollContentContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            enableOnAndroid={true}
            extraScrollHeight={ms(20)}
          >
            <View style={styles.formContent}>
              <Text style={styles.title}>Seja Bem-vindo!</Text>
              <Text style={styles.text}>
                Para continuar é necessário fazer login
              </Text>

              <Text style={styles.label}>Email</Text>
              <View style={styles.inputContainer}>
                <EmailIcon />
                <TextInput
                  style={styles.input}
                  placeholder=" Digite seu email"
                  placeholderTextColor="#aaa"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>

              <Text style={styles.label}>Senha</Text>
              <View style={styles.inputContainer}>
                <LockIcon />
                <TextInput
                  style={styles.input}
                  placeholder=" Digite sua senha"
                  placeholderTextColor="#aaa"
                  secureTextEntry={!showPassword} // Alterna entre texto normal e pontos
                  value={password}
                  onChangeText={setPassword}
                />
                {/* Botão para mostrar/ocultar senha */}
                <TouchableOpacity
                  style={styles.eyeButton}
                  onPress={toggleShowPassword}
                >
                  {showPassword ? (
                    <EyeOffIcon width={20} height={20} />
                  ) : (
                    <EyeIcon width={20} height={20} />
                  )}
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                style={styles.forgotPasswordButton}
                onPress={() => navigation.navigate('ForgetPassword')}
              >
                <Text style={styles.forgotPasswordText}>Esqueceu a senha?</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.footer}>
              <TouchableOpacity style={styles.button} onPress={handleSignClick}>
                {loadingAuth ? (
                  <ActivityIndicator size={20} color="#FFF" />
                ) : (
                  <Text style={styles.buttonText}>Entrar</Text>
                )}
              </TouchableOpacity>
              <Famato width="70%" height={70} />
            </View>
          </KeyboardAwareScrollView>
        </TouchableWithoutFeedback>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00A859',
    flex: 1,
    justifyContent: 'flex-end',
  },
  containerLogo: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerForm: {
    height: '70%',
    backgroundColor: '#FFF',
    borderTopLeftRadius: ms(45),
    borderTopRightRadius: ms(45),
    paddingTop: ms(20),
  },
  scrollContentContainer: {
    flexGrow: 1,
    justifyContent: 'space-between',
    paddingHorizontal: '5%',
    paddingBottom: ms(40),
  },
  formContent: {
    width: '100%',
    alignItems: 'center',
  },
  label: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: ms(14),
    color: '#333',
    marginBottom: ms(5),
    alignSelf: 'flex-start',
  },
  inputContainer: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: ms(1),
    borderColor: '#e7e7e7ff',
    borderRadius: ms(12),
    paddingHorizontal: ms(15),
    marginBottom: ms(15),
    backgroundColor: '#fffffff9',
  },
  input: {
    fontFamily: 'Ubuntu-Light',
    flex: 1,
    height: ms(45),
    fontSize: ms(14),
    color: '#333',
    paddingLeft: ms(10),
    paddingRight: ms(10), // Espaço para o botão do olho
  },
  eyeButton: {
    padding: ms(5),
    marginLeft: ms(5),
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
  },
  forgotPasswordText: {
    color: '#333',
    fontFamily: 'Ubuntu-Bold',
    fontSize: ms(14),
    marginTop: ms(10),
  },
  title: {
    fontFamily: 'Ubuntu-Bold',
    fontSize: ms(18),
    marginBottom: ms(5),
    textAlign: 'center',
  },
  text: {
    fontFamily: 'Ubuntu-Regular',
    fontSize: ms(14),
    marginBottom: ms(40),
    color: '#3d3d3dff',
    textAlign: 'center',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingTop: ms(40),
  },
  button: {
    backgroundColor: '#00A859',
    borderRadius: ms(10),
    paddingVertical: ms(12),
    width: '60%',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: ms(40),
  },
  buttonText: {
    fontFamily: 'Ubuntu-Bold',
    color: '#FFF',
    fontSize: ms(15),
  },
});

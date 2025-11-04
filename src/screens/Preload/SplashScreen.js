import React, { useEffect, useRef, useContext } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { View, StyleSheet, Animated, Easing } from 'react-native';

import LogoSenar2 from '../../assets/LogoSenar2.svg';
import NomeSenar from '../../assets/NameApp.svg';
import { UserContext } from '../../contexts/UserContext';

export default function SplashScreen({ navigation }) {
  const { loadStorage } = useContext(UserContext);
  const scaleValue = useRef(new Animated.Value(1.5)).current;
  const logoPositionX = useRef(new Animated.Value(0)).current;
  const nomeOpacity = useRef(new Animated.Value(0)).current;
  const nomePositionX = useRef(new Animated.Value(20)).current;

  useEffect(() => {
    const checkToken = async () => {
      loadStorage();
    };

    Animated.sequence([
      Animated.delay(1000),
      Animated.parallel([
        Animated.timing(scaleValue, {
          toValue: 1,
          duration: 1000,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        }),
        Animated.timing(logoPositionX, {
          toValue: -75,
          duration: 1000,
          easing: Easing.elastic(1),
          useNativeDriver: true,
        }),
        Animated.sequence([
          Animated.delay(400),
          Animated.parallel([
            Animated.timing(nomeOpacity, {
              toValue: 1,
              duration: 400,
              useNativeDriver: true,
            }),
            Animated.timing(nomePositionX, {
              toValue: 65,
              duration: 500,
              easing: Easing.elastic(1.5),
              useNativeDriver: true,
            }),
          ]),
        ]),
      ]),
    ]).start(() => {
      checkToken();
    });
  }, []);

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.animatedContainer,
          {
            transform: [{ translateX: logoPositionX }, { scale: scaleValue }],
          },
        ]}
      >
        <LogoSenar2 width={100} height={100} />
      </Animated.View>

      <Animated.View
        style={[
          styles.animatedContainer,
          {
            opacity: nomeOpacity,
            transform: [{ translateX: nomePositionX }],
          },
        ]}
      >
        <NomeSenar width={160} height={80} />
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#00A859',
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  animatedContainer: {
    position: 'absolute',
  },
});

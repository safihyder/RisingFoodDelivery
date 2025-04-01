import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Svg, { Path, Circle } from 'react-native-svg';

const Logo = ({ size = 100, color = '#ff6b6b' }) => {
    return (
        <View style={styles.container}>
            <Svg width={size} height={size} viewBox="0 0 100 100">
                <Circle cx="50" cy="50" r="45" fill={color} />
                <Circle cx="50" cy="50" r="35" fill="white" />
                <Path
                    d="M30,40 L70,40 L70,45 L65,60 L35,60 L30,45 Z"
                    fill={color}
                />
                <Path
                    d="M40,60 L40,70 L45,70 L45,60 Z"
                    fill={color}
                />
                <Path
                    d="M55,60 L55,70 L60,70 L60,60 Z"
                    fill={color}
                />
            </Svg>
            <Text style={[styles.logoText, { color }]}>Rising Food</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
    },
    logoText: {
        fontSize: 18,
        fontWeight: 'bold',
        marginTop: 8,
    },
});

export default Logo; 
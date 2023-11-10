import { useLocalSearchParams, useNavigation } from 'expo-router';
import * as _ from 'radash';
import { Avatar, IconButton, Text, useTheme } from 'react-native-paper';
import React, { useLayoutEffect } from 'react';
import { View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import crowdpass from '@/adapters/crowdpass';

export default function CheckInResult(props) {
  const navigation = useNavigation();
  const {
    ticketId,
    firstName,
    lastName,
    checkedIn,
    profilePhotoBlobId,
    error,
  } = useLocalSearchParams();
  const checkInSuccess = checkedIn == 'true' ? true : false;
  const backgroundColor = checkInSuccess ? '#33c682' : '#f82401';
  const theme = useTheme();

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: checkInSuccess ? 'Check In Success' : 'Check In Failed',
      headerStyle: {
        justifyContent: 'center',
        backgroundColor: backgroundColor,
      },
      headerShadowVisible: false,
      headerTitleStyle: {
        color: '#fff',
      },
      headerLeft: () => <></>,
      headerRight: () => (
        <IconButton
          onPress={() => {
            navigation.goBack();
          }}
          icon="close"
          iconColor="white"
          size={20}
        />
      ),
    });
  }, [checkInSuccess]);

  const renderCheckInResult = () => {
    if (checkInSuccess)
      return (
        <View
          style={{
            height: '100%',
            flex: 1,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <View
            style={{
              borderWidth: 4,
              borderColor: theme.colors.primary,
              borderRadius: 100,
              marginBottom: 30,
            }}
          >
            <View
              style={{
                borderWidth: 1,
                borderColor: '#fff',
                borderRadius: 100,
              }}
            >
              {profilePhotoBlobId ? (
                <Avatar.Image
                  style={{
                    borderColor: '#fff',
                  }}
                  size={160}
                  source={{
                    uri: `${process.env['NX_URI']}/blobs/${profilePhotoBlobId}`,
                    headers: {
                      Authorization: `Bearer ${
                        crowdpass.useToken.getState().token
                      }`,
                    },
                  }}
                />
              ) : (
                <Avatar.Text
                  style={{
                    borderColor: '#fff',
                  }}
                  size={160}
                  label={firstName[0] + lastName[0]}
                />
              )}
            </View>
          </View>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '400',
              color: '#fff',
            }}
          >
            Attendee Checked In
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '400',
              color: '#fff',
              marginTop: 4,
            }}
          >
            Successfully
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '400',
              color: '#fff',
              marginTop: 4,
            }}
          >
            {firstName + ' ' + lastName}
          </Text>
          <Text
            style={{
              fontSize: 18,
              fontWeight: '800',
              color: '#fff',
              marginTop: 24,
              marginBottom: 8,
            }}
          >
            {ticketId.slice(0, -2)}
          </Text>
          <Ionicons name="checkmark-circle" size={200} color="#fff" />
          <Text
            style={{
              fontSize: 24,
              fontWeight: '400',
              color: '#fff',
              marginTop: 20,
            }}
          >
            CHECKED IN
          </Text>
          <View style={{ height: '10%' }} />
        </View>
      );
    else {
      return (
        <View
          style={{
            height: '100%',
            flex: 1,
            borderTopLeftRadius: 20,
            borderTopRightRadius: 20,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              fontSize: 18,
              textAlign: 'center',
              fontWeight: '400',
              color: '#fff',
            }}
          >
            {error}
          </Text>

          <Ionicons name="close-circle" size={200} color="#fff" />
          <Text
            style={{
              fontSize: 24,
              fontWeight: '400',
              color: '#fff',
              marginTop: 20,
            }}
          >
            FAILED
          </Text>
          <View style={{ height: '10%' }} />
        </View>
      );
    }
  };

  return (
    <View
      style={{
        backgroundColor: backgroundColor,
        flex: 1,
      }}
    >
      {renderCheckInResult()}
    </View>
  );
}

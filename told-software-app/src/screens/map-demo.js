import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { MapView } from 'expo';

export class MapDemoScreen extends React.Component {

  marker = { latitude: 37.78825, longitude: -122.4324 };

  dragMarker = (c) => {
    this.marker = c;
    this.setState({});
  };

  render() {
    return (
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          ...this.marker,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      >
        <View style={styles.container}>
          <Text>{'Lat: ' + this.marker.latitude}</Text>
          <Text>{'Long: ' + this.marker.longitude}</Text>
          <Text>Hold and Drag the pin to move it.</Text>
        </View>

        <MapView.Marker draggable coordinate={this.marker} onDragEnd={(e) => this.dragMarker(e.nativeEvent.coordinate)} />
      </MapView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    height: 90,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

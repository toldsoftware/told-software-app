"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const React = require("react");
const react_native_1 = require("react-native");
const expo_1 = require("expo");
class MapDemoScreen extends React.Component {
    constructor() {
        super(...arguments);
        this.marker = { latitude: 37.78825, longitude: -122.4324 };
        this.dragMarker = (c) => {
            this.marker = c;
            this.setState({});
        };
    }
    render() {
        return (<expo_1.MapView style={{ flex: 1 }} initialRegion={Object.assign({}, this.marker, { latitudeDelta: 0.0922, longitudeDelta: 0.0421 })}>
        <react_native_1.View style={styles.container}>
          <react_native_1.Text>{'Lat: ' + this.marker.latitude}</react_native_1.Text>
          <react_native_1.Text>{'Long: ' + this.marker.longitude}</react_native_1.Text>
          <react_native_1.Text>Hold and Drag the pin to move it.</react_native_1.Text>
        </react_native_1.View>

        <expo_1.MapView.Marker draggable coordinate={this.marker} onDragEnd={(e) => this.dragMarker(e.nativeEvent.coordinate)}/>
      </expo_1.MapView>);
    }
}
exports.MapDemoScreen = MapDemoScreen;
const styles = react_native_1.StyleSheet.create({
    container: {
        height: 90,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

import * as React from 'react';
import { View, ViewProperties, StyleSheet } from 'react-native';
import { Svg } from 'expo';
const { Circle, Rect, Path, G } = Svg;

export class QuoteCartoon extends React.Component<{ isPointingRight: boolean, colors: { backgroundColor: string, borderColor: string } }, { width: number, height: number }> {

  constructor() {
    super();
    this.state = { width: 300, height: 75 };
  }

  render() {
    const targetWidth = this.state.width;
    const targetHeight = this.state.height;

    const w = targetWidth / 300;
    const h = targetHeight / 75;

    return (
      <View onLayout={e => { this.setState({ width: e.nativeEvent.layout.width, height: e.nativeEvent.layout.height }) }}>
        <View style={styles.svg}>
          <Svg width={300 * w} height={75 * h}>
            <G scaleX={this.props.isPointingRight ? -1 : 1} originX={150 * w}>
              <G scale={3}>
                <Path
                  d={adjustPath('M0,25 C7,20 0,3 3,2 9,0 93,0 97,2 100,3 99,22 97,23 95,25 15,24 10,23 5,22 7,23 0,25 Z', 100, 25, w, h)}
                  fill={this.props.colors.backgroundColor}
                  stroke={this.props.colors.borderColor}
                  strokeWidth={0.5}
                />
              </G>
            </G>
          </Svg>
        </View>
        {this.props.children}
      </View>
    );
  }
}

function adjustPath(d: string, baseWidth: number, baseHeight: number, wScale: number, hScale: number) {
  // `M0,${25 * h} C7,${20 * h} -3,3 3,2 9,0 ${93 * w},0 ${98 * w},2 ${100 * w},3 ${100 * w},${17 * h} ${98 * w},${22 * h} ${95 * w},${25 * h} 18,${25 * h} 12,${23 * h} 5,${21 * h} 9,${23 * h} 0,${25 * h} Z`
  // const data = `M0,25 C7,20 -3,3 3,2 9,0 93,0 98,2 100,3 100,17 98,22 95,25 18,25 12,23 5,21 9,23 0,25 Z`;

  const wMin = baseWidth * 0.5;
  const wMax = baseWidth + 5;
  const hMin = baseHeight * 0.5;
  const hMax = baseHeight + 5;
  const wOffset = baseWidth * (1 - wScale);
  const hOffset = baseHeight * (1 - hScale);

  const final = d.replace(/(?:[0-9]+|\.[0-9]+|[0-9]+\.[0-9]+),/g, (x) => {
    const v = parseFloat(x.substr(0, x.length - 1));

    if (v > wMin && v < wMax) {
      return '' + (v - wOffset) + ',';
    }

    return '' + v + ',';
  }).replace(/,(?:[0-9]+|\.[0-9]+|[0-9]+\.[0-9]+)/g, (x) => {
    const v = parseFloat(x.substr(1, x.length - 1));

    if (v > hMin && v < hMax) {
      return ',' + (v - hOffset);
    }

    return ',' + v;
  });;

  // console.log('adjustPath RESULT',
  //   '\nwScale', wScale,
  //   '\nhScale', hScale,
  //   '\nd', d,
  //   '\nf', final,
  // );

  return final;
}

const styles = StyleSheet.create({
  svg: {
    position: 'relative',
    width: 0,
    height: 0,
  },
});

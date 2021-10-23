import React, { Component, useEffect, useRef, useState } from "react";
import {
  Animated,
  Image,
  PanResponder,
  PanResponderInstance,
  ScrollView,
  Text,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";



{
frameWidth: number;
frameHeight: number;
zoom: number;
offset_x: number;
offset_y: number;
isZooming: boolean;
isMoving: boolean;
initialZoom: number;
initialCenter_x: number;
initialCenter_y: number;
initialOffset_x: number;
initialOffset_y: number;
initialDistance: number;
initialX: number;
initialY: number;
}

const ZoomableImage = ({imageWidth: number;
  imageHeight: number;
  frameWidth: number;
  frameHeight: number;
  uri: string;
  })=> {
  constructor(props: any) {
    super(props);

    this._onLayout = this._onLayout.bind(this);

    const offset_x: number =
      this.props.imageWidth > this.props.imageHeight
        ? (this.props.imageHeight - this.props.imageWidth) / 2
        : 0;

    const offset_y: number =
      this.props.imageHeight > this.props.imageWidth
        ? (this.props.imageWidth - this.props.imageHeight) / 2
        : 0;

    // console.log("2", this.props.imageWidth, this.props.imageHeight);

    this.state = {
      frameWidth: this.props.frameWidth,
      frameHeight: this.props.frameHeight,
      zoom: 1,
      offset_x,
      offset_y,
      isMoving: false,
      isZooming: false,
      initialZoom: 1,
      initialCenter_x: 0,
      initialCenter_y: 0,
      initialOffset_x: offset_x,
      initialOffset_y: offset_y,
      initialDistance: 1,
      initialX: 0,
      initialY: 0,
    };
  }

  processPinch(
    coord1: { x: number; y: number },
    coord2: { x: number; y: number }
  ) {
    let distance = Math.sqrt(
      Math.pow(coord1.x - coord2.x, 2) + Math.pow(coord1.y - coord2.y, 2)
    );
    let center = { x: (coord1.x + coord2.x) / 2, y: (coord1.y + coord2.y) / 2 };
    console.log(this.state.offset_x);

    if (!this.state.isZooming) {
      this.setState({
        isZooming: true,
        initialZoom: this.state.zoom,
        initialOffset_x: this.state.offset_x,
        initialOffset_y: this.state.offset_y,
        initialCenter_x: center.x,
        initialCenter_y: center.y,
        initialDistance: distance,
      });
    } else {
      let touchZoom =
        (this.state.initialZoom * distance) / this.state.initialDistance;
      let zoom = touchZoom < 1 ? 1 : touchZoom;

      const offset_x =
        center.x -
        (this.state.initialCenter_x - this.state.initialOffset_x) *
          (zoom / this.state.initialZoom);

      const offset_y =
        center.y -
        (this.state.initialCenter_y - this.state.initialOffset_y) *
          (zoom / this.state.initialZoom);

      this.setState({
        zoom,
        offset_x:
          offset_x + this.props.imageWidth * zoom < this.props.frameWidth
            ? this.props.frameWidth - this.props.imageWidth * zoom
            : offset_x < 0
            ? offset_x
            : 0,
        offset_y:
          offset_y + this.props.imageHeight * zoom < this.props.frameHeight
            ? this.props.frameHeight - this.props.imageHeight * zoom
            : offset_y < 0
            ? offset_y
            : 0,
      });
    }
  }

  processTouch(coord: { x: number; y: number }) {
    if (!this.state.isMoving) {
      this.setState({
        isMoving: true,
        initialX: coord.x,
        initialY: coord.y,
        initialOffset_x: this.state.offset_x,
        initialOffset_y: this.state.offset_y,
      });
    } else {
      const offset_x =
        coord.x - (this.state.initialX - this.state.initialOffset_x);
      const offset_y =
        coord.y - (this.state.initialY - this.state.initialOffset_y);

      this.setState({
        offset_x:
          offset_x + this.props.imageWidth * this.state.zoom <
          this.props.frameWidth
            ? this.props.frameWidth - this.props.imageWidth * this.state.zoom
            : offset_x < 0
            ? offset_x
            : 0,
        offset_y:
          offset_y + this.props.imageHeight * this.state.zoom <
          this.props.frameHeight
            ? this.props.frameHeight - this.props.imageHeight * this.state.zoom
            : offset_y < 0
            ? offset_y
            : 0,
      });
    }
  }

  _onLayout(event: any) {
    let layout = event.nativeEvent.layout;
    console.log(layout);
    console.log("dshjbfjdsbfkj");
    // if (
    //   layout.width === this.state.width &&
    //   layout.height === this.state.height
    // ) {
    //   return;
    // }
    // let zoom = layout.width / this.props.imageWidth;
    // console.log(zoom, layout);
    // let offsetTop =
    //   layout.height > this.props.imageHeight * zoom
    //     ? (layout.height - this.props.imageHeight * zoom) / 2
    //     : 0;
    // this.setState({
    //   layoutKnown: true,
    //   width: layout.width,
    //   height: layout.height,
    //   // zoom: zoom,
    //   // offsetTop: offsetTop,
    //   minZoom: 0.5,
    // });
  }

  public _panResponder: PanResponderInstance = PanResponder.create({
    onStartShouldSetPanResponder: (evt, gestureState) => true,
    onStartShouldSetPanResponderCapture: (evt, gestureState) => true,
    onMoveShouldSetPanResponder: (evt, gestureState) => true,
    onMoveShouldSetPanResponderCapture: (evt, gestureState) => true,
    onPanResponderMove: (evt, gestureState) => {
      let touches = evt.nativeEvent.touches;
      if (touches.length == 2) {
        this.processPinch(
          { x: touches[0].pageX, y: touches[0].pageY },
          { x: touches[1].pageX, y: touches[1].pageY }
        );
      } else if (touches.length == 1) {
        if (this.state.isZooming) {
          this.setState({
            isZooming: false,
          });
        }
        this.processTouch({ x: touches[0].pageX, y: touches[0].pageY });
      }
    },

    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      this.setState({
        isZooming: false,
        isMoving: false,
      });
    },
    onShouldBlockNativeResponder: (evt, gestureState) => true,
  });



    return (
      <View
        style={{
          width: this.props.frameWidth,
          height: this.props.frameHeight,
          backgroundColor: "#e0f0f0",
        }}
        {...this._panResponder.panHandlers}
        onLayout={this._onLayout}
      >
        <Image
          style={{
            position: "absolute",
            left: this.state.offset_x,
            top: this.state.offset_y,
            width: this.props.imageWidth * this.state.zoom,
            height: this.props.imageHeight * this.state.zoom,
          }}
          source={{
            uri: this.props.uri,
          }}
        />
      </View>
    );

}

const Market = ({ navigation }: { navigation: any }) => {
  const [size, setSize] = useState<{ width: number; height: number }>();
  useEffect(() => {
    Image.getSize(
      "https://www.surfcanarias.com/wp-content/uploads/2020/05/Surfing-Equipment-scaled.jpg",
      (img_w, img_h) => {
        if (img_w > img_h) {
          setSize({
            width: (img_w / img_h) * pixelScaler(315),
            height: pixelScaler(315),
          });
        } else {
          setSize({
            width: pixelScaler(315),
            height: (img_h / img_w) * pixelScaler(315),
          });
        }
      }
    );
  }, []);
  return (
    <ZoomableImage
      imageHeight={size.height}
      imageWidth={size.width}
      frameWidth={pixelScaler(315)}
      frameHeight={pixelScaler(315)}
      uri="https://www.surfcanarias.com/wp-content/uploads/2020/05/Surfing-Equipment-scaled.jpg"
    />
  );
};

export default Market;

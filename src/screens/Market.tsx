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
import { ZoomableImage } from "../components/ImagePicker/ZoomableImageComponent";
import { pixelScaler } from "../utils";

class ZoomableImagea extends Component<
  {
    imageWidth: number;
    imageHeight: number;
    frameWidth: number;
    frameHeight: number;
    uri: string;
  },
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
> {
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
      isMoving: false,
      isZooming: false,
      frameWidth: this.props.frameWidth,
      frameHeight: this.props.frameHeight,
      zoom: 1,
      initialZoom: 1,
      offset_x,
      offset_y,
      initialCenter_x: 0,
      initialCenter_y: 0,
      initialOffset_x: offset_x,
      initialOffset_y: offset_y,
      initialDistance: 1,
    };
  }

  processPinch(x1, y1, x2, y2) {
    let distance = Math.sqrt(Math.pow(x1 - x2, 2) + Math.pow(y1 - y2, 2));
    let center = { x: (x1 + y1) / 2, y: (x2 + y2) / 2 };
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

  processTouch(x, y) {
    if (!this.state.isMoving) {
      this.setState({
        isMoving: true,
        initialX: x,
        initialY: y,
        initialOffset_x: this.state.offset_x,
        initialOffset_y: this.state.offset_y,
      });
    } else {
      const offset_x = x - (this.state.initialX - this.state.initialOffset_x);
      const offset_y = y - (this.state.initialY - this.state.initialOffset_y);

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

  _onLayout(event) {
    // let layout = event.nativeEvent.layout;
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
    onPanResponderGrant: (evt, gestureState) => {},
    onPanResponderMove: (evt, gestureState) => {
      // console.log()
      // console.log(this.state);
      let touches = evt.nativeEvent.touches;
      if (touches.length == 2) {
        let touch1 = touches[0];
        let touch2 = touches[1];
        // console.log(touch1, touch2);

        this.processPinch(
          touches[0].pageX,
          touches[0].pageY,
          touches[1].pageX,
          touches[1].pageY
        );
      } else if (touches.length == 1) {
        if (this.state.isZooming) {
          this.setState({
            isZooming: false,
          });
        }
        this.processTouch(touches[0].pageX, touches[0].pageY);
      }
    },

    onPanResponderTerminationRequest: (evt, gestureState) => true,
    onPanResponderRelease: (evt, gestureState) => {
      this.setState({
        isZooming: false,
        isMoving: false,
      });
    },
    onPanResponderTerminate: (evt, gestureState) => {},
    onShouldBlockNativeResponder: (evt, gestureState) => true,
  });

  componentWillMount() {}

  render() {
    // console.log(this.props, this.state);
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
          // imageWidth={}
        />
      </View>
    );
  }
}

const Market = ({ navigation }: { navigation: any }) => {
  const [size, setSize] = useState<{ width: number; height: number }>();
  useEffect(() => {
    Image.getSize(
      "https://www.surfcanarias.com/wp-content/uploads/2020/05/Surfing-Equipment-scaled.jpg",
      (img_w, img_h) => {
        if (img_w > img_h) {
          // console.log("1@@@@", {
          //   width: (img_w / img_h) * pixelScaler(315),
          //   height: pixelScaler(315),
          // });
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
    <View style={{ alignItems: "center", justifyContent: "center" }}>
      <ScrollView
        style={{
          borderRadius: pixelScaler(15),
          width: pixelScaler(315),
          height: pixelScaler(315),
        }}
        scrollEnabled={false}
      >
        {size && (
          <ZoomableImage
            imageHeight={size.height}
            imageWidth={size.width}
            frameWidth={pixelScaler(315)}
            frameHeight={pixelScaler(315)}
            uri="https://www.surfcanarias.com/wp-content/uploads/2020/05/Surfing-Equipment-scaled.jpg"
          />
        )}
      </ScrollView>
    </View>
  );
};

export default Market;

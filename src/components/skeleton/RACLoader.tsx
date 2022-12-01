import React from "react"
import ContentLoader, { Rect, Circle, Path } from "react-content-loader/native"
import {Dimensions} from "react-native";

const deviceWidth = Dimensions.get('window').width

const getHeight = (size: string) => {
  switch(size) {
    case 'sm':
      return 124
    case 'm':
      return 248
    case 'xl':
      return 400
    default:
      return 124
  }
}

const RACLoader = (props) => (
  <ContentLoader
    speed={2}
    width={deviceWidth - 50}
    height={getHeight(props.size)}
    viewBox={`0 0 476 ${getHeight(props.size)}`}
    backgroundColor="#f3f3f3"
    foregroundColor="#ecebeb"
    style={{ alignSelf: 'center', paddingLeft: 50 }}
    {...props}
  >
    {props.size === 'sm' &&
      <>
        <Rect x="48" y="8" rx="3" ry="3" width="88" height="6" />
        <Rect x="48" y="26" rx="3" ry="3" width="52" height="6" />
        <Rect x="0" y="56" rx="3" ry="3" width="410" height="6" />
        <Rect x="0" y="72" rx="3" ry="3" width="380" height="6" />
        <Rect x="0" y="88" rx="3" ry="3" width="178" height="6" />
        <Circle cx="20" cy="20" r="20" />
      </>}
    {props.size === 'm' && <>
      <Circle cx="31" cy="31" r="15" />
      <Rect x="58" y="18" rx="2" ry="2" width={deviceWidth} height="10" />
      <Rect x="58" y="34" rx="2" ry="2" width={deviceWidth} height="10" />
      <Rect x="0" y="60" rx="2" ry="2" width={deviceWidth} height="400" />
    </>}
    {props.size === 'xl' && <>
      <Circle cx="10" cy="20" r="8" />
      <Rect x="25" y="15" rx="5" ry="5" width={deviceWidth} height="10" />
      <Circle cx="10" cy="50" r="8" />
      <Rect x="25" y="45" rx="5" ry="5" width={deviceWidth} height="10" />
      <Circle cx="10" cy="80" r="8" />
      <Rect x="25" y="75" rx="5" ry="5" width={deviceWidth} height="10" />
      <Circle cx="10" cy="110" r="8" />
      <Rect x="25" y="105" rx="5" ry="5" width={deviceWidth} height="10" />
    </>}
  </ContentLoader>
)

export default RACLoader

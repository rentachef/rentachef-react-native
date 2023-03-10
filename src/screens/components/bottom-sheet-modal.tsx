import React, {useCallback, useEffect, useMemo, useRef} from 'react';
import {View, StyleSheet, Text, BackHandler} from 'react-native';
import BottomSheet, {
  BottomSheetModal,
  BottomSheetModalProvider, BottomSheetView,
} from '@gorhom/bottom-sheet';
import Button from "../../components/buttons/Button";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //maxHeight: 200,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: 'white',
    borderWidth: 1
  },
  contentContainer: {
    flex: 1,
    alignItems: 'center',
  },
});

RACBottomSheet.defaultProps = {
  size: '60%'
};

export function RACBottomSheet(props: {
  index: any;
  size?: string,
  children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | (() => React.ReactNode) | React.ReactNode[] | null | undefined;
  onSheetChanges(index: any): void;
  onClose(): void;
  enableSwipeClose?: boolean;
  handleSheetClose(): void;
}) {
  // hooks
  const sheetRef = useRef<BottomSheet>(null);

  useEffect(() => {
    const backAction = () => {
      sheetRef.current?.close();
      props.onClose();
      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  // variables
  const snapPoints = useMemo(() => [props.size, props.size, props.size, props.size], []);

  // callbacks
  const handleSheetChange = useCallback((index) => {
    console.log("handleSheetChange", index);
  }, []);
  const handleSnapPress = useCallback((index) => {
    sheetRef.current?.snapToIndex(index);
  }, []);
  const handleClosePress = useCallback(() => {
    sheetRef.current?.close();
  }, []);
  // @ts-ignore
  return (
    <BottomSheet
      ref={sheetRef}
      enablePanDownToClose={props.enableSwipeClose}
      index={props.index}
      snapPoints={snapPoints}
      onChange={handleSheetChange}
      onClose={() => props.onClose()}
    >
      {props.children}
    </BottomSheet>
  )
}

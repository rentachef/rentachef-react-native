import React, {useCallback, useMemo, useRef} from 'react';
import {View, StyleSheet, Text} from 'react-native';
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

export function RACBottomSheet(props: {
  index: any;
  children: boolean | React.ReactChild | React.ReactFragment | React.ReactPortal | (() => React.ReactNode) | React.ReactNode[] | null | undefined;
  onSheetChanges(index: any): void;
}) {
// hooks
  const sheetRef = useRef<BottomSheet>(null);

  // variables
  const snapPoints = useMemo(() => ["25%", "50%", "90%"], []);

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
      index={props.index}
      snapPoints={snapPoints}
      onChange={handleSheetChange}
      children={props.children}
    >
      {/*<View style={styles.container}>
        <Button
          onPress={handlePresentModalPress}
          title="Present Modal"
          color="black"
        />

      </View>*/}

    </BottomSheet>
  )
}

import React, {useCallback, useMemo, useRef} from 'react';
import {View, StyleSheet} from 'react-native';
import {
  BottomSheetModal,
  BottomSheetModalProvider,
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
  // ref
  const bottomSheetModalRef = useRef<BottomSheetModal>(null);

  // variables
  const snapPoints = useMemo(() => ['25%', '50%'], []);

  // callbacks
  const handlePresentModalPress = useCallback(() => {
    bottomSheetModalRef.current?.present();
  }, []);

  const handleSheetChanges = useCallback((index: number) => {
    console.log('handleSheetChanges', index);
    props.onSheetChanges(index)
  }, []);
  //console.log("props.index", props.index, "bottomSheetModalRef.current", bottomSheetModalRef.current)
  bottomSheetModalRef.current?.present();
  return (
    <BottomSheetModalProvider>
      {/*<View style={styles.container}>
        <Button
          onPress={handlePresentModalPress}
          title="Present Modal"
          color="black"
        />

      </View>*/}
      <BottomSheetModal
        ref={bottomSheetModalRef}
        index={props.index}
        snapPoints={snapPoints}
        onChange={handleSheetChanges}
        enableDismissOnClose={true}
      >
        {props.children}
      </BottomSheetModal>
    </BottomSheetModalProvider>
  )
}

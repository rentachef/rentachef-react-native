import {StyleSheet} from "react-native";
import Colors from "./colors";

const globalStyles = StyleSheet.create({
  screenContainer: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    padding: 20
  },
  screenSubContainer: {
    flexGrow: 1,
    backgroundColor: Colors.background
  },
  screenContainerJustBetween: {
    flexGrow: 1,
    backgroundColor: Colors.background,
    justifyContent: 'space-between',
    padding: 20
  },
  buttonContainer: {
    width: '100%',
    bottom: 0,
    backgroundColor: Colors.background,
    alignSelf: 'flex-end'
  },
  btnGroupContainer: {
    height: 40,
    borderRadius: 10,
    marginHorizontal: 0
  },
  btnGroupSelectedBtn: {
    backgroundColor: Colors.primary,
    borderWidth: 2,
    borderRadius: 10,
    borderColor: Colors.disabled,
  },
  btnGroupText: {
    color: Colors.secondaryText,
    fontWeight: 'bold',
    fontSize: 14
  },
  imageGrid: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
    flexWrap: 'wrap'
  },
  imageGridItem: {
    margin: 5,
    padding: 2,
    borderWidth: 1,
    borderRadius: 6,
    minHeight: 64,
    minWidth: 64,
    borderColor: Colors.placeholderColor
  },
  inputGroupItem: {
    marginVertical: 10,
    paddingHorizontal: 10,
    borderColor: Colors.backgroundDark,
    borderWidth: 2,
    borderRadius: 12,
    textAlign: 'left',
    color: 'black',
  }
})

export default globalStyles

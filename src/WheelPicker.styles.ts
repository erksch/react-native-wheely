import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    position: 'relative',
  },
  selectedIndicator: {
    position: 'absolute',
    width: '100%',
    backgroundColor: 'hsl(200, 8%, 94%)',
    borderRadius: 5,
  },
  scrollView: {
    overflow: 'hidden',
  },
  option: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    zIndex: 100,
  },
});
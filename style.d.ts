import 'react-native';

declare module 'react-native' {
  namespace StyleSheet {
    type Style = ViewStyle | TextStyle | ImageStyle;
    type NameStyles<T> = {[P in keyof T]: Style};

    /**
     * Creates a StyleSheet style reference from the given object.
     */
    export function create<T, S extends NameStyles<S> | NameStyles<any>>(
      styles: T | NameStyles<S>,
    ): T & S;
  }
}

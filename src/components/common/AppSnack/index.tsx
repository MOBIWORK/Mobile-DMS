import React, {
    createRef,
    forwardRef,
    memo,
    useCallback,
    useImperativeHandle,
    useState,
  } from 'react';
 
  import {StyleSheet, View} from 'react-native';
  import {useSafeAreaInsets} from 'react-native-safe-area-context';
import { Item, SnackBarProps,TypeMessage } from '../type';
import { DURATION_HIDE } from '../../../const/app.const';
import { SnackItem } from './Snackitem';
import { snackStyle as styles } from '../style';

  
  const SnackBarComponent = forwardRef((props: SnackBarProps, ref) => {
    useImperativeHandle(
      ref,
      () => ({
        show: ({
          interval = DURATION_HIDE,
          msg,
          type = 'success',
        }: {
          msg: string;
          interval: number;
          type: TypeMessage;
        }) => {
          setData(d =>
            d.concat([
              {
                id: new Date().getTime(),
                msg,
                type,
                interval,
              },
            ]),
          );
        },
      }),
      [],
    );
  
    // state
    const [data, setData] = useState<Item[]>([]);
    const inset = useSafeAreaInsets();
    // function
    const onPop = useCallback((item: Item) => {
      setData(d => d.filter(x => x.id !== item.id));
    }, []);
  
    const renderItem = useCallback(
      (item: Item) => <SnackItem key={item.id} {...{item, onPop}} {...props} />,
      [onPop, props],
    );
  
    // render
    return (
      <View
        pointerEvents={'box-none'}
        style={[
          StyleSheet.absoluteFillObject,
          styles.container,
          {marginTop: inset.top},
        ]}>
        {data.map(renderItem)}
      </View>
    );
  });
  type SnackBar = {
    show: (data: {msg: string; interval?: number; type?: TypeMessage}) => void;
  };
  export const snackBarRef = createRef<SnackBar>();
  export const SnackBar = memo(
    () => <SnackBarComponent ref={snackBarRef} />,
    
  );
  
  export const showSnack = ({
    msg,
    interval,
    type,
  }: {
    msg: string | any;
    interval?: number;
    type?: TypeMessage;
  }) => {
    snackBarRef.current?.show({msg, interval, type});
  };
  
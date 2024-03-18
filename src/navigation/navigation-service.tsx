import { CommonActions, NavigationAction, NavigationContainerRef, StackActions } from "@react-navigation/native";
import { createRef } from "react";
import { RootStackParamList } from ".";

export const navigationRef =
  createRef<NavigationContainerRef<RootStackParamList>>();

export function navigate<RouteName extends keyof RootStackParamList>(
  ...arg: undefined extends RootStackParamList[RouteName]
    ?
        | [screen: RouteName]
        | [screen: RouteName, params?: RootStackParamList[RouteName]]
    : [screen: RouteName, params?: RootStackParamList[RouteName]]
) {
  if (navigationRef.current?.isReady()) {
    navigationRef.current?.navigate(
      arg[0] as any,
      arg.length > 1 ? arg[1] : undefined,
    );
  }
}
export function goBack() {
  navigationRef.current?.dispatch(CommonActions.goBack);
}

export function pop(screenCount: number) {
  navigationRef?.current?.dispatch(StackActions.pop(screenCount));
}

export function dispatch(action: NavigationAction) {
  navigationRef.current?.dispatch(action);
}
export function popToTop() {
  navigationRef.current?.dispatch(StackActions.popToTop());
}
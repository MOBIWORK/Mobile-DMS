
#import "AppDelegate.h"
#import <AppCenterReactNative.h>
#import <AppCenterReactNativeAnalytics.h>
#import <AppCenterReactNativeCrashes.h>
#import <CodePush/CodePush.h>
<<<<<<< HEAD
#import <MMKV/MMKV.h>
=======
>>>>>>> ad41f6d (config: codePush)

#import <React/RCTBundleURLProvider.h>

#import <TSBackgroundFetch/TSBackgroundFetch.h>

#import <React/RCTBundleURLProvider.h>
#import <React/RCTLinkingManager.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  self.moduleName = @"DMS";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
   // [REQUIRED] Register BackgroundFetch
   [[TSBackgroundFetch sharedInstance] didFinishLaunching];
  //  #ifdef FB_SONARKIT_ENABLED
  // InitializeFlipper(application);
   [AppCenterReactNative register];
   [AppCenterReactNativeAnalytics registerWithInitiallyEnabled:true];
   [AppCenterReactNativeCrashes registerWithAutomaticProcessing];
<<<<<<< HEAD
    [MMKV initializeMMKV:nil];

=======
>>>>>>> ad41f6d (config: codePush)
// #endif

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@".expo/.virtual-metro-entry"];
#else
  return [CodePush bundleURL];
#endif
}

// Linking API
- (BOOL)application:(UIApplication *)application openURL:(NSURL *)url options:(NSDictionary<UIApplicationOpenURLOptionsKey,id> *)options {
  return [super application:application openURL:url options:options] || [RCTLinkingManager application:application openURL:url options:options];
}

// Universal Links
- (BOOL)application:(UIApplication *)application continueUserActivity:(nonnull NSUserActivity *)userActivity restorationHandler:(nonnull void (^)(NSArray<id<UIUserActivityRestoring>> * _Nullable))restorationHandler {
  BOOL result = [RCTLinkingManager application:application continueUserActivity:userActivity restorationHandler:restorationHandler];
  return [super application:application continueUserActivity:userActivity restorationHandler:restorationHandler] || result;
}


@end

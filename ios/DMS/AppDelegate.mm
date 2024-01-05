
#import "AppDelegate.h"
#import <AppCenterReactNative.h>
#import <AppCenterReactNativeAnalytics.h>
#import <AppCenterReactNativeCrashes.h>
#import <CodePush/CodePush.h>

#import <React/RCTBundleURLProvider.h>

#import <TSBackgroundFetch/TSBackgroundFetch.h>

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

@end
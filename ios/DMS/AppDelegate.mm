#import "AppDelegate.h"
#import <React/RCTBundleURLProvider.h>

#import <TSBackgroundFetch/TSBackgroundFetch.h>
#import <GoogleMaps/GoogleMaps.h>

@implementation AppDelegate

- (BOOL)application:(UIApplication *)application didFinishLaunchingWithOptions:(NSDictionary *)launchOptions
{
  [GMSServices provideAPIKey:@"AIzaSyD7wudnhwE2hOpibBPNq7LPHqLPkdp6WvU"]; // add this line using the api key obtained from Google Console
  self.moduleName = @"DMS";
  // You can add your custom initial props in the dictionary below.
  // They will be passed down to the ViewController used by React Native.
  self.initialProps = @{};
  
   // [REQUIRED] Register BackgroundFetch
   [[TSBackgroundFetch sharedInstance] didFinishLaunching];

  return [super application:application didFinishLaunchingWithOptions:launchOptions];
}

- (NSURL *)sourceURLForBridge:(RCTBridge *)bridge
{
#if DEBUG
  return [[RCTBundleURLProvider sharedSettings] jsBundleURLForBundleRoot:@".expo/.virtual-metro-entry"];
#else
  return [[NSBundle mainBundle] URLForResource:@"main" withExtension:@"jsbundle"];
#endif
}

@end

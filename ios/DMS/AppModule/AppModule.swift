//
//  AppModule.swift
//  DMS
//

import Foundation
import IQKeyboardManagerSwift
import React
import UIKit

@objc(AppModule)
// Use this to listen photo change
// class AppModule: RCTEventEmitter, PHPhotoLibraryChangeObserver
class AppModule: RCTEventEmitter {
  private static var DefaultStringReturnType: String = "Unknown"
  private var mmkvStorage: MMKVStorage
  
  override init() {
    mmkvStorage = MMKVStorage()
    super.init()
    
  }
  @objc override static func requiresMainQueueSetup() -> Bool {
    return true
  }
  override func supportedEvents() -> [String]! {
    return []
  }

  @objc
  func getDeviceId() -> String {
    return UIDevice.current.identifierForVendor?.uuidString ?? AppModule.DefaultStringReturnType
  }
  
  @objc
  func getAppName() -> String {
    let displayName = Bundle.main.infoDictionary?["CFBundleDisplayName"]
    let bundleName = Bundle.main.infoDictionary?["CFBundleName"]
    return (displayName != nil) ? displayName as! String : bundleName as! String
  }
  
  @objc
  func getVersion() -> String {
    let appVerison = Bundle.main.infoDictionary?["CFBundleShortVersionString"]
    return (appVerison ?? AppModule.DefaultStringReturnType) as! String
  }
  
  @objc
  func getBuildNumber() -> String {
    let buildNumber = Bundle.main.infoDictionary?["CFBundleVersion"]
    return (buildNumber ?? AppModule.DefaultStringReturnType) as! String
  }  
  @objc
  func clearCache() {
    let cacheURL = FileManager.default.urls(for: .cachesDirectory, in: .userDomainMask).first!
    let fileManager = FileManager.default
    do {
      // Get the directory contents urls (including subfolders urls)
      let directoryContents = try FileManager.default.contentsOfDirectory(
        at: cacheURL, includingPropertiesForKeys: nil, options: [])
      for file in directoryContents {
        do {
          try fileManager.removeItem(at: file)
        } catch let error as NSError {
          debugPrint("Ooops! Something went wrong: \(error)")
        }
      }
    } catch let error as NSError {
      print(error.localizedDescription)
    }
  }
  
  @objc
  func setBadges(_ count: Double) {
    UNUserNotificationCenter.current().requestAuthorization(options: .badge) {
      (granted, error) in
      if granted {
        DispatchQueue.main.async {
          let countBadges = Int(count)
          UIApplication.shared.applicationIconBadgeNumber = countBadges
        }
      }
    }
  }

  
  
  @objc
  func mmkvSetString(
    _ keyName: String, value: String, keyId: String?, cryptKey: String?,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    mmkvStorage.setValue(keyName, value, keyId, cryptKey)
    resolve(true)
  }
  @objc
  func mmkvSetNumber(
    _ keyName: String, value: Double, keyId: String?, cryptKey: String?,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    mmkvStorage.setValue(keyName, value, keyId, cryptKey)
    resolve(true)
  }
  @objc
  func mmkvSetBoolean(
    _ keyName: String, value: Bool, keyId: String?, cryptKey: String?,
    resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    mmkvStorage.setValue(keyName, value, keyId, cryptKey)
    resolve(true)
  }
  
  @objc
  func mmkvGetString(
    _ keyName: String, keyId: String?, cryptKey: String?, resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    let result = mmkvStorage.getString(keyName, keyId, cryptKey)
    resolve(result)
  }
  
  @objc
  func mmkvGetNumber(
    _ keyName: String, keyId: String?, cryptKey: String?, resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    let result = mmkvStorage.getDouble(keyName, keyId, cryptKey)
    resolve(result)
  }
  
  @objc
  func mmkvGetBoolean(
    _ keyName: String, keyId: String?, cryptKey: String?, resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    let result = mmkvStorage.getBoolean(keyName, keyId, cryptKey)
    resolve(result)
  }
  
  @objc
  func mmkvDelete(
    _ keyName: String, keyId: String?, cryptKey: String?, resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    mmkvStorage.delete(keyName, keyId, cryptKey)
    resolve(true)
  }
  
  @objc
  func mmkvGetAllKeys(
    _  keyId: String?, cryptKey: String?, resolver resolve: RCTPromiseResolveBlock,
    rejecter reject: RCTPromiseRejectBlock
  ) {
    let listKeys = mmkvStorage.getAllKeys(keyId, cryptKey)
    let result = NSArray(array: listKeys)
    resolve(result)
  }
  
  @objc
  func mmkvClearAll(_ keyId: String?, cryptKey: String?, resolver resolve: RCTPromiseResolveBlock,
                    rejecter reject: RCTPromiseRejectBlock
  ) {
    mmkvStorage.clearAll( keyId, cryptKey)
    resolve(true)
  }
  
  @objc
  func setIQKeyboardOption(
    _ options: NSDictionary
  ) {
    DispatchQueue.main.async {
    if let enable = options["enable"] as? Bool {
      IQKeyboardManager.shared.enable = true
    }
      
    if let layoutIfNeededOnUpdate = options["layoutIfNeededOnUpdate"] as? Bool {
        IQKeyboardManager.shared.layoutIfNeededOnUpdate = layoutIfNeededOnUpdate
    }
     
    if let enableDebugging = options["enableDebugging"] as? Bool {
      IQKeyboardManager.shared.enableDebugging = enableDebugging
    }

    if let keyboardDistanceFromTextField = options["keyboardDistanceFromTextField"] as? Float {
      IQKeyboardManager.shared.keyboardDistanceFromTextField = CGFloat(
        keyboardDistanceFromTextField)
    }

    if let enableAutoToolbar = options["enableAutoToolbar"] as? Bool {
      IQKeyboardManager.shared.enableAutoToolbar = enableAutoToolbar
    }
    
    if let toolbarDoneBarButtonItemText = options["toolbarDoneBarButtonItemText"] as? String {
      IQKeyboardManager.shared.toolbarConfiguration.doneBarButtonConfiguration.title = toolbarDoneBarButtonItemText
    }
    
    if let toolbarManageBehaviourBy = options["toolbarManageBehaviourBy"] as? String {
      switch toolbarManageBehaviourBy {
      case "subviews":
        IQKeyboardManager.shared.toolbarConfiguration.manageBehavior = .bySubviews
      case "tag":
        IQKeyboardManager.shared.toolbarConfiguration.manageBehavior = .byTag
      case "position":
        IQKeyboardManager.shared.toolbarConfiguration.manageBehavior = .byPosition
      default:
        print("\(toolbarManageBehaviourBy) is not supported")
        break
      }
    }
    
    if let toolbarPreviousNextButtonEnable = options["toolbarPreviousNextButtonEnable"] as? Bool {
      if toolbarPreviousNextButtonEnable {
        IQKeyboardManager.shared.toolbarPreviousNextAllowedClasses.append(RCTRootView.self)
      } else {
        if let index = IQKeyboardManager.shared.toolbarPreviousNextAllowedClasses.firstIndex(
          where: { element in
            return element == RCTRootView.self
          })
        {
          IQKeyboardManager.shared.toolbarPreviousNextAllowedClasses.remove(at: index)
        }
      }
    }
    
    if let toolbarTintColor = options["toolbarTintColor"] as? String {
      IQKeyboardManager.shared.toolbarConfiguration.tintColor = UIColor(hex: toolbarTintColor)
    }
    
    if let toolbarBarTintColor = options["toolbarBarTintColor"] as? String {
      IQKeyboardManager.shared.toolbarConfiguration.tintColor = UIColor(hex: toolbarBarTintColor)
    }
    
    if let shouldShowToolbarPlaceholder = options["shouldShowToolbarPlaceholder"] as? Bool {
      IQKeyboardManager.shared.toolbarConfiguration.placeholderConfiguration.showPlaceholder = shouldShowToolbarPlaceholder
    }
    
    if let overrideKeyboardAppearance = options["overrideKeyboardAppearance"] as? Bool {
      IQKeyboardManager.shared.keyboardConfiguration.overrideAppearance = overrideKeyboardAppearance
    }
    
    if let keyboardAppearance = options["keyboardAppearance"] as? String {
      switch keyboardAppearance {
      case "default":
        IQKeyboardManager.shared.keyboardConfiguration.appearance = .default
      case "light":
        IQKeyboardManager.shared.keyboardConfiguration.appearance = .light
      case "dark":
        IQKeyboardManager.shared.keyboardConfiguration.appearance = .dark
      default:
        print("\(keyboardAppearance) is not supported")
        break
      }
    }
    
    if let shouldResignOnTouchOutside = options["shouldResignOnTouchOutside"] as? Bool {
      IQKeyboardManager.shared.shouldResignOnTouchOutside = shouldResignOnTouchOutside
    }
    
    if let shouldPlayInputClicks = options["shouldPlayInputClicks"] as? Bool {
      IQKeyboardManager.shared.shouldPlayInputClicks = shouldPlayInputClicks
    }
    
    if let resignFirstResponder = options["resignFirstResponder"] as? Bool {
      if resignFirstResponder {
        IQKeyboardManager.shared.resignFirstResponder()
      }
    }
    
    if let reloadLayoutIfNeeded = options["reloadLayoutIfNeeded"] as? Bool {
      if reloadLayoutIfNeeded {
        IQKeyboardManager.shared.reloadLayoutIfNeeded()
      }
    }
    }
  }

  @objc
  func setEnableIQKeyboard(
    _ enable: Bool
  ) {
    DispatchQueue.main.async {
      if(enable){
        IQKeyboardManager.shared.layoutIfNeededOnUpdate = true
      }
      IQKeyboardManager.shared.enable = true
    }

  }
}
extension UIColor {
  public convenience init?(hex: String) {
    let r: CGFloat
    let g: CGFloat
    let b: CGFloat
    let a: CGFloat

    if hex.hasPrefix("#") {
      let start = hex.index(hex.startIndex, offsetBy: 1)
      let hexColor = String(hex[start...])

      if hexColor.count == 8 {
        let scanner = Scanner(string: hexColor)
        var hexNumber: UInt64 = 0

        if scanner.scanHexInt64(&hexNumber) {
          r = CGFloat((hexNumber & 0xff00_0000) >> 24) / 255
          g = CGFloat((hexNumber & 0x00ff_0000) >> 16) / 255
          b = CGFloat((hexNumber & 0x0000_ff00) >> 8) / 255
          a = CGFloat(hexNumber & 0x0000_00ff) / 255

          self.init(red: r, green: g, blue: b, alpha: a)
          return
        }
      }
    }

    return nil
  }
}

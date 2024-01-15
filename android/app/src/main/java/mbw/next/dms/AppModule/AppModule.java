package mbw.next.dms.AppModule;


import android.app.NotificationChannel;
import android.os.AsyncTask;
import android.os.Build;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Callback;
import com.facebook.react.bridge.GuardedAsyncTask;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableArray;
import mbw.next.dms.AppModule.deviceInfo.DeviceInfo;
import mbw.next.dms.AppModule.fileHelper.FileManager;
import mbw.next.dms.AppModule.storage.MMKVStorage;

public class AppModule extends ReactContextBaseJavaModule {
    private final ReactApplicationContext reactContext;
    private DeviceInfo mDeviceInfo;
    private MMKVStorage mmkvStorage;
    private FileManager mFileManager;

    public AppModule(ReactApplicationContext context) {
        super(context);
        this.reactContext = context;
        mDeviceInfo = new DeviceInfo(reactContext);
        mmkvStorage = new MMKVStorage(reactContext);
        mFileManager = new FileManager(reactContext);
    }

    @NonNull
    @Override
    public String getName() {
        return "AppModule";
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getVersion() {
        return mDeviceInfo.getAppVersion();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getBuildNumber() {
        return mDeviceInfo.getBuildNumber();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getAppName() {
        return mDeviceInfo.getAppName();
    }

    @ReactMethod(isBlockingSynchronousMethod = true)
    public String getDeviceId() {
        return mDeviceInfo.getDeviceId();
    }

    @ReactMethod
    public void clearCache() {
        mFileManager.clearCache();
    }




    @ReactMethod
    public void mmkvSetString(String keyName, String value, String keyId, String cryptKey, Promise promise) {
        mmkvStorage.setValue(keyName, value, keyId, cryptKey);
        promise.resolve(true);
    }

    @ReactMethod
    public void mmkvSetNumber(String keyName, double value, String keyId, String cryptKey, Promise promise) {
        mmkvStorage.setValue(keyName, value, keyId, cryptKey);
        promise.resolve(true);
    }

    @ReactMethod
    public void mmkvSetBoolean(String keyName, boolean value, String keyId, String cryptKey, Promise promise) {
        mmkvStorage.setValue(keyName, value, keyId, cryptKey);
        promise.resolve(true);
    }

    @ReactMethod
    public void mmkvGetString(String keyName, String keyId, String cryptKey, Promise promise) {
        String res = mmkvStorage.getString(keyName, keyId, cryptKey);
        promise.resolve(res);
    }

    @ReactMethod
    public void mmkvGetNumber(String keyName, String keyId, String cryptKey, Promise promise) {
        double res = mmkvStorage.getDouble(keyName, keyId, cryptKey);
        promise.resolve(res);
    }

    @ReactMethod
    public void mmkvGetBoolean(String keyName, String keyId, String cryptKey, Promise promise) {
        boolean res = mmkvStorage.getSBoolean(keyName, keyId, cryptKey);
        promise.resolve(res);
    }

    @ReactMethod
    public void mmkvGetAllKeys(String keyId, String cryptKey, Promise promise) {
        String[] listKeys = mmkvStorage.getAllKeys(keyId, cryptKey);

        WritableArray promiseArray = Arguments.createArray();
        if (listKeys == null) {
            promise.resolve(promiseArray);
            return;
        }
        for (int i = 0; i < listKeys.length; i++) {
            promiseArray.pushString(listKeys[i]);
        }
        promise.resolve(promiseArray);
    }

    @ReactMethod
    public void mmkvDelete(String keyName, String keyId, String cryptKey, Promise promise) {
        mmkvStorage.delete(keyName, keyId, cryptKey);
        promise.resolve(true);
    }

    @ReactMethod
    public void mmkvClearAll(String keyId, String cryptKey, Promise promise) {
        mmkvStorage.clearAll(keyId, cryptKey);
        promise.resolve(true);
    }
}

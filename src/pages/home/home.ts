import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
// import { AndroidPermissions } from '@ionic-native/android-permissions';
import { Diagnostic } from '@ionic-native/diagnostic';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { Platform } from 'ionic-angular';
import * as getUserMedia from 'get-user-media-promise';

declare var navigator: any;
declare var cordova: any;
declare var window: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  constructor(
    public navCtrl: NavController,
    // private androidPermissions: AndroidPermissions,
    private diagnostic: Diagnostic,
    private inAppBrowser: InAppBrowser,
    private platform: Platform
  ) { }

  ionViewDidLoad() {
    // this.startVideoStream();

    this.platform.ready().then(() => {
      this.diagnostic.isCameraAvailable().then((status) => {
        console.log("Is camera available", status);

        if (status) {
          this.requestMicrophoneAndStartStream();
        } else {
          this.diagnostic.requestCameraAuthorization().then((status) => {
            console.log('requestCameraAuthorization:', status);
            this.requestMicrophoneAndStartStream();
          });
        }
      }).catch((er) => {
        console.log("Is camera available error", er);
      });
    });

    // this.androidPermissions.requestPermission(this.androidPermissions.PERMISSION.CAMERA).then((res) => {
    //   console.log("Permissions response:", res);
    //   this.startVideoStream();
    // }).catch((er) => {
    //   console.log("Permissions error:", er);
    // });
  }

  private requestMicrophoneAndStartStream() {
    this.diagnostic.isMicrophoneAuthorized().then((status) => {
      console.log('Is microphone available:', status);

      if (status) {
        this.startVideoStream();
      } else {
        this.diagnostic.requestMicrophoneAuthorization().then((status) => {
          console.log('requestMicrophoneAuthorization:', status);
          this.startVideoStream();
        });
      }
    });
  }

  private startVideoStream() {
    // navigator.getUserMedia({ audio: true, video: { width: 500, height: 500 } },
    //   function(stream) {
    //     console.log("Im streaming!!", stream);
    //     var video = document.querySelector('video');
    //     console.log("video element", video);
    //     video.src = window.URL.createObjectURL(stream);
    //     video.onloadedmetadata = function(e) {
    //       console.log("stream start");
    //       video.play();
    //     };
    //   },
    //   function(err) {
    //     console.log(err);
    //     console.log("The following error occurred: " + err.name);
    //   }
    // );

    return getUserMedia({ audio: true, video: { width: 500, height: 500 } }).then((stream) => {
      console.log("Im streaming!!", stream);
      var video = document.querySelector('video');
      console.log("video element", video);
      video.src = window.URL.createObjectURL(stream);
      video.onloadedmetadata = function(e) {
        console.log("stream start");
        video.play();
      };
    }).catch((err) => {
      console.log(err);
      console.log("The following error occurred: " + err.name);
    });
  }

}
